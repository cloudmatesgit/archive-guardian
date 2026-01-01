import { Badge } from '@/components/ui/badge';
import { FileStatus, JobStatus, RestoreStatus } from '@/types';
import { cn } from '@/lib/utils';

type Status = FileStatus | JobStatus | RestoreStatus;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  // File Status
  Local: { variant: 'secondary', className: 'bg-muted text-muted-foreground' },
  Archived: { variant: 'outline', className: 'bg-purple-500/10 text-purple-600 border-purple-200' },
  Restoring: { variant: 'outline', className: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  Pending: { variant: 'outline', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
  
  // Job Status
  Running: { variant: 'outline', className: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  Completed: { variant: 'outline', className: 'bg-green-500/10 text-green-600 border-green-200' },
  Failed: { variant: 'destructive', className: '' },
  Cancelled: { variant: 'secondary', className: '' },
  
  // Restore Status
  Requested: { variant: 'outline', className: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
  Available: { variant: 'outline', className: 'bg-green-500/10 text-green-600 border-green-200' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { variant: 'secondary', className: '' };

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {status}
    </Badge>
  );
}
