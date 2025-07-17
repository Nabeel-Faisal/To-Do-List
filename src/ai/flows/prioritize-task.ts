'use server';

/**
 * @fileOverview An AI agent that suggests a priority (High/Medium/Low) for a new task based on its title and deadline.
 *
 * - prioritizeTask - A function that handles the task prioritization process.
 * - PrioritizeTaskInput - The input type for the prioritizeTask function.
 * - PrioritizeTaskOutput - The return type for the prioritizeTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeTaskInputSchema = z.object({
  title: z.string().describe('The title of the task.'),
  deadline: z.string().describe('The deadline of the task (e.g., YYYY-MM-DD).'),
});
export type PrioritizeTaskInput = z.infer<typeof PrioritizeTaskInputSchema>;

const PrioritizeTaskOutputSchema = z.object({
  priority: z
    .enum(['High', 'Medium', 'Low'])
    .describe('Suggested priority for the task.'),
});
export type PrioritizeTaskOutput = z.infer<typeof PrioritizeTaskOutputSchema>;

export async function prioritizeTask(input: PrioritizeTaskInput): Promise<PrioritizeTaskOutput> {
  return prioritizeTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTaskPrompt',
  input: {schema: PrioritizeTaskInputSchema},
  output: {schema: PrioritizeTaskOutputSchema},
  prompt: `You are a task prioritization expert. Given the task title and deadline, suggest a priority (High, Medium, or Low) for the task.

Task Title: {{{title}}}
Deadline: {{{deadline}}}

Consider these rules when suggesting the priority:
- If the deadline is very close (e.g., within 1-2 days), the priority should be High.
- If the deadline is within a week, the priority should be Medium.
- If the deadline is more than a week away, the priority should be Low.
- High priority tasks are urgent and critical.
- Medium priority tasks are important but not as urgent.
- Low priority tasks can be done later.

Return only the priority, nothing else.`,
});

const prioritizeTaskFlow = ai.defineFlow(
  {
    name: 'prioritizeTaskFlow',
    inputSchema: PrioritizeTaskInputSchema,
    outputSchema: PrioritizeTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
