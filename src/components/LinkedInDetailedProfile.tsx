import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase,
  GraduationCap,
  MapPin,
  Users,
  Award,
  Linkedin
} from "lucide-react";
import { LinkedInProfile } from "@/services/linkedinService";

interface LinkedInDetailedProfileProps {
  profile: Partial<LinkedInProfile>;
  isLoading?: boolean;
}

const LinkedInDetailedProfile = ({ profile, isLoading = false }: LinkedInDetailedProfileProps) => {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardContent className="p-4 space-y-3">
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Position */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>Current Position</span>
            </div>
            <div className="pl-6">
              <p className="text-sm font-medium">{profile.currentPosition?.title}</p>
              <p className="text-sm text-muted-foreground">{profile.currentPosition?.company}</p>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Location</span>
            </div>
            <div className="pl-6">
              <p className="text-sm">{profile.location || "Not specified"}</p>
            </div>
          </div>

          <Separator className="col-span-2" />

          {/* Education */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>Education</span>
            </div>
            <div className="pl-6">
              {Array.isArray(profile.education) && profile.education.length > 0 ? (
                <div className="space-y-2">
                  {profile.education.map((edu, index) => (
                    <div key={index}>
                      <p className="text-sm font-medium">{edu.school}</p>
                      <p className="text-sm text-muted-foreground">{edu.degree}</p>
                      {edu.year && <p className="text-xs text-muted-foreground">{edu.year}</p>}
                    </div>
                  ))}
                </div>
              ) : profile.education?.school ? (
                <>
                  <p className="text-sm font-medium">{profile.education?.school}</p>
                  <p className="text-sm text-muted-foreground">{profile.education?.degree}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No education information</p>
              )}
            </div>
          </div>

          {/* Connections */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Network</span>
            </div>
            <div className="pl-6">
              {profile.connections ? (
                <p className="text-sm">{profile.connections}+ connections</p>
              ) : (
                <p className="text-sm text-muted-foreground">Connection count not available</p>
              )}
              <div className="flex items-center space-x-1 mt-1">
                {profile.id && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                    <Linkedin className="h-3 w-3 mr-1" />
                    Verified Profile
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="col-span-2" />

          {/* Skills */}
          <div className="col-span-2 space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span>Skills</span>
            </div>
            <div className="pl-6 flex flex-wrap gap-1">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills listed</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInDetailedProfile;
