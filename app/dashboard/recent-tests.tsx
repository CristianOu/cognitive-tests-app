import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface RecentTest {
  id: string;
  dateTime: string;
  testType: string;
  reactionTime: number;
  accuracy: number;
  status: "completed" | "failed";
}

interface RecentTestsProps {
  tests: RecentTest[];
}

export function RecentTests({ tests }: RecentTestsProps) {
  const defaultTests: RecentTest[] = [
    {
      id: "1",
      dateTime: "Today, 10:32 AM",
      testType: "Visual Reflex",
      reactionTime: 238,
      accuracy: 100,
      status: "completed",
    },
    {
      id: "2",
      dateTime: "Yesterday, 4:15 PM",
      testType: "Choice Reaction",
      reactionTime: 256,
      accuracy: 95,
      status: "completed",
    },
    {
      id: "3",
      dateTime: "Jan 22, 09:00 AM",
      testType: "Visual Reflex",
      reactionTime: 245,
      accuracy: 92,
      status: "completed",
    },
  ];

  const displayTests = tests.length > 0 ? tests.slice(0, 5) : defaultTests;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Tests</CardTitle>
          <CardDescription>Your latest test results</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All History
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 pb-2 text-xs font-medium text-muted-foreground border-b">
            <div>DATE & TIME</div>
            <div>TEST TYPE</div>
            <div>REACTION TIME</div>
            <div>ACCURACY</div>
            <div>STATUS</div>
          </div>

          {/* Table Rows */}
          {displayTests.map((test) => (
            <div
              key={test.id}
              className="grid grid-cols-5 gap-4 py-3 items-center text-sm border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <div className="text-muted-foreground">{test.dateTime}</div>
              <div className="font-medium">{test.testType}</div>
              <div className="font-mono">{test.reactionTime}ms</div>
              <div className={`font-semibold ${
                test.accuracy === 100
                  ? "text-green-600"
                  : test.accuracy >= 95
                  ? "text-blue-600"
                  : "text-yellow-600"
              }`}>
                {test.accuracy}%
              </div>
              <div className="flex items-center justify-between">
                <Badge
                  variant={test.status === "completed" ? "default" : "destructive"}
                  className={test.status === "completed"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : ""
                  }
                >
                  {test.status === "completed" ? "Completed" : "Failed"}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}