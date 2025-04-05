import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  fullWidthOnMobile?: boolean;
  centerOnMobile?: boolean;
  stackOnMobile?: boolean;
  gridCols?: number;
  gridColsMobile?: number;
  gridColsTablet?: number;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

const ResponsiveContainer = ({
  children,
  className,
  fullWidthOnMobile = false,
  centerOnMobile = false,
  stackOnMobile = false,
  gridCols = 1,
  gridColsMobile = 1,
  gridColsTablet = 2,
  gap = "md",
  padding = "md",
  margin = "none",
  ...props
}: ResponsiveContainerProps) => {
  // Map gap values to Tailwind classes
  const gapMap = useMemo(() => ({
    none: "gap-0",
    xs: "gap-1 md:gap-2",
    sm: "gap-2 md:gap-3",
    md: "gap-3 md:gap-4 lg:gap-5",
    lg: "gap-4 md:gap-6 lg:gap-8",
    xl: "gap-6 md:gap-8 lg:gap-10",
  }), []);

  // Map padding values to Tailwind classes
  const paddingMap = useMemo(() => ({
    none: "p-0",
    xs: "p-1 md:p-2",
    sm: "p-2 md:p-3",
    md: "p-3 md:p-4 lg:p-5",
    lg: "p-4 md:p-6 lg:p-8",
    xl: "p-6 md:p-8 lg:p-10",
  }), []);

  // Map margin values to Tailwind classes
  const marginMap = useMemo(() => ({
    none: "m-0",
    xs: "m-1 md:m-2",
    sm: "m-2 md:m-3",
    md: "m-3 md:m-4 lg:m-5",
    lg: "m-4 md:m-6 lg:m-8",
    xl: "m-6 md:m-8 lg:m-10",
  }), []);

  // Grid columns classes with mobile support
  const gridColsClasses = useMemo(() => {
    // Create proper grid classes with explicit mobile and tablet breakpoints
    return `grid-cols-${gridColsMobile} sm:grid-cols-${gridColsMobile} md:grid-cols-${gridColsTablet} lg:grid-cols-${gridCols}`;
  }, [gridCols, gridColsTablet, gridColsMobile]);
  
  // Mobile specific classes
  const mobileClasses = useMemo(() => {
    const classes = [];
    
    if (fullWidthOnMobile) {
      classes.push("w-full sm:w-auto");
    }
    
    if (centerOnMobile) {
      classes.push("text-center sm:text-left");
      classes.push("flex flex-col items-center sm:items-start");
    }
    
    if (stackOnMobile && gridCols > 1) {
      classes.push("flex flex-col sm:flex-row sm:grid");
    }
    
    return classes.join(" ");
  }, [fullWidthOnMobile, centerOnMobile, stackOnMobile, gridCols]);
  
  // Compute final className
  const containerClassName = useMemo(() => cn(
    // Base styles
    "w-full",
    
    // Grid if needed
    gridCols > 1 ? "grid" : "",
    gridCols > 1 ? gridColsClasses : "",
    gridCols > 1 ? gapMap[gap] : "",
    
    // Padding and margin
    paddingMap[padding],
    marginMap[margin],
    
    // Mobile modifiers
    mobileClasses,
    
    // Custom classes
    className
  ), [
    gridCols, 
    gridColsClasses, 
    gapMap, 
    gap, 
    paddingMap, 
    padding, 
    marginMap, 
    margin, 
    mobileClasses, 
    className
  ]);
  
  return (
    <div className={containerClassName} {...props}>
      {children}
    </div>
  );
};

export { ResponsiveContainer }; 