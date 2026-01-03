import {
  Bell,
  CircleCheck,
  CircleAlert,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "@/data/mockData";
import { getRelativeTime } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { fetchDashboardTrends } from "@/api/dashboard";
import { useState } from "react";
import { useEffect } from "react";

export function TopHeader() {
  const navigate = useNavigate();
  const unreadCount = mockNotifications.filter((n) => !n.read).length;
  const systemStatus = "healthy"; // Could be: healthy, warning, error
  const [metrics, setMetrics] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigate("/");
  };

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

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* System Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {systemStatus === "healthy" ? (
            <CircleCheck className="h-5 w-5 text-success" />
          ) : (
            <CircleAlert className="h-5 w-5 text-warning" />
          )}
          <span className="text-sm font-medium">
            System Status:{" "}
            <span
              className={
                systemStatus === "healthy" ? "status-healthy" : "status-pending"
              }
            >
              {systemStatus === "healthy" ? "Healthy" : "Warning"}
            </span>
          </span>
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          {metrics?.total_storage_tb || 0.74} TB Used
        </Badge>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start py-3"
              >
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      notification.type === "error"
                        ? "bg-destructive"
                        : notification.type === "warning"
                        ? "bg-warning"
                        : notification.type === "success"
                        ? "bg-success"
                        : "bg-info"
                    }`}
                  />
                  <span className="font-medium text-sm flex-1">
                    {notification.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(notification.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-4">
                  {notification.message}
                </p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger disabled>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium">Guest User</p>
                {/* <p className="text-xs text-muted-foreground">
                  admin@company.com
                </p> */}
              </div>
              {/* <ChevronDown className="h-4 w-4 text-muted-foreground" /> */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mhandleLogoutr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
