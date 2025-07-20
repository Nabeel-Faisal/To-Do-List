
"use client";

import * as React from "react";
import { Play, Square, Pause, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WorkHoursTimerProps = {
  elapsedTime: string;
  status: 'stopped' | 'running' | 'paused';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function WorkHoursTimer({ elapsedTime, status, onStart, onPause, onResume, onStop }: WorkHoursTimerProps) {
  
  const statusText = {
      running: "Timer is active",
      paused: "Timer is paused",
      stopped: "Timer is stopped"
  }[status];
  
  const statusColor = {
      running: "bg-green-500 animate-pulse",
      paused: "bg-yellow-500",
      stopped: "bg-gray-400"
  }[status];

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
                {status === 'stopped' ? (
                     <Button onClick={onStart} size="lg" className="w-full gap-2 col-span-3">
                        <Play className="h-5 w-5" /> Start Timer
                    </Button>
                ) : (
                    <>
                     {status === 'running' ? (
                          <Button onClick={onPause} variant="outline" size="lg" className="w-full gap-2">
                            <Pause className="h-5 w-5" /> Pause
                          </Button>
                        ) : (
                          <Button onClick={onResume} variant="outline" size="lg" className="w-full gap-2">
                            <SkipForward className="h-5 w-5" /> Resume
                          </Button>
                        )}
                        <Button onClick={onStop} variant="destructive" size="lg" className="w-full gap-2 col-span-2">
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
