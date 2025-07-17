
"use client";

import * as React from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTimerState, saveTimerState, getWorkSessions, saveWorkSessions, mockEmployee } from "@/lib/mock-data";
import type { WorkSession } from "@/lib/types";
import { format } from 'date-fns';

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Work Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{elapsedTime}</div>
        <div className="mt-4 flex gap-2">
          {!timerState.running ? (
            <Button onClick={handleStartTimer} size="sm" className="gap-2">
              <Play className="h-4 w-4" /> Start Timer
            </Button>
          ) : (
            <Button onClick={handleStopTimer} variant="destructive" size="sm" className="gap-2">
              <Square className="h-4 w-4" /> Stop Timer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
