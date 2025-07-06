
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Mail, Zap } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      title: "Active Candidates",
      value: "24",
      change: "+12%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Technical Interviews",
      value: "8",
      change: "+25%",
      icon: Calendar,
      trend: "up",
    },
    {
      title: "Resumes Parsed",
      value: "156",
      change: "+8%",
      icon: Mail,
      trend: "up",
    },
    {
      title: "Questions Generated",
      value: "342",
      change: "+15%",
      icon: Zap,
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground font-mono">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-xl font-bold text-foreground font-mono">{stat.value}</div>
              <div className="text-xs font-medium text-accent font-mono">{stat.change}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
