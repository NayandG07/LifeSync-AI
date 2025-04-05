import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ResponsiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  compact?: boolean;
  noPadding?: boolean;
  isInteractive?: boolean;
  centerContent?: boolean;
  size?: "sm" | "md" | "lg";
}

const ResponsiveCard = ({
  title,
  description,
  children,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  compact = false,
  noPadding = false,
  isInteractive = false,
  centerContent = false,
  size = "md",
  ...props
}: ResponsiveCardProps) => {
  // Use useMemo to compute derived values
  const cardClassNames = useMemo(() => {
    return cn(
      "border rounded-xl overflow-hidden backdrop-blur-sm",
      "bg-white/80 dark:bg-gray-900/80",
      "border-gray-200/70 dark:border-gray-800/70",
      "shadow-sm hover:shadow-md transition-all duration-200",
      isInteractive && "hover:scale-[1.01] cursor-pointer",
      compact && "max-w-md mx-auto",
      className
    );
  }, [className, compact, isInteractive]);
  
  // Sizing based on prop
  const sizeClasses = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          header: "pb-1 px-2 pt-2 md:px-4 md:pt-3 md:pb-2",
          content: "px-2 pt-1 pb-2 md:px-4 md:pt-2 md:pb-3",
          footer: "px-2 py-1.5 md:px-4 md:py-2"
        };
      case "lg":
        return {
          header: "pb-3 px-5 pt-5 md:px-7 md:pt-7 md:pb-4",
          content: "px-5 pt-3 pb-5 md:px-7 md:pt-3 md:pb-7",
          footer: "px-5 py-4 md:px-7 md:py-5"
        };
      default: // md
        return {
          header: "pb-2 px-3 pt-3 md:px-6 md:pt-6 md:pb-3",
          content: "px-3 pt-2 pb-3 md:px-6 md:pt-2 md:pb-6",
          footer: "px-3 py-2 md:px-6 md:py-4"
        };
    }
  }, [size]);
  
  const headerClassNames = useMemo(() => {
    return cn(
      "relative",
      sizeClasses.header,
      centerContent && "text-center",
      headerClassName
    );
  }, [centerContent, headerClassName, sizeClasses.header]);
  
  const titleClassNames = useMemo(() => {
    return cn(
      size === "sm" ? "text-lg md:text-xl" : "text-xl md:text-2xl",
      "font-bold",
      "bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent"
    );
  }, [size]);
  
  const contentClassNames = useMemo(() => {
    return cn(
      "relative",
      !noPadding && sizeClasses.content,
      (!title && !description) && (size === "sm" ? "pt-2 md:pt-3" : "pt-3 md:pt-6"),
      centerContent && "flex items-center justify-center text-center",
      contentClassName
    );
  }, [noPadding, title, description, centerContent, contentClassName, sizeClasses.content, size]);
  
  const footerClassNames = useMemo(() => {
    return cn(
      sizeClasses.footer,
      "border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50",
      centerContent && "flex justify-center",
      footerClassName
    );
  }, [centerContent, footerClassName, sizeClasses.footer]);

  // Always render the same structure with conditionals for content
  return (
    <Card className={cardClassNames} {...props}>
      {/* Always render CardHeader but conditionally show its content */}
      <CardHeader className={headerClassNames} style={{ display: (title || description) ? 'block' : 'none' }}>
        {title && (
          <CardTitle className={titleClassNames}>
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className={contentClassNames}>
        {children}
      </CardContent>
      
      {/* Always render CardFooter but conditionally show its content */}
      <CardFooter
        className={footerClassNames}
        style={{ display: footer ? 'flex' : 'none' }}
      >
        {footer}
      </CardFooter>
    </Card>
  );
};

export { ResponsiveCard }; 