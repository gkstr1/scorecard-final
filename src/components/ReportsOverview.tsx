import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Send, Users, Target, Clock, TrendingUp, Briefcase, CheckCircle, BarChart3, PieChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  status: string;
  applied_date: string;
  job_id: string;
}

interface JobDescription {
  id: string;
  title: string;
  created_at: string;
  client_id: string;
  clients?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Interview {
  id: string;
  candidate_id: string;
  scheduled_date: string;
  status: string;
}

interface WeeklyActivity {
  weekStart: string;
  newCandidates: number;
  interviews: number;
  offers: number;
  hires: number;
}

const COLORS = {
  applied: 'hsl(var(--muted-foreground))',
  screening: 'hsl(var(--primary))',
  interview: 'hsl(var(--accent))',
  offer: 'hsl(var(--warning))',
  hired: 'hsl(var(--success))',
  rejected: 'hsl(var(--destructive))',
};

export function ReportsOverview() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [sendingReport, setSendingReport] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const daysAgo = parseInt(dateRange);
      const fromDate = subDays(new Date(), daysAgo).toISOString();

      // Fetch candidates
      const { data: candidatesData } = await supabase
        .from('candidates')
        .select('*')
        .gte('applied_date', fromDate)
        .order('applied_date', { ascending: false });

      // Fetch jobs with client info
      const { data: jobsData } = await supabase
        .from('job_descriptions')
        .select(`
          *,
          clients (
            id,
            name,
            email
          )
        `)
        .eq('is_active', true);

      // Fetch interviews
      const { data: interviewsData } = await supabase
        .from('interviews')
        .select('*')
        .gte('scheduled_date', fromDate)
        .order('scheduled_date', { ascending: false });

      setCandidates(candidatesData || []);
      setJobs(jobsData || []);
      setInterviews(interviewsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendWeeklyReport = async () => {
    if (!recipientEmail) {
      toast({
        title: "Error",
        description: "Please enter recipient email",
        variant: "destructive",
      });
      return;
    }

    setSendingReport(true);
    try {
      const weeklyData = generateWeeklyActivityData();
      const pipelineStats = calculatePipelineStats();
      
      const { error } = await supabase.functions.invoke('send-client-report', {
        body: {
          type: 'weekly_activity',
          recipientEmail,
          notes: reportNotes,
          data: {
            weeklyActivity: weeklyData,
            pipelineStats,
            candidates: candidates.slice(0, 10),
            totalJobs: jobs.length,
            totalCandidates: candidates.length,
            totalInterviews: interviews.length,
            dateRange: `Last ${dateRange} days`,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Weekly activity report sent successfully",
      });
      
      setShowSendDialog(false);
      setReportNotes('');
      setRecipientEmail('');
    } catch (error) {
      console.error('Error sending report:', error);
      toast({
        title: "Error",
        description: "Failed to send report. Please check your email configuration.",
        variant: "destructive",
      });
    } finally {
      setSendingReport(false);
    }
  };

  const calculatePipelineStats = () => {
    const stats = {
      applied: candidates.filter(c => c.status === 'applied').length,
      screening: candidates.filter(c => c.status === 'screening').length,
      interview: candidates.filter(c => c.status === 'interview').length,
      offer: candidates.filter(c => c.status === 'offer').length,
      hired: candidates.filter(c => c.status === 'hired').length,
      rejected: candidates.filter(c => c.status === 'rejected').length,
    };

    const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
    const conversionRate = total > 0 ? ((stats.hired / total) * 100).toFixed(1) : '0';
    
    return { ...stats, total, conversionRate };
  };

  const generateWeeklyActivityData = (): WeeklyActivity[] => {
    const weeks: WeeklyActivity[] = [];
    const daysAgo = parseInt(dateRange);
    
    for (let i = 0; i < Math.min(4, Math.ceil(daysAgo / 7)); i++) {
      const weekStart = startOfWeek(subDays(new Date(), i * 7));
      const weekEnd = endOfWeek(weekStart);
      
      const weekCandidates = candidates.filter(c => {
        const appliedDate = new Date(c.applied_date);
        return appliedDate >= weekStart && appliedDate <= weekEnd;
      });

      const weekInterviews = interviews.filter(i => {
        const interviewDate = new Date(i.scheduled_date);
        return interviewDate >= weekStart && interviewDate <= weekEnd;
      });

      weeks.push({
        weekStart: format(weekStart, 'MMM dd'),
        newCandidates: weekCandidates.length,
        interviews: weekInterviews.length,
        offers: weekCandidates.filter(c => c.status === 'offer').length,
        hires: weekCandidates.filter(c => c.status === 'hired').length,
      });
    }
    
    return weeks.reverse();
  };

  const pipelineStats = calculatePipelineStats();
  const weeklyData = generateWeeklyActivityData();

  const pieData = [
    { name: 'Applied', value: pipelineStats.applied, color: COLORS.applied },
    { name: 'Screening', value: pipelineStats.screening, color: COLORS.screening },
    { name: 'Interview', value: pipelineStats.interview, color: COLORS.interview },
    { name: 'Offer', value: pipelineStats.offer, color: COLORS.offer },
    { name: 'Hired', value: pipelineStats.hired, color: COLORS.hired },
    { name: 'Rejected', value: pipelineStats.rejected, color: COLORS.rejected },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics & Reports</h2>
          <p className="text-muted-foreground">Track recruitment performance and send activity reports to hiring managers</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Weekly Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Send Weekly Activity Report</DialogTitle>
                <DialogDescription>
                  Send a summary of recruitment activity to hiring managers
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Recipient Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="manager@company.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any highlights or updates for this week..."
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendWeeklyReport} disabled={sendingReport}>
                    {sendingReport ? 'Sending...' : 'Send Report'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pipelineStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Last {dateRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently open positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviews.length}</div>
            <p className="text-xs text-muted-foreground">
              Last {dateRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pipelineStats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Application to hire rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Recruitment activity over recent weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="weekStart" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="newCandidates" name="New Candidates" fill="hsl(var(--primary))" />
                  <Bar dataKey="interviews" name="Interviews" fill="hsl(var(--accent))" />
                  <Bar dataKey="offers" name="Offers" fill="hsl(var(--warning))" />
                  <Bar dataKey="hires" name="Hires" fill="hsl(var(--success))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
            <CardDescription>Current candidate status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No candidate data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Candidates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Candidates</CardTitle>
            <CardDescription>Latest applications received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidates.slice(0, 5).map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={candidate.status === 'hired' ? 'default' : 'outline'}>
                      {candidate.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(candidate.applied_date), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))}
              {candidates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No candidates found for the selected period
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Scheduled interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interviews
                .filter(i => new Date(i.scheduled_date) > new Date())
                .slice(0, 5)
                .map((interview) => {
                  const candidate = candidates.find(c => c.id === interview.candidate_id);
                  return (
                    <div key={interview.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{candidate?.name || 'Unknown Candidate'}</p>
                        <p className="text-sm text-muted-foreground">{candidate?.position}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{interview.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(interview.scheduled_date), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              {interviews.filter(i => new Date(i.scheduled_date) > new Date()).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming interviews scheduled
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}