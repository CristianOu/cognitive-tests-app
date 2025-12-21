"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "react-toastify";

enum TestPhase {
  INTRO = "intro",
  WAITING = "waiting",
  READY = "ready",
  RESULT = "result",
}

export default function ReactionTest() {
  const { isAuthenticated } = useAuth();
  const [phase, setPhase] = useState<TestPhase>(TestPhase.INTRO);
  const [message, setMessage] = useState("Press Start to begin the test.\nLeft click or press Space when it turns green.");
  const [bgColor, setBgColor] = useState("bg-[#f8f9fc]");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [mistake, setMistake] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  // Prevent scrolling when pressing Space
  useEffect(() => {
    const preventScroll = (e: KeyboardEvent) => {
      if (e.code === "Space") e.preventDefault();
    };
    window.addEventListener("keydown", preventScroll);
    return () => window.removeEventListener("keydown", preventScroll);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [phase]);

  const saveResultToDatabase = async (reactionTime: number) => {
    try {
      const response = await fetch("/api/cognitive-tests/reaction-test/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reactionTime }),
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Result saved to your analytics!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save result");
      }
    } catch (error) {
      console.error("Error saving result:", error);
      toast.error("Failed to save result");
    }
  };

  const handleAction = (event?: React.MouseEvent | React.KeyboardEvent) => {
    if (event && "code" in event && event.code !== "Space") return; // only trigger on space
    if (phase === TestPhase.WAITING) {
      // Pressed too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase(TestPhase.RESULT);
      setMessage("Too early! You pressed before it turned green.");
      setBgColor("bg-red-300");
    } else if (phase === TestPhase.READY && startTime) {
      const time = Date.now() - startTime;
      setAttempts((prev) => [...prev, time]);
      setPhase(TestPhase.RESULT);
      setMessage(`Your reaction time: ${time} ms`);
      setBgColor("bg-[#f8f9fc]");

      // Save to database if analytics is enabled and user is authenticated
      if (analyticsEnabled && isAuthenticated) {
        saveResultToDatabase(time);
      }
    }
  };

  // Starts the waiting phase (warm red)
  const startTest = () => {
    setPhase(TestPhase.WAITING);
    setMessage("Wait for the screen to turn green...");
    setBgColor("bg-red-400");
    const delay = Math.random() * 3000 + 2000;

    timeoutRef.current = setTimeout(() => {
      setPhase(TestPhase.READY);
      setBgColor("bg-green-500");
      setMessage("Press now!");
      setStartTime(Date.now());
    }, delay);
  };

  // Reset to intro
  const resetTest = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase(TestPhase.INTRO);
    setMessage("Press Start to begin the test.\nClick or press Space when it turns green.");
    setBgColor("bg-[#f8f9fc]");
  };

  const average =
    attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : null;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center min-h-[50vh] ${bgColor} transition-colors ${phase === TestPhase.WAITING ? "cursor-pointer" : ""}`}
      style={{ fontFamily: "Inter, 'Noto Sans', sans-serif" }}
      tabIndex={0} // allows capturing keyboard events
      onKeyDown={(e) => {
        if (e.code === "Space") handleAction(e);
      }}
      onClick={() => handleAction()}
    >
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-[#e7ebf3]">
          <h1 className="text-2xl font-bold text-[#0d121b] mb-4">Visual Reaction Time Test</h1>
          <p className="text-[#4c669a] mb-6">{message}</p>

          {phase === TestPhase.INTRO && (
            <div className="space-y-4">
              <button
                onClick={startTest}
                className="px-6 py-3 bg-[#135bec] hover:bg-[#0f47b6] text-white font-bold rounded-lg transition cursor-pointer"
              >
                Start Test
              </button>

              {isAuthenticated && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <label htmlFor="analytics-toggle" className="flex items-center gap-2 cursor-pointer text-[#4c669a]">
                    <input
                      type="checkbox"
                      id="analytics-toggle"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                      className="w-4 h-4 accent-[#135bec] cursor-pointer"
                    />
                    <span>Save results to analytics</span>
                  </label>
                </div>
              )}
              { !isAuthenticated && (
                <div className="text-sm text-[#4c669a]">
                  <em>Log in to save your results to analytics.</em>
                </div>
              )}
            </div>
          )}

          {phase === TestPhase.RESULT && (
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-[#135bec] hover:bg-[#0f47b6] text-white font-bold rounded-lg transition cursor-pointer"
            >
              Try Again
            </button>
          )}

          {attempts.length > 0 && (
            <div className="mt-6 text-sm text-[#4c669a]">
              Attempts:{" "}
              <span className="font-semibold text-[#0d121b]">{attempts.length}</span> · Average:{" "}
              <span className="font-semibold text-[#0d121b]">{average} ms</span>
            </div>
          )}
        </div>
    </div>
  );
}
