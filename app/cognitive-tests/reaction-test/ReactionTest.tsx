"use client";

import { useState, useEffect, useRef } from "react";

enum TestPhase {
  INTRO = "intro",
  WAITING = "waiting",
  READY = "ready",
  RESULT = "result",
}

export default function ReactionTest() {
  const [phase, setPhase] = useState<TestPhase>(TestPhase.INTRO);
  const [message, setMessage] = useState("Press Start to begin the test.");
  const [bgColor, setBgColor] = useState("bg-[#f8f9fc]");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [mistake, setMistake] = useState(false);

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
      setReactionTime(time);
      setAttempts((prev) => [...prev, time]);
      setPhase(TestPhase.RESULT);
      setMessage(`Your reaction time: ${time} ms`);
      setBgColor("bg-[#f8f9fc]");
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
    setMessage("Press Start to begin the test.");
    setBgColor("bg-[#f8f9fc]");
    setReactionTime(null);
  };

  const average =
    attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : null;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${bgColor} transition-colors`}
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
            <button
              onClick={startTest}
              className="px-6 py-3 bg-[#135bec] hover:bg-[#0f47b6] text-white font-bold rounded-lg transition"
            >
              Start Test
            </button>
          )}

          {phase === TestPhase.RESULT && (
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-[#135bec] hover:bg-[#0f47b6] text-white font-bold rounded-lg transition"
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
