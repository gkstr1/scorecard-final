import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Briefcase, GraduationCap, MapPin, Users, CheckCircle } from "lucide-react";
import { LinkedInProfile } from "@/services/linkedinService";

interface LinkedInProfilePreviewProps {
  profile: Partial<LinkedInProfile>;
  isLoading?: boolean;
  isVerified?: boolean;
  onRefresh?: () => void;
}

/**
 * LinkedIn Profile Preview Component
 * 
 * Displays LinkedIn profile data in a Card layout
 * Maintains Scorecard's design system
 */
export const LinkedInProfilePreview = ({
  profile,
  isLoading = false,
  isVerified = false,
  onRefresh
}: LinkedInProfilePreviewProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-4/5"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Linkedin className="h-4 w-4 text-blue-600" />
            <span>LinkedIn Profile</span>
            {isVerified && (
              <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
            )}
          </div>
          {onRefresh && (
            <button 
              onClick={onRefresh} 
              className="text-xs text-blue-600 hover:underline"
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Header */}
        <div className="flex items-center space-x-3">
          {profile.profilePicture ? (
            <img 
              src={profile.profilePicture} 
              alt={`${profile.firstName} ${profile.lastName}`}
              className="h-12 w-12 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-lg font-medium text-slate-500">
                {profile.firstName?.charAt(0) || ''}
                {profile.lastName?.charAt(0) || ''}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium">
              {profile.firstName} {profile.lastName}
            </h3>
            {profile.headline && (
              <p className="text-sm text-muted-foreground">{profile.headline}</p>
            )}
          </div>
        </div>
        
        {/* Current Position */}
        {profile.currentPosition && (
          <div className="flex items-start space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">{profile.currentPosition.title}</div>
              <div className="text-muted-foreground">{profile.currentPosition.company}</div>
            </div>
          </div>
        )}
        
        {/* Education */}
        {profile.education && (
          <div className="flex items-start space-x-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm">
              <div className="font-medium">{profile.education.school}</div>
              <div className="text-muted-foreground">{profile.education.degree}</div>
            </div>
          </div>
        )}
        
        {/* Location */}
        {profile.location && (
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{profile.location}</span>
          </div>
        )}
        
        {/* Network Size */}
        {profile.connections && (
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{profile.connections}+ connections</span>
          </div>
        )}
        
        {/* Skills (top 3) */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {profile.skills.length > 3 && (
              <span className="text-xs text-muted-foreground ml-1 self-center">
                +{profile.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedInProfilePreview;
