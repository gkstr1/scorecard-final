import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Users, Clock, Target, TrendingUp, Download, Calendar, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface AnalyticsData {
  totalCandidates: number;
  totalJobs: number;
  totalInterviews: number;
  avgTimeToHire: number;
  pipelineConversion: Array<{ stage: string; count: number; percentage: number }>;
  hiringTrends: Array<{ date: string; applications: number; hires: number }>;
  topSkills: Array<{ skill: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number; color: string }>;
}

const chartConfig = {
  applications: {
    label: "Applications",
    color: "hsl(var(--primary))",
  },
  hires: {
    label: "Hires", 
    color: "hsl(var(--accent))",
  },
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  }
};

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))',
  'hsl(var(--destructive))',
  'hsl(var(--warning))',
];

export function ReportsOverview() {
  const [data, setData] = useState<AnalyticsData>({
    totalCandidates: 0,
    totalJobs: 0,
    totalInterviews: 0,
    avgTimeToHire: 0,
    pipelineConversion: [],
    hiringTrends: [],
    topSkills: [],
    statusDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, parseInt(dateRange));

      // Fetch basic counts
      const [candidatesRes, jobsRes, interviewsRes] = await Promise.all([
        supabase
          .from('candidates')
          .select('*', { count: 'exact' })
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('job_descriptions')
          .select('*', { count: 'exact' })
          .gte('created_at', startDate.toISOString()),
        supabase
          .from('interviews')
          .select('*', { count: 'exact' })
          .gte('created_at', startDate.toISOString()),
      ]);

      // Fetch candidates with detailed info
      const { data: candidates } = await supabase
        .from('candidates')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Calculate pipeline conversion
      const statusCounts = candidates?.reduce((acc, candidate) => {
        acc[candidate.status] = (acc[candidate.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const totalCandidates = candidates?.length || 0;
      const pipelineConversion = Object.entries(statusCounts).map(([status, count]) => ({
        stage: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
        count,
        percentage: totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0,
      }));

      // Status distribution with colors
      const statusDistribution = Object.entries(statusCounts).map(([status, count], index) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
        count,
        color: COLORS[index % COLORS.length],
      }));

      // Calculate hiring trends (simplified - using application dates)
      const hiringTrends = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(endDate, i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayApplications = candidates?.filter(c => {
          const appDate = new Date(c.applied_date);
          return appDate >= dayStart && appDate <= dayEnd;
        }).length || 0;

        const dayHires = candidates?.filter(c => {
          const appDate = new Date(c.applied_date);
          return appDate >= dayStart && appDate <= dayEnd && c.status === 'hired';
        }).length || 0;

        hiringTrends.push({
          date: format(dayStart, 'MMM dd'),
          applications: dayApplications,
          hires: dayHires,
        });
      }

      // Extract top skills
      const skillsMap: Record<string, number> = {};
      candidates?.forEach(candidate => {
        candidate.skills?.forEach((skill: string) => {
          skillsMap[skill] = (skillsMap[skill] || 0) + 1;
        });
      });

      const topSkills = Object.entries(skillsMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }));

      // Calculate average time to hire (simplified)
      const hiredCandidates = candidates?.filter(c => c.status === 'hired') || [];
      const avgTimeToHire = hiredCandidates.length > 0 
        ? Math.round(hiredCandidates.reduce((acc, candidate) => {
            const days = Math.floor((new Date().getTime() - new Date(candidate.applied_date).getTime()) / (1000 * 60 * 60 * 24));
            return acc + days;
          }, 0) / hiredCandidates.length)
        : 0;

      setData({
        totalCandidates: candidatesRes.count || 0,
        totalJobs: jobsRes.count || 0,
        totalInterviews: interviewsRes.count || 0,
        avgTimeToHire,
        pipelineConversion,
        hiringTrends,
        topSkills,
        statusDistribution,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-foreground">Recruitment Analytics</h2>
          <p className="text-muted-foreground">Track your hiring performance and pipeline metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold text-foreground">{data.totalCandidates}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold text-foreground">{data.totalJobs}</p>
              </div>
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interviews Scheduled</p>
                <p className="text-2xl font-bold text-foreground">{data.totalInterviews}</p>
              </div>
              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time to Hire</p>
                <p className="text-2xl font-bold text-foreground">{data.avgTimeToHire} days</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Conversion */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.pipelineConversion}>
                  <XAxis 
                    dataKey="stage" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.stage}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.count} candidates ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ status, percentage = 0 }) => 
                      `${status}: ${Math.round((percentage || 0) * 100)}%`
                    }
                  >
                    {data.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.status}</p>
                            <p className="text-sm text-muted-foreground">{data.count} candidates</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Hiring Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.hiringTrends}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="applications" 
                    stackId="1" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hires" 
                    stackId="2" 
                    stroke="hsl(var(--accent))" 
                    fill="hsl(var(--accent))" 
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Most In-Demand Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topSkills} layout="horizontal">
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="skill" type="category" tick={{ fontSize: 12 }} width={80} />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.skill}</p>
                            <p className="text-sm text-muted-foreground">{data.count} candidates</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}