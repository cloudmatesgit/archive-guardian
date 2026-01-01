import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { TierBadge } from '@/components/common/TierBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { mockFiles } from '@/data/mockData';
import { formatBytes, formatDate, getDaysSince } from '@/lib/utils';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Archive,
  RotateCcw,
  Trash2,
  FileText,
  Folder,
} from 'lucide-react';
import { Tier, FileStatus } from '@/types';

export default function FileInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<FileStatus | 'all'>('all');

  const filteredFiles = mockFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || file.tier === tierFilter;
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    return matchesSearch && matchesTier && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="File Inventory"
        description="Browse and manage files across all storage tiers"
        actions={
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files by name or path..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={tierFilter} onValueChange={(v) => setTierFilter(v as Tier | 'all')}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="HOT">HOT</SelectItem>
                  <SelectItem value="WARM">WARM</SelectItem>
                  <SelectItem value="COLD">COLD</SelectItem>
                  <SelectItem value="ARCHIVE">ARCHIVE</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as FileStatus | 'all')}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Local">Local</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                  <SelectItem value="Restoring">Restoring</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="data-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">File Name</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead>Last Accessed</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate max-w-[250px]">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Folder className="h-3 w-3" />
                        <span className="truncate max-w-[200px]">{file.path}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatBytes(file.size)}</TableCell>
                    <TableCell>
                      <div>
                        <span>{formatDate(file.lastAccessed)}</span>
                        <span className="block text-xs text-muted-foreground">
                          {getDaysSince(file.lastAccessed)} days ago
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(file.lastModified)}</TableCell>
                    <TableCell>
                      <TierBadge tier={file.tier} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={file.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {file.status === 'Local' && (
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          )}
                          {file.status === 'Archived' && (
                            <DropdownMenuItem>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Restore
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredFiles.length} of {mockFiles.length} files
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
