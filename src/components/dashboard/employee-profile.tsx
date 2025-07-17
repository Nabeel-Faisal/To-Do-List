"use client";

import type { Employee } from "@/lib/types";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";

type EmployeeProfileProps = {
  employee: Employee;
};

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 group-data-[collapsible=icon]:items-start group-data-[collapsible=icon]:p-2">
      <Avatar className="w-16 h-16 border-2 border-primary group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
        <AvatarImage asChild src={employee.photo}>
          <Image src={employee.photo} alt={employee.name} width={64} height={64} data-ai-hint="person avatar" />
        </AvatarImage>
        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-center group-data-[collapsible=icon]:hidden">
        <p className="font-semibold">{employee.name}</p>
        <p className="text-sm text-muted-foreground">{employee.role}</p>
        <p className="text-xs text-muted-foreground">{employee.department}</p>
      </div>
       <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-center group-data-[collapsible=icon]:justify-start group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-8"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
      </Button>
    </div>
  );
}
