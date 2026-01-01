import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { TierBadge } from '@/components/common/TierBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockPolicies } from '@/data/mockData';
import { formatDate } from '@/lib/utils';
import { Plus, Pencil, Play, Trash2, Clock, FileType, Folder, Settings2 } from 'lucide-react';
import { TieringPolicy, Tier, StorageClass } from '@/types';

export default function TieringPolicies() {
  const [policies, setPolicies] = useState<TieringPolicy[]>(mockPolicies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTogglePolicy = (policyId: string) => {
    setPolicies(
      policies.map((p) => (p.id === policyId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const postActionLabels = {
    delete: 'Delete local copy',
    move: 'Move to archive folder',
    placeholder: 'Leave placeholder',
  };

  return (
    <div>
      <PageHeader
        title="Tiering Policies"
        description="Configure automatic file classification and movement rules"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Tiering Policy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Policy Name</Label>
                  <Input placeholder="e.g., Archive Old Backups" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Age Threshold (days)</Label>
                    <Input type="number" placeholder="365" className="mt-1" />
                  </div>
                  <div>
                    <Label>Target Tier</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOT">HOT</SelectItem>
                        <SelectItem value="WARM">WARM</SelectItem>
                        <SelectItem value="COLD">COLD</SelectItem>
                        <SelectItem value="ARCHIVE">ARCHIVE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>File Types (comma-separated)</Label>
                  <Input placeholder="pdf, docx, xlsx" className="mt-1" />
                </div>
                <div>
                  <Label>Path Pattern</Label>
                  <Input placeholder="/backups/*" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Storage Class</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S3 Standard">S3 Standard</SelectItem>
                        <SelectItem value="S3 IA">S3 IA</SelectItem>
                        <SelectItem value="Glacier">Glacier</SelectItem>
                        <SelectItem value="Deep Archive">Deep Archive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Post-Action</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delete">Delete local copy</SelectItem>
                        <SelectItem value="move">Move to archive</SelectItem>
                        <SelectItem value="placeholder">Leave placeholder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Create Policy</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Policies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {policies.map((policy) => (
          <Card key={policy.id} className={!policy.enabled ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      policy.enabled ? 'bg-primary/10' : 'bg-muted'
                    }`}
                  >
                    <Settings2
                      className={`h-5 w-5 ${
                        policy.enabled ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-base">{policy.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Created {formatDate(policy.createdAt)}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={policy.enabled}
                  onCheckedChange={() => handleTogglePolicy(policy.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conditions */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Conditions
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-normal">
                    <Clock className="h-3 w-3 mr-1" />
                    {policy.conditions.ageInDays} days old
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    <FileType className="h-3 w-3 mr-1" />
                    {policy.conditions.fileTypes.join(', ')}
                  </Badge>
                  <Badge variant="outline" className="font-normal font-mono text-xs">
                    <Folder className="h-3 w-3 mr-1" />
                    {policy.conditions.pathPattern}
                  </Badge>
                </div>
              </div>

              {/* Target */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Target Tier</p>
                  <TierBadge tier={policy.targetTier} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Storage Class</p>
                  <Badge variant="secondary">{policy.storageClass}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Post-Action</p>
                  <Badge variant="secondary">{postActionLabels[policy.postAction]}</Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="h-3 w-3 mr-1" />
                  Simulate
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
