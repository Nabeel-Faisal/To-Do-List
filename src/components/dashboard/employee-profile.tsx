
"use client";

import type { Employee } from "@/lib/types";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

type EmployeeProfileProps = {
  employee: Employee;
};

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:items-center">
      <Avatar className="w-20 h-20 border-2 border-primary group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10">
        <AvatarImage asChild src={employee.photo}>
          <Image src={employee.photo} alt={employee.name} width={80} height={80} data-ai-hint="person avatar" />
        </AvatarImage>
        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-center group-data-[collapsible=icon]:hidden">
        <p className="font-semibold">{employee.name}</p>
        <p className="text-sm text-muted-foreground">{employee.role}</p>
      </div>
    </div>
  );
}
