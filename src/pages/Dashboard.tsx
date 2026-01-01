import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStorageMetrics, mockTopDirectories, mockFileAgingData, mockJobs } from '@/data/mockData';
import { formatNumber, formatCurrency } from '@/lib/utils';
import {
  HardDrive,
  Flame,
  Sun,
  Snowflake,
  Archive,
  FileSearch,
  DollarSign,
  Clock,
  RefreshCw,
  Play,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDateTime } from '@/lib/utils';

const tierColors = {
  hot: '#ef4444',
  warm: '#f97316',
  cold: '#3b82f6',
  archive: '#a855f7',
};

const pieData = [
  { name: 'HOT', value: mockStorageMetrics.byTier.hot, color: tierColors.hot },
  { name: 'WARM', value: mockStorageMetrics.byTier.warm, color: tierColors.warm },
  { name: 'COLD', value: mockStorageMetrics.byTier.cold, color: tierColors.cold },
  { name: 'ARCHIVE', value: mockStorageMetrics.byTier.archive, color: tierColors.archive },
];

export default function Dashboard() {
  const recentJobs = mockJobs.slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your storage infrastructure and tiering status"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Run Scan
            </Button>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Storage Used"
          value={`${mockStorageMetrics.totalUsed} TB`}
          subtitle="of 100 TB capacity"
          icon={HardDrive}
          iconColor="text-primary"
        />
        <StatCard
          title="Files Scanned"
          value={formatNumber(mockStorageMetrics.filesScanned)}
          subtitle="Last scan: 2 hours ago"
          icon={FileSearch}
          iconColor="text-info"
        />
        <StatCard
          title="Est. Cost Savings"
          value={formatCurrency(mockStorageMetrics.estimatedSavings)}
          subtitle="per month"
          icon={DollarSign}
          iconColor="text-success"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Pending Archival"
          value={formatNumber(mockStorageMetrics.pendingArchival)}
          subtitle={`${mockStorageMetrics.restoresInProgress} restores in progress`}
          icon={Clock}
          iconColor="text-warning"
        />
      </div>

      {/* Tier Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">HOT</span>
            </div>
            <p className="text-xl font-bold mt-1">{mockStorageMetrics.byTier.hot} TB</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">WARM</span>
            </div>
            <p className="text-xl font-bold mt-1">{mockStorageMetrics.byTier.warm} TB</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Snowflake className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">COLD</span>
            </div>
            <p className="text-xl font-bold mt-1">{mockStorageMetrics.byTier.cold} TB</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">ARCHIVE</span>
            </div>
            <p className="text-xl font-bold mt-1">{mockStorageMetrics.byTier.archive} TB</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Storage by Tier Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Storage by Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value} TB`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} TB`, 'Storage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* File Aging Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">File Aging Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockFileAgingData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit=" TB" />
                <Tooltip formatter={(value) => [`${value} TB`]} />
                <Legend />
                <Bar dataKey="hot" name="HOT" fill={tierColors.hot} stackId="a" />
                <Bar dataKey="warm" name="WARM" fill={tierColors.warm} stackId="a" />
                <Bar dataKey="cold" name="COLD" fill={tierColors.cold} stackId="a" />
                <Bar dataKey="archive" name="ARCHIVE" fill={tierColors.archive} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Directories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 10 Largest Directories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTopDirectories.map((dir, index) => (
                <div key={dir.name} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-4">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono truncate">{dir.name}</p>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${(dir.size / mockTopDirectories[0].size) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium">{dir.size} TB</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Jobs</CardTitle>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{job.type} Job</p>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateTime(job.startTime)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">
                      {formatNumber(job.filesProcessed)} / {formatNumber(job.totalFiles)}
                    </p>
                    <p className="text-xs text-muted-foreground">files processed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
