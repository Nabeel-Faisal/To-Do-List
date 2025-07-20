
"use client";

import * as React from "react";
import { Play, Square, Pause, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEmployee } from "@/lib/mock-data";
import type { WorkSession } from "@/lib/types";
import { format as formatDate } from 'date-fns';
import { cn } from "@/lib/utils";

type TimerState = {
    status: 'stopped' | 'running' | 'paused';
    startTime: number | null; // The time the current interval started (as timestamp)
    accumulatedTime: number; // Time in ms accumulated before the current interval
    sessionId: string | null;
}

const formatTime = (ms: number) => {
    if (isNaN(ms) || ms < 0) {
        return "00:00:00";
    }
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const initialTimerState: TimerState = { status: 'stopped', startTime: null, accumulatedTime: 0, sessionId: null };

type WorkHoursTimerProps = {
  onSessionChange: React.Dispatch<React.SetStateAction<WorkSession[]>>;
};

export function WorkHoursTimer({ onSessionChange }: WorkHoursTimerProps) {
  const [timerState, setTimerState] = React.useState<TimerState>(initialTimerState);
  const [elapsedTime, setElapsedTime] = React.useState(formatTime(0));
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const updateDisplay = React.useCallback(() => {
      let currentElapsedTime = timerState.accumulatedTime;
      if (timerState.status === 'running' && timerState.startTime) {
          currentElapsedTime += (new Date().getTime() - timerState.startTime);
      }
      setElapsedTime(formatTime(currentElapsedTime));
  }, [timerState.accumulatedTime, timerState.startTime, timerState.status]);

  React.useEffect(() => {
    if (timerState.status === 'running') {
      intervalRef.current = setInterval(updateDisplay, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      updateDisplay(); // one final update
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState.status, updateDisplay]);

  const updateSession = (updates: Partial<WorkSession>) => {
    if (!timerState.sessionId) return;
    onSessionChange(prev => 
      prev.map(session =>
        session.id === timerState.sessionId ? { ...session, ...updates } : session
      )
    );
  };

  const handleStartTimer = () => {
    const now = new Date();
    const newSessionId = `session-${now.getTime()}`;
    const newSession: WorkSession = {
      id: newSessionId,
      employeeId: mockEmployee.id,
      employeeName: mockEmployee.name,
      startTime: now.toISOString(),
      endTime: null,
      date: formatDate(now, 'yyyy-MM-dd'),
      totalDuration: 0,
      status: 'Active',
    };

    onSessionChange(prev => [...prev, newSession]);
    setTimerState({ status: 'running', startTime: now.getTime(), accumulatedTime: 0, sessionId: newSessionId });
  };

  const handlePauseTimer = () => {
    if (timerState.status !== 'running' || !timerState.startTime) return;
    
    const now = new Date().getTime();
    const newAccumulatedTime = timerState.accumulatedTime + (now - timerState.startTime);

    updateSession({ status: 'Paused', totalDuration: newAccumulatedTime });
    setTimerState(prev => ({ ...prev, status: 'paused', accumulatedTime: newAccumulatedTime, startTime: null }));
  };

  const handleResumeTimer = () => {
    if (timerState.status !== 'paused') return;

    updateSession({ status: 'Active' });
    setTimerState(prev => ({ ...prev, status: 'running', startTime: new Date().getTime() }));
  };

  const handleStopTimer = () => {
    if (timerState.status === 'stopped' || !timerState.sessionId) return;
    
    const now = new Date();
    let finalAccumulatedTime = timerState.accumulatedTime;
    
    if (timerState.status === 'running' && timerState.startTime) {
      finalAccumulatedTime += (now.getTime() - timerState.startTime);
    }

    updateSession({ status: 'Completed', endTime: now.toISOString(), totalDuration: finalAccumulatedTime });
    setTimerState({ status: 'stopped', startTime: null, accumulatedTime: 0, sessionId: null });
  };
  
  const statusText = {
      running: "Timer is active",
      paused: "Timer is paused",
      stopped: "Timer is stopped"
  }[timerState.status];
  
  const statusColor = {
      running: "bg-green-500 animate-pulse",
      paused: "bg-yellow-500",
      stopped: "bg-gray-400"
  }[timerState.status];

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
                <span className={cn("h-2 w-2 rounded-full mr-2", statusColor)}></span>
                <span>{statusText}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
                {timerState.status === 'stopped' ? (
                     <Button onClick={handleStartTimer} size="lg" className="w-full gap-2 col-span-3">
                        <Play className="h-5 w-5" /> Start Timer
                    </Button>
                ) : (
                    <>
                     {timerState.status === 'running' ? (
                          <Button onClick={handlePauseTimer} variant="outline" size="lg" className="w-full gap-2">
                            <Pause className="h-5 w-5" /> Pause
                          </Button>
                        ) : (
                          <Button onClick={handleResumeTimer} variant="outline" size="lg" className="w-full gap-2">
                            <SkipForward className="h-5 w-5" /> Resume
                          </Button>
                        )}
                        <Button onClick={handleStopTimer} variant="destructive" size="lg" className="w-full gap-2 col-span-2">
                            <Square className="h-5 w-5" /> Stop Timer
                        </Button>
                    </>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
