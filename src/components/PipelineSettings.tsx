import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, Settings, Move, Lock } from "lucide-react";

const PipelineSettings = () => {
  const [defaultStages, setDefaultStages] = useState([
    { name: "Applied", required: true, color: "bg-blue-500/10 border-blue-500/30" },
    { name: "Sourced", required: true, color: "bg-gray-500/10 border-gray-500/30" },
    { name: "Technical Interview", required: true, color: "bg-purple-500/10 border-purple-500/30" },
    { name: "Submitted", required: false, color: "bg-yellow-500/10 border-yellow-500/30" },
    { name: "Hired", required: false, color: "bg-green-500/10 border-green-500/30" },
    { name: "Rejected", required: false, color: "bg-red-500/10 border-red-500/30" },
  ]);

  const [newStageName, setNewStageName] = useState("");
  const [customStages, setCustomStages] = useState([
    { name: "Portfolio Review", color: "bg-pink-500/10 border-pink-500/30" },
    { name: "Design Challenge", color: "bg-indigo-500/10 border-indigo-500/30" },
  ]);

  const addCustomStage = () => {
    if (newStageName.trim()) {
      setCustomStages([
        ...customStages,
        { 
          name: newStageName.trim(), 
          color: "bg-slate-500/10 border-slate-500/30" 
        }
      ]);
      setNewStageName("");
    }
  };

  const removeCustomStage = (index: number) => {
    setCustomStages(customStages.filter((_, i) => i !== index));
  };

  const saveSettings = () => {
    console.log("Saving pipeline settings...");
    // Here you would save to your backend/state management
  };

  return (
    <div className="space-y-6">
      {/* Default Pipeline Stages */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Settings className="h-5 w-5 text-primary" />
            <span>Default Pipeline Stages</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            These stages will be used as the default for all new job postings. Required stages cannot be removed.
          </p>
          
          <div className="space-y-3">
            {defaultStages.map((stage, index) => (
              <div
                key={index}
                className={`${stage.color} border-2 rounded-lg p-4 flex items-center justify-between`}
              >
                <div className="flex items-center space-x-3">
                  <Move className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <span className="font-medium text-foreground">{stage.name}</span>
                  {stage.required && (
                    <div className="flex items-center space-x-1">
                      <Lock className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        Required
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Stage {index + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted/20 border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Stage Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Applied:</strong> Formal application submission - cannot be removed</li>
              <li>• <strong>Sourced:</strong> Initial candidate identification - cannot be removed</li>
              <li>• <strong>Technical Interview:</strong> Skills assessment - cannot be removed</li>
              <li>• Other stages can be customized, reordered, or removed as needed</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Custom Stages */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Custom Stages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Create additional stages that can be added to specific job pipelines.
          </p>

          <div className="flex space-x-2">
            <Input
              placeholder="Enter custom stage name"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              className="text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addCustomStage()}
            />
            <Button onClick={addCustomStage} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </div>

          {customStages.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Available Custom Stages:</h4>
              <div className="space-y-2">
                {customStages.map((stage, index) => (
                  <div
                    key={index}
                    className={`${stage.color} border-2 rounded-lg p-3 flex items-center justify-between`}
                  >
                    <span className="font-medium text-foreground">{stage.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCustomStage(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Save Pipeline Settings
        </Button>
      </div>
    </div>
  );
};

export default PipelineSettings;
