import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Send, FileText, Users, Clock, Download, Eye, Calendar, Mail, CheckCircle, AlertCircle, Plus, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ClientJob {
  id: string;
  title: string;
  client_name: string;
  client_id: string;
  status: string;
  created_at: string;
  candidates_count: number;
  interviews_count: number;
  hires_count: number;
}

interface ReportData {
  job: ClientJob;
  candidates: Array<{
    id: string;
    name: string;
    status: string;
    applied_date: string;
    position: string;
    email: string;
  }>;
  summary: {
    totalApplications: number;
    shortlisted: number;
    interviewed: number;
    offered: number;
    hired: number;
    rejected: number;
  };
}

const statusColors: Record<string, string> = {
  applied: 'hsl(var(--muted))',
  screening: 'hsl(var(--primary))',
  interview: 'hsl(var(--accent))',
  offer: 'hsl(var(--warning))',
  hired: 'hsl(var(--success))',
  rejected: 'hsl(var(--destructive))',
};

export function ReportsOverview() {
  const [clientJobs, setClientJobs] = useState<ClientJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingReport, setSendingReport] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [reportNotes, setReportNotes] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  useEffect(() => {
    fetchClientJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchReportData(selectedJob);
    }
  }, [selectedJob]);

  const fetchClientJobs = async () => {
    setLoading(true);
    try {
      // Fetch jobs with client information
      const { data: jobs } = await supabase
        .from('job_descriptions')
        .select(`
          id,
          title,
          created_at,
          is_active,
          clients (
            id,
            name
          )
        `)
        .eq('is_active', true);

      if (jobs) {
        // Get candidate counts for each job
        const jobsWithCounts = await Promise.all(
          jobs.map(async (job) => {
            const { count: candidatesCount } = await supabase
              .from('candidates')
              .select('*', { count: 'exact' })
              .eq('job_id', job.id);

            const { count: interviewsCount } = await supabase
              .from('interviews')
              .select('*', { count: 'exact' })
              .in('candidate_id', 
                (await supabase.from('candidates').select('id').eq('job_id', job.id)).data?.map(c => c.id) || []
              );

            const { count: hiresCount } = await supabase
              .from('candidates')
              .select('*', { count: 'exact' })
              .eq('job_id', job.id)
              .eq('status', 'hired');

            return {
              id: job.id,
              title: job.title,
              client_name: job.clients?.name || 'No Client',
              client_id: job.clients?.id || '',
              status: job.is_active ? 'Active' : 'Inactive',
              created_at: job.created_at,
              candidates_count: candidatesCount || 0,
              interviews_count: interviewsCount || 0,
              hires_count: hiresCount || 0,
            };
          })
        );

        setClientJobs(jobsWithCounts);
        if (jobsWithCounts.length > 0) {
          setSelectedJob(jobsWithCounts[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching client jobs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch client jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReportData = async (jobId: string) => {
    try {
      const job = clientJobs.find(j => j.id === jobId);
      if (!job) return;

      // Fetch candidates for this job
      const { data: candidates } = await supabase
        .from('candidates')
        .select('*')
        .eq('job_id', jobId)
        .order('applied_date', { ascending: false });

      if (candidates) {
        // Calculate summary statistics
        const summary = {
          totalApplications: candidates.length,
          shortlisted: candidates.filter(c => c.status === 'screening').length,
          interviewed: candidates.filter(c => c.status === 'interview').length,
          offered: candidates.filter(c => c.status === 'offer').length,
          hired: candidates.filter(c => c.status === 'hired').length,
          rejected: candidates.filter(c => c.status === 'rejected').length,
        };

        setReportData({
          job,
          candidates,
          summary,
        });
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const handleSendReport = async () => {
    if (!reportData || !recipientEmail) {
      toast({
        title: "Error",
        description: "Please select a job and enter recipient email",
        variant: "destructive",
      });
      return;
    }

    setSendingReport(true);
    try {
      // Call edge function to send report email
      const { error } = await supabase.functions.invoke('send-client-report', {
        body: {
          reportData,
          recipientEmail,
          notes: reportNotes,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report sent successfully to client",
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

  const generatePDF = () => {
    // This would generate a PDF version of the report
    toast({
      title: "Coming Soon",
      description: "PDF generation will be available soon",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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

  if (clientJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Building className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Active Jobs Found</h3>
        <p className="text-muted-foreground mb-4">Create jobs with clients to generate recruitment reports</p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Job
        </Button>
      </div>
    );
  }

  const chartData = reportData ? [
    { name: 'Applied', value: reportData.summary.totalApplications, color: statusColors.applied },
    { name: 'Screening', value: reportData.summary.shortlisted, color: statusColors.screening },
    { name: 'Interview', value: reportData.summary.interviewed, color: statusColors.interview },
    { name: 'Offer', value: reportData.summary.offered, color: statusColors.offer },
    { name: 'Hired', value: reportData.summary.hired, color: statusColors.hired },
    { name: 'Rejected', value: reportData.summary.rejected, color: statusColors.rejected },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Client Reports</h2>
          <p className="text-muted-foreground">Generate and send recruitment progress reports to hiring managers</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select job position" />
            </SelectTrigger>
            <SelectContent>
              {clientJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  <div className="flex items-center gap-2">
                    <span>{job.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {job.client_name}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={generatePDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          
          <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Send Report to Client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Recipient Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="client@company.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional context or updates for the client..."
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendReport} disabled={sendingReport}>
                    {sendingReport ? 'Sending...' : 'Send Report'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {reportData && (
        <>
          {/* Job Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {reportData.job.title} - Recruitment Report
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Client: {reportData.job.client_name}</span>
                <span>Posted: {format(new Date(reportData.job.created_at), 'MMM dd, yyyy')}</span>
                <Badge variant="outline">{reportData.job.status}</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{reportData.summary.totalApplications}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{reportData.summary.shortlisted}</p>
                  <p className="text-sm text-muted-foreground">Screening</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{reportData.summary.interviewed}</p>
                  <p className="text-sm text-muted-foreground">Interviewed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{reportData.summary.offered}</p>
                  <p className="text-sm text-muted-foreground">Offers</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{reportData.summary.hired}</p>
                  <p className="text-sm text-muted-foreground">Hired</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{reportData.summary.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Pipeline Status</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No candidates data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Candidates */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {reportData.candidates.slice(0, 8).map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Applied: {format(new Date(candidate.applied_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge 
                        variant={candidate.status === 'hired' ? 'default' : 'outline'}
                        className="capitalize"
                      >
                        {candidate.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                  {reportData.candidates.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No candidates yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary for Client */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-muted-foreground mb-4">
                  Here's the latest recruitment progress for the <strong>{reportData.job.title}</strong> position:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Received <strong>{reportData.summary.totalApplications}</strong> total applications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span><strong>{reportData.summary.shortlisted}</strong> candidates are currently in screening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span><strong>{reportData.summary.interviewed}</strong> candidates have been interviewed</span>
                  </li>
                  {reportData.summary.hired > 0 && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span><strong>{reportData.summary.hired}</strong> candidates have been successfully hired</span>
                    </li>
                  )}
                </ul>

                {reportData.summary.totalApplications > 0 && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Conversion Rate:</strong> {' '}
                      {reportData.summary.totalApplications > 0 
                        ? Math.round((reportData.summary.interviewed / reportData.summary.totalApplications) * 100)
                        : 0}% of applicants reached the interview stage
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}