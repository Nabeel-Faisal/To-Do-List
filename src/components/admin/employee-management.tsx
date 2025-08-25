
"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Employee } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

type EmployeeManagementProps = {
  employees: Employee[];
};

export function EmployeeManagement({ employees }: EmployeeManagementProps) {
  const { toast } = useToast();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleActionClick = (action: string, employeeName: string) => {
    toast({
      title: `${action} Clicked`,
      description: `You clicked "${action}" for ${employeeName}.`,
    });
  };

  const getStatusBadge = (status: 'Active' | 'On Leave' | 'Inactive') => {
    switch (status) {
      case 'Active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case 'On Leave':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">On Leave</Badge>;
      case 'Inactive':
        return <Badge variant="destructive">Inactive</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Management</CardTitle>
        <CardDescription>Monitor and manage all employees.</CardDescription>
        <div className="pt-2">
           <Input placeholder="Search employees..." />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isClient ? employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                     <AvatarImage asChild src={employee.photo}>
                        <Image src={employee.photo} alt={employee.name} width={32} height={32} data-ai-hint="person avatar"/>
                     </AvatarImage>
                    <AvatarFallback>{employee.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{employee.name}</div>
                    <div className="text-xs text-muted-foreground">{employee.role}</div>
                  </div>
                </TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{getStatusBadge(employee.status as any)}</TableCell>
                <TableCell>
                  {employee.lastLogin ? format(new Date(employee.lastLogin), 'P') : 'N/A'}
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
                      <DropdownMenuItem onClick={() => handleActionClick('View Profile', employee.name)}>View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionClick('Edit', employee.name)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleActionClick('Deactivate', employee.name)}>Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading employees...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
