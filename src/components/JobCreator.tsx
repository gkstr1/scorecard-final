import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, Briefcase, MapPin, DollarSign } from "lucide-react";

const JobCreator = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Senior React Developer",
      department: "Engineering",
      location: "Remote",
      salary: "$120k - $150k",
      status: "Active",
      candidates: 12,
      stages: ["Sourced", "Applied", "Phone Screening", "Technical Interview", "Final Round", "Offer"]
    },
    {
      id: 2,
      title: "Product Designer",
      department: "Design",
      location: "San Francisco, CA",
      salary: "$90k - $120k",
      status: "Draft",
      candidates: 5,
      stages: ["Sourced", "Applied", "Portfolio Review", "Design Challenge", "Final Interview", "Offer"]
    }
  ]);

  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    salary: "",
    stages: ["Sourced", "Applied", "Technical Interview"]
  });

  const [newStage, setNewStage] = useState("");

  const addStage = () => {
    if (newStage.trim() && !newJob.stages.includes(newStage)) {
      setNewJob({
        ...newJob,
        stages: [...newJob.stages, newStage.trim()]
      });
      setNewStage("");
    }
  };

  const removeStage = (stage: string) => {
    if (!["Sourced", "Applied", "Technical Interview"].includes(stage)) {
      setNewJob({
        ...newJob,
        stages: newJob.stages.filter(s => s !== stage)
      });
    }
  };

  const createJob = () => {
    if (newJob.title && newJob.department) {
      setJobs([...jobs, {
        id: jobs.length + 1,
        ...newJob,
        status: "Draft",
        candidates: 0
      }]);
      setNewJob({
        title: "",
        department: "",
        location: "",
        salary: "",
        stages: ["Sourced", "Applied", "Technical Interview"]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Job */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Briefcase className="h-5 w-5 text-primary" />
            <span>Create New Job</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Job Title</label>
              <Input
                placeholder="e.g. Senior Frontend Developer"
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Department</label>
              <Input
                placeholder="e.g. Engineering"
                value={newJob.department}
                onChange={(e) => setNewJob({...newJob, department: e.target.value})}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
              <Input
                placeholder="e.g. Remote / San Francisco, CA"
                value={newJob.location}
                onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Salary Range</label>
              <Input
                placeholder="e.g. $100k - $130k"
                value={newJob.salary}
                onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Pipeline Stages</label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {newJob.stages.map((stage, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-secondary/50 text-foreground border-border px-3 py-1 flex items-center space-x-2"
                  >
                    <span className="text-sm">{stage}</span>
                    {!["Sourced", "Applied", "Technical Interview"].includes(stage) && (
                      <button
                        onClick={() => removeStage(stage)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom stage"
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="text-sm max-w-48"
                  onKeyPress={(e) => e.key === 'Enter' && addStage()}
                />
                <Button size="sm" onClick={addStage} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: Sourced, Applied, and Technical Interview stages are required and cannot be removed.
              </p>
            </div>
          </div>

          <Button onClick={createJob} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            Create Job Posting
          </Button>
        </CardContent>
      </Card>

      {/* Existing Jobs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Active Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border border-border rounded-lg p-4 bg-muted/10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{job.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{job.department}</span>
                      </div>
                      {job.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={job.status === "Active" ? "default" : "secondary"} className="text-xs">
                      {job.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {job.candidates} candidates
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Pipeline Stages:</div>
                  <div className="flex flex-wrap gap-1">
                    {job.stages.map((stage, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                        {stage}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCreator;
