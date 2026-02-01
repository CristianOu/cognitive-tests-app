"use client";
import { StatsCards } from "./stats-cards";
import { PerformanceChart } from "./performance-chart";
import { CognitiveInsights } from "./cognitive-insights";
import { RecentTests } from "./recent-tests";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DashboardStats {
  avgReactionTime: number | null;
  accuracyRate: number;
  percentileRank: number;
  totalTests: number;
  testsThisWeek: number;
  improvement: number | null;
  testsLast30Days: number;
}

interface PerformanceDataPoint {
  date: string;
  reactionTime: number;
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceDataPoint[]>([]);

  // Fetch dashboard stats and performance data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setStatsLoading(true);
        const [statsResponse, perfResponse] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/performance"),
        ]);

        if (!statsResponse.ok) {
          throw new Error("Failed to fetch stats");
        }

        const stats = await statsResponse.json();
        setStatsData(stats);

        if (perfResponse.ok) {
          const perfData = await perfResponse.json();
          setPerformanceData(perfData);
        }

        setStatsError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStatsError("Failed to load stats");
      } finally {
        setStatsLoading(false);
      }
    }

    if (user && !isLoading) {
      fetchDashboardData();
    }
  }, [user, isLoading]);

  // Show loading state
  if (isLoading || statsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  
  // Show error state
  if (statsError || !statsData) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || "Guest"}
            </h2>
            <p className="text-red-600">
              {statsError || "Unable to load stats. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || "Guest"}
          </h2>
          <p className="text-muted-foreground">
            {statsData.improvement !== null ? (
              statsData.improvement > 0 ? (
                <>
                  Your reaction time has improved by{" "}
                  <span className="font-semibold text-green-600">
                    {statsData.improvement}ms
                  </span>{" "}
                  this week. Keep up the momentum!
                </>
              ) : statsData.improvement < 0 ? (
                <>
                  Your reaction time is{" "}
                  <span className="font-semibold text-orange-600">
                    {Math.abs(statsData.improvement)}ms slower
                  </span>{" "}
                  this week. Keep practicing!
                </>
              ) : (
                "Your reaction time is consistent this week."
              )
            ) : (
              "Complete more tests to track your progress."
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* # creates a single, properly-functioning element. */}
          <Button asChild>
            <Link href="/cognitive-tests/reaction-test">
              Start New Test
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards
        avgReactionTime={statsData.avgReactionTime}
        accuracyRate={statsData.accuracyRate}
        percentileRank={statsData.percentileRank}
        totalTests={statsData.totalTests}
        testsThisWeek={statsData.testsThisWeek}
      />

      {/* Chart and Insights Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <PerformanceChart data={performanceData} />
        <CognitiveInsights insights={[]} />
      </div>

      {/* Recent Tests Table */}
      <RecentTests tests={[]} />
    </div>
  );
}
