import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { TierBadge } from '@/components/common/TierBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { mockFiles } from '@/data/mockData';
import { formatBytes, formatDate } from '@/lib/utils';
import { Archive, RotateCcw, FileText, Folder, Clock, Download } from 'lucide-react';
import { RestoreStatus } from '@/types';

const archivedFiles = mockFiles.filter((f) => f.status === 'Archived' || f.status === 'Restoring');

const restoreJobs = [
  {
    id: '1',
    fileName: 'legacy_database_backup_2019.sql',
    path: '/backups/database/',
    size: 5368709120,
    status: 'Restoring' as RestoreStatus,
    requestedAt: new Date('2024-12-31T08:00:00'),
    progress: 65,
    tier: 'Expedited',
    destination: '/restored/',
  },
  {
    id: '2',
    fileName: 'compliance_documents_2022.pdf',
    path: '/legal/compliance/',
    size: 15728640,
    status: 'Requested' as RestoreStatus,
    requestedAt: new Date('2024-12-31T10:30:00'),
    progress: 0,
    tier: 'Standard',
    destination: '/legal/active/',
  },
  {
    id: '3',
    fileName: 'marketing_assets_2021.zip',
    path: '/marketing/archive/',
    size: 2147483648,
    status: 'Available' as RestoreStatus,
    requestedAt: new Date('2024-12-30T14:00:00'),
    progress: 100,
    tier: 'Bulk',
    destination: '/marketing/assets/',
  },
];

export default function ArchiveRestore() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  return (
    <div>
      <PageHeader
        title="Archive & Restore"
        description="Manage archived files and restore data from cold storage"
      />

      <Tabs defaultValue="archived" className="space-y-4">
        <TabsList>
          <TabsTrigger value="archived">
            <Archive className="h-4 w-4 mr-2" />
            Archived Files
          </TabsTrigger>
          <TabsTrigger value="restores">
            <RotateCcw className="h-4 w-4 mr-2" />
            Restore Jobs ({restoreJobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="archived">
          {/* Selection Actions */}
          {selectedFiles.length > 0 && (
            <Card className="mb-4 border-primary">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    <span className="font-medium">{selectedFiles.length}</span> file(s) selected
                  </p>
                  <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restore Selected
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Restore Files</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <p className="text-sm text-muted-foreground">
                          You're about to restore {selectedFiles.length} file(s) from archive.
                        </p>
                        <div>
                          <Label>Restore Tier</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="expedited">
                                Expedited (1-5 minutes, higher cost)
                              </SelectItem>
                              <SelectItem value="standard">
                                Standard (3-5 hours, moderate cost)
                              </SelectItem>
                              <SelectItem value="bulk">
                                Bulk (5-12 hours, lowest cost)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Restore Destination</Label>
                          <Input placeholder="/restored/files/" className="mt-1" />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                          <Button
                            variant="outline"
                            onClick={() => setRestoreDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={() => setRestoreDialogOpen(false)}>
                            Start Restore
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <Table className="data-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead>Archived Date</TableHead>
                    <TableHead>Storage Class</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archivedFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={() => toggleFileSelection(file.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Folder className="h-3 w-3" />
                          {file.path}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatBytes(file.size)}
                      </TableCell>
                      <TableCell>{formatDate(file.lastModified)}</TableCell>
                      <TableCell>
                        <TierBadge tier="ARCHIVE" showIcon={false} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={file.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restores">
          <div className="space-y-4">
            {restoreJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <RotateCcw className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{job.fileName}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Folder className="h-3 w-3" />
                          {job.path}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p className="font-mono">{formatBytes(job.size)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Restore Tier</p>
                      <p className="font-medium">{job.tier}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Requested</p>
                      <p>{formatDate(job.requestedAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Destination</p>
                      <p className="font-mono text-xs">{job.destination}</p>
                    </div>
                  </div>

                  {job.status !== 'Available' && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}

                  {job.status === 'Available' && (
                    <div className="flex justify-end mt-2">
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
