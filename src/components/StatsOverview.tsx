
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, UserPlus, ClipboardCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const StatsOverview = () => {
  const [stats, setStats] = useState([
    {
      title: "This Week's Interviews",
      value: "0",
      icon: Calendar,
      description: "Scheduled sessions",
      loading: true
    },
    {
      title: "Active Jobs",
      value: "0",
      icon: Briefcase,
      description: "Open positions",
      loading: true
    },
    {
      title: "New Applications Today",
      value: "0",
      icon: UserPlus,
      description: "Today's applications",
      loading: true
    },
    {
      title: "Missing Scorecards",
      value: "0",
      icon: ClipboardCheck,
      description: "Completed interviews",
      loading: true
    },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get this week's interviews
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date();
      endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);

      const { data: interviewsData } = await supabase
        .from('interviews')
        .select('id')
        .gte('scheduled_date', startOfWeek.toISOString())
        .lte('scheduled_date', endOfWeek.toISOString());

      // Get active jobs
      const { data: jobsData } = await supabase
        .from('job_descriptions')
        .select('id')
        .eq('is_active', true);

      // Get today's applications
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: applicationsData } = await supabase
        .from('candidates')
        .select('id')
        .gte('applied_date', today.toISOString())
        .lt('applied_date', tomorrow.toISOString());

      // Get completed interviews missing scorecards
      const { data: completedInterviews } = await supabase
        .from('interviews')
        .select('id')
        .eq('status', 'completed');

      const { data: existingScorecards } = await supabase
        .from('interview_scorecards')
        .select('interview_id');

      const scorecardsSet = new Set(existingScorecards?.map(s => s.interview_id));
      const missingScorecardsCount = completedInterviews?.filter(
        interview => !scorecardsSet.has(interview.id)
      ).length || 0;

      setStats([
        {
          title: "This Week's Interviews",
          value: (interviewsData?.length || 0).toString(),
          icon: Calendar,
          description: "Scheduled sessions",
          loading: false
        },
        {
          title: "Active Jobs",
          value: (jobsData?.length || 0).toString(),
          icon: Briefcase,
          description: "Open positions",
          loading: false
        },
        {
          title: "New Applications Today",
          value: (applicationsData?.length || 0).toString(),
          icon: UserPlus,
          description: "Today's applications",
          loading: false
        },
        {
          title: "Missing Scorecards",
          value: missingScorecardsCount.toString(),
          icon: ClipboardCheck,
          description: "Completed interviews",
          loading: false
        },
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => prev.map(stat => ({ ...stat, loading: false })));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </div>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.loading ? "..." : stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
