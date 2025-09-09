'use server';
/**
 * @fileOverview An assignment verification AI agent.
 *
 * - verifyAssignment - A function that handles the assignment verification process.
 * - VerifyAssignmentInput - The input type for the verifyAssignment function.
 * - VerifyAssignmentOutput - The return type for the verifyAssignment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VerifyAssignmentInputSchema = z.object({
  taskTitle: z.string().describe('The official title of the task.'),
  images: z
    .array(
      z.string().describe(
        "A photo of a handwritten assignment, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      )
    )
    .min(1, 'At least one image is required.'),
});
export type VerifyAssignmentInput = z.infer<typeof VerifyAssignmentInputSchema>;

const VerifyAssignmentOutputSchema = z.object({
  isApproved: z
    .boolean()
    .describe('Whether the assignment is approved or not.'),
  reason: z
    .string()
    .describe(
      'A brief reason for the decision. e.g., "Approved", "Title mismatch", "Not handwritten", "No content found".'
    ),
});
export type VerifyAssignmentOutput = z.infer<typeof VerifyAssignmentOutputSchema>;

export async function verifyAssignment(
  input: VerifyAssignmentInput
): Promise<VerifyAssignmentOutput> {
  return verifyAssignmentFlow(input);
}

const verificationPrompt = ai.definePrompt({
  name: 'verifyAssignmentPrompt',
  input: { schema: VerifyAssignmentInputSchema },
  output: { schema: VerifyAssignmentOutputSchema },
  prompt: `You are an automated assignment verification system. Your task is to analyze the provided image(s) of an assignment based on two strict criteria.

  Official Task Title: "{{taskTitle}}"
  
  Assignment Images:
  {{#each images}}
  {{media url=this}}
  {{/each}}
  
  Verification Rules:
  1.  **Title Match:** The handwritten title must be clearly visible on at least ONE of the pages in the provided image(s). This title must exactly match the "Official Task Title" provided above.
  2.  **Handwriting Check:** The content of the assignment must be handwritten. Reject any computer-typed or printed text.
  
  Your Decision Process:
  - If both rules are met (handwritten content and a matching title on at least one page), set isApproved to true and the reason to "Approved".
  - If the handwritten title does not match the official title on any page, set isApproved to false and the reason to "Title mismatch".
  - If the assignment is not handwritten, set isApproved to false and the reason to "Not handwritten".
  - If the images are unclear, blank, or do not contain a recognizable assignment, set isApproved to false and the reason to "Invalid content".
  
  Provide your final decision in the specified JSON format.`,
});

const verifyAssignmentFlow = ai.defineFlow(
  {
    name: 'verifyAssignmentFlow',
    inputSchema: VerifyAssignmentInputSchema,
    outputSchema: VerifyAssignmentOutputSchema,
  },
  async (input) => {
    try {
        const { output } = await verificationPrompt(input);
        if (!output) {
            throw new Error("The AI model did not return a valid response.");
        }
        return output;
    } catch (error) {
        console.error("Error in AI verification flow:", error);
        // Return a structured error response
        return {
            isApproved: false,
            reason: "AI verification failed. Please try again."
        };
    }
  }
);
