
"use client";

import * as React from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
};

export function TaskList({ tasks, onToggleTask }: TaskListProps) {
  const { toast } = useToast();

  const handleActionClick = (action: string, taskTitle: string) => {
    toast({
      title: `${action} Clicked`,
      description: `You clicked "${action}" for task: ${taskTitle}.`,
    });
  };

  const getPriorityBadgeVariant = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      case "Low":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>To-Do List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TableRow key={task.id} className="transition-colors duration-300 data-[state=checked]:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={task.status === "Completed"}
                      onCheckedChange={() => onToggleTask(task.id)}
                      aria-label="Mark task as complete"
                    />
                  </TableCell>
                  <TableCell className={`font-medium ${task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={task.status === "Completed" ? "text-muted-foreground" : ""}
                  >
                    {format(task.deadline, "PPP")}
                  </TableCell>
                   <TableCell
                    className={task.status === "Completed" ? "text-muted-foreground" : ""}
                  >
                    {task.assignedBy}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleActionClick('Edit', task.title)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionClick('Delete', task.title)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
