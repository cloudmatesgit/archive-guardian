import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockJobs } from "@/data/mockData";
import { formatNumber, formatDateTime } from "@/lib/utils";
import {
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Search,
  Layers,
  Copy,
  Archive,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { Job } from "@/types";

const jobTypeIcons = {
  Scan: Search,
  Tiering: Layers,
  Deduplication: Copy,
  Restore: RotateCcw,
  Archive: Archive,
};

export default function JobsActivity() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const runningJobs = mockJobs.filter((j) => j.status === "Running");
  const completedJobs = mockJobs.filter((j) => j.status === "Completed");
  const failedJobs = mockJobs.filter((j) => j.status === "Failed");

  const getJobProgress = (job: Job) => {
    if (job.totalFiles === 0) return 0;
    return Math.round((job.filesProcessed / job.totalFiles) * 100);
  };

  const getJobDuration = (job: Job) => {
    if (!job.endTime) {
      const now = new Date();
      const diffMs = now.getTime() - job.startTime.getTime();
      const mins = Math.floor(diffMs / 60000);
      const hrs = Math.floor(mins / 60);
      if (hrs > 0) return `${hrs}h ${mins % 60}m`;
      return `${mins}m`;
    }
    const diffMs = job.endTime.getTime() - job.startTime.getTime();
    const mins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  return (
    <div>
      <PageHeader
        title="Jobs & Activity"
        description="Monitor and manage system jobs and background tasks (Preview Mode)"
        actions={
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            New Job
          </Button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{runningJobs.length}</p>
                <p className="text-sm text-muted-foreground">Running</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Search className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedJobs.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{failedJobs.length}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {mockJobs.map((job) => {
          const Icon = jobTypeIcons[job.type];
          const isExpanded = expandedJob === job.id;
          const progress = getJobProgress(job);

          return (
            <Card key={job.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        job.status === "Running"
                          ? "bg-blue-500/10"
                          : job.status === "Completed"
                          ? "bg-green-500/10"
                          : job.status === "Failed"
                          ? "bg-red-500/10"
                          : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          job.status === "Running"
                            ? "text-blue-600"
                            : job.status === "Completed"
                            ? "text-green-600"
                            : job.status === "Failed"
                            ? "text-red-600"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium">{job.type} Job</h3>
                        <StatusBadge status={job.status} />
                        <Badge variant="outline" className="font-mono text-xs">
                          #{job.id}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Started: {formatDateTime(job.startTime)}</span>
                        {job.endTime && (
                          <span>Ended: {formatDateTime(job.endTime)}</span>
                        )}
                        <span>Duration: {getJobDuration(job)}</span>
                      </div>

                      {/* Progress */}
                      {(job.status === "Running" ||
                        job.status === "Pending") && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              {formatNumber(job.filesProcessed)} /{" "}
                              {formatNumber(job.totalFiles)} files
                            </span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}

                      {job.status === "Completed" && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Processed {formatNumber(job.filesProcessed)} files
                        </p>
                      )}

                      {/* Errors */}
                      {job.errors.length > 0 && isExpanded && (
                        <div className="mt-3 p-3 bg-destructive/10 rounded-lg">
                          <p className="text-sm font-medium text-destructive mb-2">
                            Errors:
                          </p>
                          <ul className="text-sm text-destructive space-y-1">
                            {job.errors.map((error, i) => (
                              <li key={i}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {job.status === "Running" && (
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {job.status === "Failed" && (
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                    {job.errors.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          setExpandedJob(isExpanded ? null : job.id)
                        }
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
