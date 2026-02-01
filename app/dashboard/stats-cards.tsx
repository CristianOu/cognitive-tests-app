import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp, Target, Trophy, Activity, Info } from "lucide-react";

interface StatsCardsProps {
  avgReactionTime: number | null;
  accuracyRate: number | null;
  percentileRank: number | null;
  totalTests: number | null;
  testsThisWeek: number | null;
}

export function StatsCards({
  avgReactionTime,
  accuracyRate,
  percentileRank,
  totalTests,
  testsThisWeek,
}: StatsCardsProps) {
  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Avg Reaction Time */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-default">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Reaction Time
                  <Info className="inline ml-1 h-3 w-3 text-muted-foreground" />
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              {avgReactionTime && (
                <CardContent>
                  <div className="text-2xl font-bold">{avgReactionTime}ms</div>
                </CardContent>
              )}
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Based on data from the last 30 days</p>
          </TooltipContent>
        </Tooltip>

        {/* Accuracy Rate */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-default">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Accuracy Rate
                  <Info className="inline ml-1 h-3 w-3 text-muted-foreground" />
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accuracyRate}%</div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Calculated across all tries</p>
          </TooltipContent>
        </Tooltip>

        {/* Percentile Rank */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-default">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Percentile Rank
                  <Info className="inline ml-1 h-3 w-3 text-muted-foreground" />
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              {percentileRank !== null && percentileRank > 0 ? (
                <CardContent>
                  <div className="text-2xl font-bold">Top {percentileRank}%</div>
                </CardContent>
              ) : null}
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Based on active users in the last 30 days</p>
          </TooltipContent>
        </Tooltip>

        {/* Total Tests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">
              {testsThisWeek} this week
            </p>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}