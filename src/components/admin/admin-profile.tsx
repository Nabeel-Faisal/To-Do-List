
"use client";

import type { Employee } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Image from "next/image";
import { Separator } from "../ui/separator";

type AdminProfileProps = {
  admin: Employee;
};

export function AdminProfile({ admin }: AdminProfileProps) {
  return (
    <>
    <Separator className="my-4 bg-border/50 group-data-[collapsible=icon]:hidden" />
    <div className="flex flex-row items-center gap-3 p-4 pt-0 rounded-lg group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
      <Avatar className="w-10 h-10 border">
        <AvatarImage asChild src={admin.photo}>
           <Image src={admin.photo} alt={admin.name} width={40} height={40} data-ai-hint="person avatar" />
        </AvatarImage>
        <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-left group-data-[collapsible=icon]:hidden grow">
        <p className="font-semibold text-sm">{admin.name}</p>
        <p className="text-xs text-muted-foreground">{admin.role}</p>
      </div>
       <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 group-data-[collapsible=icon]:hidden">
        <Settings className="h-4 w-4" />
        <span className="sr-only">Settings</span>
      </Button>
    </div>
    </>
  );
}
