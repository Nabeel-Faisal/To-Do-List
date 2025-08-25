
"use client";

import * as React from "react";
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { WorkSession } from "@/lib/types";

type WorkHoursHistoryProps = {
  sessions: WorkSession[];
};

export function WorkHoursHistory({ sessions }: WorkHoursHistoryProps) {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const sortedSessions = React.useMemo(() => {
    if (!isClient) return [];
    return [...sessions].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [sessions, isClient]);


 const calculateDuration = (durationMs: number) => {
    if (durationMs === 0) return "0s";
    const totalSeconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0 || result === '') result += `${seconds}s`;
    
    return result.trim();
  };
  
  const formatTime = (dateString: string | null) => {
    if(!dateString) return '-';
    return format(new Date(dateString), 'hh:mm:ss a');
  };
  
  const getStatusBadge = (status: 'Active' | 'Paused' | 'Completed') => {
    switch (status) {
      case 'Active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case 'Paused':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Paused</Badge>;
      case 'Completed':
         return <Badge variant="outline">Completed</Badge>;
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Hours History</CardTitle>
        <CardDescription>A log of all employee work sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Total Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isClient && sortedSessions.length > 0 ? (
              sortedSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.employeeName}</TableCell>
                  <TableCell>{format(new Date(session.date), 'PPP')}</TableCell>
                  <TableCell>{formatTime(session.startTime)}</TableCell>
                  <TableCell>{formatTime(session.endTime)}</TableCell>
                  <TableCell>{calculateDuration(session.totalDuration)}</TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {isClient ? "No work sessions recorded yet." : "Loading..."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
