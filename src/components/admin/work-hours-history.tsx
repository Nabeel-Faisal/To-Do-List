
"use client";

import * as React from "react";
import { format, formatDistanceStrict } from 'date-fns';
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
import { getWorkSessions } from "@/lib/mock-data";

export function WorkHoursHistory() {
  const [sessions, setSessions] = React.useState<WorkSession[]>([]);

  React.useEffect(() => {
    // This now runs only on the client, preventing hydration errors
    setSessions(getWorkSessions().sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
  }, []);

  const calculateDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "In Progress";
    return formatDistanceStrict(new Date(startTime), new Date(endTime));
  };
  
  const formatTime = (dateString: string | null) => {
    if(!dateString) return '-';
    return format(new Date(dateString), 'hh:mm:ss a');
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
              <TableHead>Login Time</TableHead>
              <TableHead>Logout Time</TableHead>
              <TableHead>Total Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.employeeName}</TableCell>
                  <TableCell>{format(new Date(session.date), 'PPP')}</TableCell>
                  <TableCell>{formatTime(session.startTime)}</TableCell>
                  <TableCell>{formatTime(session.endTime)}</TableCell>
                  <TableCell>
                    {session.endTime ? (
                      calculateDuration(session.startTime, session.endTime)
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No work sessions recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
