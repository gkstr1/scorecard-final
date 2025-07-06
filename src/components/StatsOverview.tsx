
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Mail, TrendingUp } from "lucide-react";

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
      title: "Interviews This Week",
      value: "8",
      change: "+25%",
      icon: Calendar,
      trend: "up",
    },
    {
      title: "Email Responses",
      value: "156",
      change: "+8%",
      icon: Mail,
      trend: "up",
    },
    {
      title: "Conversion Rate",
      value: "18%",
      change: "+3%",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm font-medium text-green-600">{stat.change}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
