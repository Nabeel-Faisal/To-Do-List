
"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { prioritizeTask } from "@/ai/flows/prioritize-task";
import type { Task, TaskPriority, Employee } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(100),
  deadline: z.date({
    required_error: "A deadline is required.",
  }),
  priority: z.enum(["High", "Medium", "Low"]),
  assignedBy: z.string({ required_error: "Please select an employee." }),
});

type AssignTaskDialogProps = {
  onAssignTask: (task: Omit<Task, 'id' | 'status'>) => void;
  employees: Employee[];
};

export function AssignTaskDialog({ onAssignTask, employees }: AssignTaskDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      priority: "Medium",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onAssignTask(values);
    toast({
      title: "Task Assigned",
      description: `"${values.title}" has been assigned.`,
    });
    form.reset();
    setOpen(false);
  };
  
  const handleSuggestPriority = async () => {
    const title = form.getValues("title");
    const deadline = form.getValues("deadline");

    if (!title || !deadline) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a title and deadline to suggest a priority.",
      });
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await prioritizeTask({
        title,
        deadline: format(deadline, "yyyy-MM-dd"),
      });
      form.setValue("priority", result.priority as TaskPriority, { shouldValidate: true });
      toast({
        title: "AI Suggestion",
        description: `Priority set to "${result.priority}" based on task details.`,
      });
    } catch (error) {
      console.error("AI prioritization failed:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not suggest a priority at this time.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Assign Task
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to assign a new task.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Finalize project report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="assignedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map(emp => (
                           <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                   <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={handleSuggestPriority} disabled={isSuggesting}>
                        <Sparkles className={cn("h-4 w-4", isSuggesting && "animate-spin")} />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Assign Task</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
