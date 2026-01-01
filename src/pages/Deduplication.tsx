import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockDuplicates } from '@/data/mockData';
import { formatBytes, formatNumber } from '@/lib/utils';
import { Copy, Play, Download, Trash2, Eye, FileText, Folder, HardDrive } from 'lucide-react';
import { useState } from 'react';

export default function Deduplication() {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const totalPotentialSavings = mockDuplicates.reduce(
    (acc, group) => acc + group.potentialSavings,
    0
  );
  const totalDuplicateFiles = mockDuplicates.reduce(
    (acc, group) => acc + group.files.length - 1,
    0
  );

  const toggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div>
      <PageHeader
        title="Deduplication"
        description="Identify and manage duplicate files to reclaim storage space"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Run Scan
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Duplicate Groups"
          value={mockDuplicates.length}
          subtitle="groups identified"
          icon={Copy}
          iconColor="text-warning"
        />
        <StatCard
          title="Duplicate Files"
          value={totalDuplicateFiles}
          subtitle="files can be removed"
          icon={FileText}
          iconColor="text-info"
        />
        <StatCard
          title="Potential Savings"
          value={formatBytes(totalPotentialSavings)}
          subtitle="space recoverable"
          icon={HardDrive}
          iconColor="text-success"
        />
      </div>

      {/* Selected Actions */}
      {selectedGroups.length > 0 && (
        <Card className="mb-4 border-primary">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                <span className="font-medium">{selectedGroups.length}</span> group(s) selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Files
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Duplicates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Duplicate Groups */}
      <div className="space-y-4">
        {mockDuplicates.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedGroups.includes(group.id)}
                    onCheckedChange={() => toggleGroup(group.id)}
                  />
                  <div>
                    <CardTitle className="text-sm font-mono">{group.hash}</CardTitle>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary">{group.files.length} files</Badge>
                      <span className="text-sm text-success font-medium">
                        Save {formatBytes(group.potentialSavings)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setExpandedGroup(expandedGroup === group.id ? null : group.id)
                  }
                >
                  {expandedGroup === group.id ? 'Hide' : 'Show'} Files
                </Button>
              </div>
            </CardHeader>
            {expandedGroup === group.id && (
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead className="text-right">Size</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.files.map((file, index) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{file.name}</span>
                            {index === 0 && (
                              <Badge variant="outline" className="text-xs">
                                Original
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground font-mono text-sm">
                            <Folder className="h-3 w-3" />
                            {file.path}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatBytes(file.size)}
                        </TableCell>
                        <TableCell>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
