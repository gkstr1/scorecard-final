
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Mail, Zap } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      title: "Total Candidates",
      value: "24",
      change: "+12%",
      icon: Users,
      trend: "up",
      description: "Active in pipeline"
    },
    {
      title: "This Week's Interviews",
      value: "8",
      change: "+25%",
      icon: Calendar,
      trend: "up",
      description: "Scheduled sessions"
    },
    {
      title: "Resumes Processed",
      value: "156",
      change: "+8%",
      icon: Mail,
      trend: "up",
      description: "This month"
    },
    {
      title: "Questions Generated",
      value: "342",
      change: "+15%",
      icon: Zap,
      trend: "up",
      description: "AI powered"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </div>
            <stat.icon className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm font-medium text-accent">{stat.change}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
