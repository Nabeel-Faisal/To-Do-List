
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addEmployee, mockAdmin } from "@/lib/mock-data";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  department: z.string().min(2, "Department must be at least 2 characters."),
});

type NewEmployeeInfo = {
  name: string;
  username: string;
  password?: string;
};

export default function AddEmployeePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [newEmployeeInfo, setNewEmployeeInfo] = React.useState<NewEmployeeInfo | null>(null);
  const [copiedField, setCopiedField] = React.useState<"username" | "password" | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      department: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newEmployee = addEmployee(values);
    setNewEmployeeInfo({
      name: newEmployee.name,
      username: newEmployee.username!,
      password: newEmployee.password,
    });
    toast({
      title: "Employee Added",
      description: `${values.name} has been successfully registered.`,
    });
    form.reset();
  }
  
  const handleCopyToClipboard = (text: string, field: "username" | "password") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCloseDialog = () => {
    setNewEmployeeInfo(null);
    router.push("/admin?tab=Employees");
  }

  return (
    <AdminLayout activeTab="Add Employee">
      <Card>
        <CardHeader>
          <CardTitle>Add New Employee</CardTitle>
          <CardDescription>
            Fill out the form below to register a new employee. A username and
            password will be generated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role / Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Marketing Specialist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                <UserPlus className="mr-2 h-4 w-4" />
                Register Employee
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {newEmployeeInfo && (
        <AlertDialog open onOpenChange={handleCloseDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Employee Registered Successfully!</AlertDialogTitle>
              <AlertDialogDescription>
                Please share these credentials with {newEmployeeInfo.name}. They can use them to log in to their new portal.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 my-4">
               <div className="space-y-2">
                 <Label htmlFor="username">Username</Label>
                 <div className="flex items-center gap-2">
                    <Input id="username" value={newEmployeeInfo.username} readOnly />
                    <Button variant="outline" size="icon" onClick={() => handleCopyToClipboard(newEmployeeInfo.username, 'username')}>
                       {copiedField === 'username' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                 </div>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="password">Password</Label>
                  <div className="flex items-center gap-2">
                    <Input id="password" value={newEmployeeInfo.password} readOnly />
                     <Button variant="outline" size="icon" onClick={() => handleCopyToClipboard(newEmployeeInfo.password!, 'password')}>
                        {copiedField === 'password' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                 </div>
               </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleCloseDialog}>Got it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AdminLayout>
  );
}
