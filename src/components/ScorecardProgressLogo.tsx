interface ScorecardProgressLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const ScorecardProgressLogo = ({ 
  size = "md", 
  showText = true, 
  className = "", 
  animated = false 
}: ScorecardProgressLogoProps) => {
  const sizeClasses = {
    sm: {
      container: "flex items-center space-x-1",
      iconContainer: "w-6 h-6",
      text: "text-lg font-bold",
      dots: "w-1 h-1"
    },
    md: {
      container: "flex items-center space-x-1",
      iconContainer: "w-8 h-8",
      text: "text-xl font-bold",
      dots: "w-1.5 h-1.5"
    },
    lg: {
      container: "flex items-center space-x-2",
      iconContainer: "w-10 h-10",
      text: "text-2xl font-bold",
      dots: "w-2 h-2"
    },
    xl: {
      container: "flex items-center space-x-2",
      iconContainer: "w-12 h-12",
      text: "text-3xl font-bold",
      dots: "w-2.5 h-2.5"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${currentSize.container} ${className}`}>
      {showText && (
        <span className={`${currentSize.text} text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}>
          Scorecard
        </span>
      )}
      
      {/* Circular Progress Icon */}
      <div className="flex items-center">
        <div className="flex items-center space-x-0.5">
          {/* Progress Dots */}
          <div 
            className={`${currentSize.dots} rounded-full bg-gradient-to-r from-primary to-accent ${animated ? 'animate-pulse' : ''}`}
          />
          <div 
            className={`${currentSize.dots} rounded-full bg-gradient-to-r from-primary to-accent opacity-80 ${animated ? 'animate-pulse animation-delay-200' : ''}`}
          />
          <div 
            className={`${currentSize.dots} rounded-full bg-gradient-to-r from-primary to-accent opacity-60 ${animated ? 'animate-pulse animation-delay-400' : ''}`}
          />
          <div 
            className={`${currentSize.dots} rounded-full bg-muted-foreground/30`}
          />
          <div 
            className={`${currentSize.dots} rounded-full bg-muted-foreground/20`}
          />
        </div>
      </div>
    </div>
  );
};

export default ScorecardProgressLogo;
