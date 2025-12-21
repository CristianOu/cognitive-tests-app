import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Trophy, Activity } from "lucide-react";

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Avg Reaction Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Reaction Time</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        { avgReactionTime && (
          <CardContent>
            <div className="text-2xl font-bold">{avgReactionTime}ms</div>
            {/* <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                -10ms
              </Badge>
            </p> */}
          </CardContent>
        )}
        
      </Card>

      {/* Accuracy Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{accuracyRate}%</div>
          {/* <p className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
              +0.3%
            </Badge>
          </p> */}
        </CardContent>
      </Card>

      {/* Percentile Rank */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Percentile Rank</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        {
          percentileRank !== null && percentileRank > 0 ? (
            <CardContent>
              <div className="text-2xl font-bold">Top {percentileRank}%</div>
              {/* <p className="text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
                  +5%
                </Badge>
              </p> */}
            </CardContent>
          ) : null
        }
      </Card>

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
  );
}