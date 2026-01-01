import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Calendar, Cloud, Bell, Users, Shield, Save } from 'lucide-react';

const users = [
  { id: '1', name: 'Admin User', email: 'admin@company.com', role: 'Admin', lastActive: '2024-12-31' },
  { id: '2', name: 'John Doe', email: 'john.doe@company.com', role: 'Read-only', lastActive: '2024-12-30' },
  { id: '3', name: 'Jane Smith', email: 'jane.smith@company.com', role: 'Admin', lastActive: '2024-12-29' },
];

export default function Settings() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure system preferences and manage access"
      />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general">
            <Calendar className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="tiers">
            <Shield className="h-4 w-4 mr-2" />
            Tier Thresholds
          </TabsTrigger>
          <TabsTrigger value="aws">
            <Cloud className="h-4 w-4 mr-2" />
            AWS Config
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Scan Schedule</CardTitle>
              <CardDescription>Configure automatic file system scanning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Scan Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Scan Time</Label>
                  <Input type="time" defaultValue="02:00" className="mt-1" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Incremental Scans</p>
                  <p className="text-sm text-muted-foreground">
                    Run lightweight scans between full scans
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-tier on Scan</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically apply tiering policies after each scan
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tier Thresholds */}
        <TabsContent value="tiers">
          <Card>
            <CardHeader>
              <CardTitle>Tier Thresholds</CardTitle>
              <CardDescription>
                Define age thresholds for automatic tier classification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg border-red-200 bg-red-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <Label className="text-red-700">HOT Tier</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Files accessed within the last
                  </p>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="30" className="w-24" />
                    <span className="text-sm">days</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg border-orange-200 bg-orange-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    <Label className="text-orange-700">WARM Tier</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Files accessed between
                  </p>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="31" className="w-24" />
                    <span className="text-sm">-</span>
                    <Input type="number" defaultValue="90" className="w-24" />
                    <span className="text-sm">days</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg border-blue-200 bg-blue-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <Label className="text-blue-700">COLD Tier</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Files accessed between
                  </p>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="91" className="w-24" />
                    <span className="text-sm">-</span>
                    <Input type="number" defaultValue="365" className="w-24" />
                    <span className="text-sm">days</span>
                  </div>
                </div>
                <div className="p-4 border rounded-lg border-purple-200 bg-purple-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <Label className="text-purple-700">ARCHIVE Tier</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Files not accessed for more than
                  </p>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="365" className="w-24" />
                    <span className="text-sm">days</span>
                  </div>
                </div>
              </div>
              <Button className="mt-4">
                <Save className="h-4 w-4 mr-2" />
                Save Thresholds
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AWS Config */}
        <TabsContent value="aws">
          <Card>
            <CardHeader>
              <CardTitle>AWS Configuration</CardTitle>
              <CardDescription>View AWS connection settings (read-only)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Region</Label>
                  <Input value="us-east-1" disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-muted-foreground">S3 Bucket</Label>
                  <Input value="company-tiervault-archive" disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-muted-foreground">IAM Role</Label>
                  <Input value="arn:aws:iam::123456789:role/TierVaultRole" disabled className="mt-1" />
                </div>
                <div>
                  <Label className="text-muted-foreground">Connection Status</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                      Connected
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Contact your system administrator to modify AWS configuration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Job Completion Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Notify when scan, tiering, or restore jobs complete
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Error Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Immediate alerts for job failures and system errors
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Storage Threshold Warnings</p>
                  <p className="text-sm text-muted-foreground">
                    Alert when storage tiers exceed capacity thresholds
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Summary Email</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly digest of storage activity
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user access and roles</CardDescription>
              </div>
              <Button size="sm">Add User</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
