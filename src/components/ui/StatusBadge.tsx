
import React from 'react';
import { Status } from "@/types";
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusClass = (status: Status) => {
    switch (status) {
      case 'unstable':
        return 'status-unstable';
      case 'draft':
        return 'status-draft';
      case 'stable':
        return 'status-stable';
      case 'deprecated':
        return 'status-deprecated';
      default:
        return '';
    }
  };

  return (
    <span className={cn('status-badge', getStatusClass(status), className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
