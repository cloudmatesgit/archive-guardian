import { Badge } from '@/components/ui/badge';
import { Tier } from '@/types';
import { cn } from '@/lib/utils';
import { Flame, Sun, Snowflake, Archive } from 'lucide-react';

interface TierBadgeProps {
  tier: Tier;
  showIcon?: boolean;
  className?: string;
}

const tierConfig = {
  HOT: {
    icon: Flame,
    className: 'tier-badge-hot',
  },
  WARM: {
    icon: Sun,
    className: 'tier-badge-warm',
  },
  COLD: {
    icon: Snowflake,
    className: 'tier-badge-cold',
  },
  ARCHIVE: {
    icon: Archive,
    className: 'tier-badge-archive',
  },
};

export function TierBadge({ tier, showIcon = true, className }: TierBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn('font-medium', config.className, className)}>
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {tier}
    </Badge>
  );
}
