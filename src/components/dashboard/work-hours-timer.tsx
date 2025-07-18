
"use client";

import * as React from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTimerState, saveTimerState, getWorkSessions, saveWorkSessions, mockEmployee } from "@/lib/mock-data";
import type { WorkSession } from "@/lib/types";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

export function WorkHoursTimer() {
  const [timerState, setTimerState] = React.useState({ running: false, startTime: null as string | null, sessionId: null as string | null });
  const [elapsedTime, setElapsedTime] = React.useState("00:00:00");
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const savedState = getTimerState();
    if (savedState.running && savedState.startTime) {
      setTimerState(savedState);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (timerState.running && timerState.startTime) {
      intervalRef.current = setInterval(() => {
        const start = new Date(timerState.startTime!).getTime();
        const now = new Date().getTime();
        const difference = now - start;
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setElapsedTime(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setElapsedTime("00:00:00");
    }

    saveTimerState(timerState);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState]);

  const handleStartTimer = () => {
    const now = new Date();
    const newSessionId = `session-${now.getTime()}`;
    const newSession: WorkSession = {
      id: newSessionId,
      employeeId: mockEmployee.id,
      employeeName: mockEmployee.name,
      startTime: now.toISOString(),
      endTime: null,
      date: format(now, 'yyyy-MM-dd'),
    };

    const sessions = getWorkSessions();
    saveWorkSessions([...sessions, newSession]);
    setTimerState({ running: true, startTime: now.toISOString(), sessionId: newSessionId });
  };

  const handleStopTimer = () => {
    if (!timerState.sessionId) return;
    
    const sessions = getWorkSessions();
    const updatedSessions = sessions.map(session =>
      session.id === timerState.sessionId
        ? { ...session, endTime: new Date().toISOString() }
        : session
    );
    saveWorkSessions(updatedSessions);
    setTimerState({ running: false, startTime: null, sessionId: null });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Work Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-4xl font-bold tracking-tighter tabular-nums text-center p-4 rounded-lg bg-muted w-full">
                {elapsedTime}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
                <span className={cn(
                    "h-2 w-2 rounded-full mr-2",
                    timerState.running ? "bg-green-500 animate-pulse" : "bg-gray-400"
                )}></span>
                <span>{timerState.running ? "Timer is active" : "Timer is stopped"}</span>
            </div>
            <div className="w-full">
                {!timerState.running ? (
                    <Button onClick={handleStartTimer} size="lg" className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                        <Play className="h-5 w-5" /> Start Timer
                    </Button>
                ) : (
                    <Button onClick={handleStopTimer} variant="destructive" size="lg" className="w-full gap-2">
                        <Square className="h-5 w-5" /> Stop Timer
                    </Button>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
