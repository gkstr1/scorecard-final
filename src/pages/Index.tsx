
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar, FileText, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CandidateCard from "@/components/CandidateCard";
import InterviewQueue from "@/components/InterviewQueue";
import StatsOverview from "@/components/StatsOverview";

const Index = () => {
  const [activeTab, setActiveTab] = useState("pipeline");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Scorecard</h1>
              <Badge variant="secondary" className="text-xs">
                Modern ATS
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-10 w-64"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "pipeline", label: "Pipeline", icon: Users },
              { id: "interviews", label: "Interviews", icon: Calendar },
              { id: "emails", label: "Email Tracking", icon: Mail },
              { id: "analytics", label: "Analytics", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "pipeline" && (
          <div className="space-y-8">
            <StatsOverview />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Active Candidates
                  </h2>
                  <Button variant="outline" size="sm">
                    Import from Email
                  </Button>
                </div>
                <div className="space-y-4">
                  <CandidateCard
                    name="Sarah Chen"
                    position="Senior React Developer"
                    email="sarah.chen@email.com"
                    status="technical-interview"
                    skills={["React", "TypeScript", "Node.js"]}
                    appliedDate="2 days ago"
                  />
                  <CandidateCard
                    name="Michael Rodriguez"
                    position="Full Stack Engineer"
                    email="m.rodriguez@email.com"
                    status="screening"
                    skills={["Python", "Django", "PostgreSQL"]}
                    appliedDate="5 days ago"
                  />
                  <CandidateCard
                    name="Emily Johnson"
                    position="Frontend Developer"
                    email="emily.j@email.com"
                    status="offer"
                    skills={["Vue.js", "JavaScript", "CSS"]}
                    appliedDate="1 week ago"
                  />
                </div>
              </div>
              <div>
                <InterviewQueue />
              </div>
            </div>
          </div>
        )}

        {activeTab === "interviews" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Technical Interviews
              </h2>
              <Button>Schedule Interview</Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Interview Management
                  </h3>
                  <p className="text-gray-500">
                    AI-powered technical interviews based on candidate resumes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "emails" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Email Tracking
              </h2>
              <Button variant="outline">Connect Email</Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Email Integration
                  </h3>
                  <p className="text-gray-500">
                    Track candidate communications and parse resumes automatically
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Recruiting Analytics
                  </h3>
                  <p className="text-gray-500">
                    Track your hiring performance and pipeline metrics
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
