import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp, AlertCircle } from "lucide-react";

interface Insight {
  id: string;
  type: "peak" | "consistency" | "fatigue";
  title: string;
  description: string;
  icon: typeof Zap;
  color: string;
}

interface CognitiveInsightsProps {
  insights: Insight[];
}

export function CognitiveInsights({ insights }: CognitiveInsightsProps) {
  const defaultInsights: Insight[] = [
    {
      id: "1",
      type: "peak",
      title: "Peak Performance",
      description: "You are consistently fastest between 9:00 AM and 11:00 AM.",
      icon: Zap,
      color: "text-yellow-600",
    },
    {
      id: "2",
      type: "consistency",
      title: "Consistency Streak",
      description: "Your reaction time has improved by 15%, indicating consistent practice.",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      id: "3",
      type: "fatigue",
      title: "Fatigue Alert",
      description: "Reaction times tend to slow down after 4 consecutive tests.",
      icon: AlertCircle,
      color: "text-purple-600",
    },
  ];

  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Cognitive Insights</CardTitle>
        <CardDescription>Personalized performance analysis</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {displayInsights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div key={insight.id} className="flex items-start space-x-4 rounded-md border p-4">
              <div className={`mt-0.5 ${insight.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{insight.title}</p>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}