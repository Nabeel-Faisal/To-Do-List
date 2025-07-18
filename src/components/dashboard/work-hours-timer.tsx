
"use client";

import * as React from "react";
import { Play, Square, Pause, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTimerState, saveTimerState, getWorkSessions, saveWorkSessions, mockEmployee, type TimerState } from "@/lib/mock-data";
import type { WorkSession } from "@/lib/types";
import { format as formatDate } from 'date-fns';
import { cn } from "@/lib/utils";

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

export function WorkHoursTimer() {
  const [timerState, setTimerState] = React.useState<TimerState>(initialTimerState);
  const [elapsedTime, setElapsedTime] = React.useState(formatTime(0));
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Load state from localStorage only on the client
    const savedState = getTimerState();
    if (savedState) {
        setTimerState(savedState);
        let currentElapsedTime = savedState.accumulatedTime;
        if (savedState.status === 'running' && savedState.startTime) {
             const now = new Date().getTime();
             const startMs = new Date(savedState.startTime).getTime();
             if (!isNaN(startMs)) {
                currentElapsedTime += (now - startMs);
             }
        }
        setElapsedTime(formatTime(currentElapsedTime));
    }
  }, []);
  
  const updateDisplay = (accumulated: number, start: string | null, status: 'running' | 'paused' | 'stopped') => {
      let currentElapsedTime = accumulated;
      if (status === 'running' && start) {
          const now = new Date().getTime();
          const startMs = new Date(start).getTime();
          if (!isNaN(startMs)) {
            currentElapsedTime += (now - startMs);
          }
      }
      setElapsedTime(formatTime(currentElapsedTime));
  };

  React.useEffect(() => {
    saveTimerState(timerState);
    if (timerState.status === 'running') {
      intervalRef.current = setInterval(() => {
        updateDisplay(timerState.accumulatedTime, timerState.startTime, 'running');
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      updateDisplay(timerState.accumulatedTime, timerState.startTime, timerState.status);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  const updateSession = (updates: Partial<WorkSession>) => {
    if (!timerState.sessionId) return;
    const sessions = getWorkSessions();
    const updatedSessions = sessions.map(session =>
      session.id === timerState.sessionId ? { ...session, ...updates } : session
    );
    saveWorkSessions(updatedSessions);
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

    saveWorkSessions([...getWorkSessions(), newSession]);
    setTimerState({ status: 'running', startTime: now.toISOString(), accumulatedTime: 0, sessionId: newSessionId });
  };

  const handlePauseTimer = () => {
    if (timerState.status !== 'running' || !timerState.startTime) return;
    
    const now = new Date().getTime();
    const startMs = new Date(timerState.startTime).getTime();
    const newAccumulatedTime = timerState.accumulatedTime + (now - startMs);

    updateSession({ status: 'Paused', totalDuration: newAccumulatedTime });
    setTimerState(prev => ({ ...prev, status: 'paused', accumulatedTime: newAccumulatedTime, startTime: null }));
  };

  const handleResumeTimer = () => {
    if (timerState.status !== 'paused') return;

    const now = new Date().toISOString();
    updateSession({ status: 'Active' });
    setTimerState(prev => ({ ...prev, status: 'running', startTime: now }));
  };

  const handleStopTimer = () => {
    if (timerState.status === 'stopped' || !timerState.sessionId) return;
    
    const now = new Date();
    let finalAccumulatedTime = timerState.accumulatedTime;
    
    if (timerState.status === 'running' && timerState.startTime) {
      finalAccumulatedTime += (now.getTime() - new Date(timerState.startTime).getTime());
    }

    updateSession({ status: 'Completed', endTime: now.toISOString(), totalDuration: finalAccumulatedTime });
    setTimerState({ status: 'stopped', startTime: null, accumulatedTime: 0, sessionId: null });
    setElapsedTime(formatTime(0)); // Reset display
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
