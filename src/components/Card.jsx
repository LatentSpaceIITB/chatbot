import { cn } from "../lib/utils";
import React from "react";
const Card = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
};

const CardContent = ({ className, ...props }) => {
  return (
    <div
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
};

export { Card, CardContent };