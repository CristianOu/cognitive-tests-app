import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


interface RecentTest {
  id: string;
  dateTime: string;
  testType: string;
  resultValue: number;
  accuracy: number;
  status: "completed" | "failed";
}

interface RecentTestsProps {
  tests: RecentTest[];
}

export function RecentTests({ tests }: RecentTestsProps) {
  const displayTests = tests.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Tests</CardTitle>
          <CardDescription>Your latest test results</CardDescription>
        </div>
        {/* <Button variant="ghost" size="sm" className="text-primary">
          View All History
        </Button> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 pb-2 text-xs font-medium text-muted-foreground border-b">
            <div>DATE & TIME</div>
            <div>TEST TYPE</div>
            <div>RESULT</div>
            <div>ACCURACY</div>
            <div>STATUS</div>
          </div>

          {/* Table Rows */}
          {displayTests.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No tests completed yet. Start a test to see your results here.
            </div>
          )}
          {displayTests.map((test) => (
            <div
              key={test.id}
              className="grid grid-cols-5 gap-4 py-3 items-center text-sm border-b last:border-0"
            >
              <div className="text-muted-foreground">{test.dateTime}</div>
              <div className="font-medium">{test.testType}</div>
              <div className="font-mono">{test.resultValue}ms</div>
              <div className={`font-semibold ${
                test.accuracy === 100
                  ? "text-green-600"
                  : test.accuracy >= 90
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}