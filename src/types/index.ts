export type Tier = 'HOT' | 'WARM' | 'COLD' | 'ARCHIVE';

export type FileStatus = 'Local' | 'Archived' | 'Restoring' | 'Pending';

export type StorageClass = 'S3 Standard' | 'S3 IA' | 'Glacier' | 'Deep Archive';

export type JobStatus = 'Running' | 'Completed' | 'Failed' | 'Pending' | 'Cancelled';

export type RestoreStatus = 'Requested' | 'Restoring' | 'Available' | 'Failed';

export type UserRole = 'Admin' | 'Read-only';

export interface FileItem {
  id: string;
  name: string;
  path: string;
  size: number;
  lastAccessed: Date;
  lastModified: Date;
  tier: Tier;
  status: FileStatus;
  fileType: string;
  hash?: string;
}

export interface TieringPolicy {
  id: string;
  name: string;
  conditions: {
    ageInDays: number;
    fileTypes: string[];
    pathPattern: string;
  };
  targetTier: Tier;
  storageClass: StorageClass;
  postAction: 'delete' | 'move' | 'placeholder';
  enabled: boolean;
  createdAt: Date;
}

export interface DuplicateGroup {
  id: string;
  hash: string;
  files: FileItem[];
  potentialSavings: number;
}

export interface Job {
  id: string;
  type: 'Scan' | 'Tiering' | 'Deduplication' | 'Restore' | 'Archive';
  status: JobStatus;
  startTime: Date;
  endTime?: Date;
  filesProcessed: number;
  totalFiles: number;
  errors: string[];
}

export interface StorageMetrics {
  totalUsed: number;
  byTier: {
    hot: number;
    warm: number;
    cold: number;
    archive: number;
  };
  filesScanned: number;
  estimatedSavings: number;
  pendingArchival: number;
  restoresInProgress: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}
