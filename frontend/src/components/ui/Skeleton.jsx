import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("loading-skeleton h-4 w-full", className)}
      {...props}
    />
  );
};

export { Skeleton };