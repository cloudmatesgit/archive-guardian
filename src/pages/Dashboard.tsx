import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatCurrency } from "@/lib/utils";
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
} from "lucide-react";
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
} from "recharts";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { fetchDashboardData, fetchDashboardTrends } from "@/api/dashboard";

const tierColors = {
  hot: "#ef4444",
  warm: "#f97316",
  cold: "#3b82f6",
  archive: "#a855f7",
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardTrends()
      .then((trends) => {
        const latest = trends[0]; // API returns latest first

        // ---------- CARDS ----------
        const mappedMetrics = {
          total_storage_tb: Number((latest.totalSizeBytes / 1e12).toFixed(2)),
          files_scanned: latest.totalFiles,
          estimated_savings: Math.round(latest.duplicateFiles * 0.05),
          pending_archival: latest.duplicateFiles,
          restores_in_progress: 0,

          by_tier: {
            hot: latest.hotFiles,
            warm: latest.warmFiles,
            cold: latest.coldFiles,
            archive: 0,
          },

          aging: {
            "0-30": Math.round(latest.hotFiles * 0.6),
            "30-90": Math.round(latest.hotFiles * 0.4),
            "90-180": Math.round(latest.coldFiles * 0.6),
            "180+": Math.round(latest.coldFiles * 0.4),
          },
        };

        setMetrics(mappedMetrics);

        // ---------- TREND CHART ----------
        const chartData = [...trends]
          .reverse() // oldest → latest
          .map((day) => ({
            date: day.date,
            hot: day.hotFiles,
            warm: day.warmFiles,
            cold: day.coldFiles,
            total: day.totalFiles,
            duplicates: day.duplicateFiles,
          }));

        setTrendData(chartData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const storageByTier = metrics.by_tier;

  const pieData = [
    { name: "HOT", value: storageByTier.hot, color: tierColors.hot },
    { name: "WARM", value: storageByTier.warm, color: tierColors.warm },
    { name: "COLD", value: storageByTier.cold, color: tierColors.cold },
    {
      name: "ARCHIVE",
      value: storageByTier.archive,
      color: tierColors.archive,
    },
  ];

  const fileAgingData = [
    {
      period: "0–30 days",
      hot: metrics.aging["0-30"],
      warm: 0,
      cold: 0,
      archive: 0,
    },
    {
      period: "30–90 days",
      hot: 0,
      warm: metrics.aging["30-90"],
      cold: 0,
      archive: 0,
    },
    {
      period: "90–180 days",
      hot: 0,
      warm: 0,
      cold: metrics.aging["90-180"],
      archive: 0,
    },
    {
      period: "180+ days",
      hot: 0,
      warm: 0,
      cold: 0,
      archive: metrics.aging["180+"],
    },
  ];

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Storage Used"
          value={`${metrics.total_storage_tb} TB`}
          subtitle="of 100 TB capacity"
          icon={HardDrive}
        />
        <StatCard
          title="Files Scanned"
          value={formatNumber(metrics.files_scanned)}
          subtitle="Last scan: today"
          icon={FileSearch}
        />
        <StatCard
          title="Est. Cost Savings"
          value={"-"}
          subtitle="per month"
          icon={DollarSign}
        />
        <StatCard
          title="Pending Archival"
          value={"-"}
          subtitle={`${metrics.restores_in_progress} restores in progress`}
          icon={Clock}
        />
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">
                HOT
              </span>
            </div>
            <p className="text-xl font-bold mt-1">{storageByTier.hot} File</p>
            <span className="text-xs text-muted-foreground">
              Accessed in last 30 days
            </span>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">
                WARM
              </span>
            </div>
            <p className="text-xl font-bold mt-1">{storageByTier.warm} File</p>
            <span className="text-xs text-muted-foreground">
              Accessed 30–90 days ago
            </span>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Snowflake className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">
                COLD
              </span>
            </div>
            <p className="text-xl font-bold mt-1">{storageByTier.cold} File</p>
            <span className="text-xs text-muted-foreground">
              Not accessed in 90+ days
            </span>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-muted-foreground">
                ARCHIVE
              </span>
            </div>
            <p className="text-xl font-bold mt-1">
              {storageByTier.archive} File
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">File Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hot" fill={tierColors.hot} />
                <Bar dataKey="warm" fill={tierColors.warm} />
                <Bar dataKey="cold" fill={tierColors.cold} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Storage by Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
