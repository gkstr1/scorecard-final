import { Brain } from "lucide-react";

interface ScorecardLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const ScorecardLogo = ({ size = "md", showText = true, className = "" }: ScorecardLogoProps) => {
  const sizeClasses = {
    sm: {
      container: "flex items-center space-x-2",
      icon: "w-6 h-6",
      iconContainer: "w-8 h-8",
      text: "text-lg font-bold"
    },
    md: {
      container: "flex items-center space-x-3",
      icon: "w-7 h-7",
      iconContainer: "w-10 h-10",
      text: "text-xl font-bold"
    },
    lg: {
      container: "flex items-center space-x-4",
      icon: "w-8 h-8",
      iconContainer: "w-12 h-12",
      text: "text-2xl font-bold"
    },
    xl: {
      container: "flex items-center space-x-5",
      icon: "w-10 h-10",
      iconContainer: "w-16 h-16",
      text: "text-3xl font-bold"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${currentSize.container} ${className}`}>
      <div className={`${currentSize.iconContainer} bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg`}>
        <Brain className={`${currentSize.icon} text-primary-foreground`} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${currentSize.text} text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}>
            Scorecard
          </span>
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            AI-Powered Recruiting
          </span>
        </div>
      )}
    </div>
  );
};

export default ScorecardLogo;
