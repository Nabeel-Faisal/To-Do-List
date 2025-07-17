
"use client";

import type { Employee } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Image from "next/image";

type AdminProfileProps = {
  admin: Employee;
};

export function AdminProfile({ admin }: AdminProfileProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 group-data-[collapsible=icon]:items-start group-data-[collapsible=icon]:p-2">
      <Avatar className="w-16 h-16 border-2 border-primary group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8">
        <AvatarImage asChild src={admin.photo}>
           <Image src={admin.photo} alt={admin.name} width={64} height={64} data-ai-hint="person avatar" />
        </AvatarImage>
        <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-center group-data-[collapsible=icon]:hidden">
        <p className="font-semibold">{admin.name}</p>
        <p className="text-sm text-muted-foreground">{admin.role}</p>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 mt-2 group-data-[collapsible=icon]:hidden">
        <Settings className="h-4 w-4" />
        <span className="sr-only">Settings</span>
      </Button>
    </div>
  );
}
