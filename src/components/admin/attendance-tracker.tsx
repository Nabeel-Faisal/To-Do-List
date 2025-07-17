
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Employee } from "@/lib/types";
import Image from "next/image";

type AttendanceTrackerProps = {
  employees: Employee[];
}

export function AttendanceTracker({ employees }: AttendanceTrackerProps) {
  // Mocking leave requests for demo
  const leaveRequests = employees.slice(0, 2).map(e => ({...e, reason: "Vacation"}));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance & Leave</CardTitle>
        <CardDescription>Review leave requests and track attendance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Leave Requests</h4>
           {leaveRequests.length > 0 ? (
            <ul className="space-y-3">
              {leaveRequests.map(employee => (
                <li key={employee.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Avatar className="h-9 w-9">
                        <AvatarImage asChild src={employee.photo}>
                            <Image src={employee.photo} alt={employee.name} width={36} height={36} data-ai-hint="person avatar" />
                        </AvatarImage>
                        <AvatarFallback>{employee.name.slice(0,2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.reason}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7">Approve</Button>
                    <Button variant="ghost" size="sm" className="h-7">Decline</Button>
                  </div>
                </li>
              ))}
            </ul>
           ) : (
             <p className="text-sm text-muted-foreground text-center py-4">No pending leave requests.</p>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
