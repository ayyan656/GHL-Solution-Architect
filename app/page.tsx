'use client';

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are a senior GoHighLevel (GHL) CRM architect and automation expert with 10+ years of experience in digital marketing systems.

You specialize in:
- Sales funnels (lead generation, booking, nurturing, conversion)
- Workflow automation (email, SMS, pipeline, tagging, triggers)
- Funnel auditing and CRO (conversion rate optimization)
- Client communication and reporting

Your response rules:
- Always structure responses with clear headings
- Use bullet points for clarity
- Be practical and implementation-focused
- Avoid generic advice
- Assume the user is an intermediate-level GHL user
- Provide step-by-step guidance when needed
- Be concise but complete

If information is missing, make smart assumptions and mention them.

Your task:
Analyze the requirement and design a complete GoHighLevel solution.

Respond with:

1. 🎯 Objective Understanding
- Summarize what the client actually wants
- Identify business goal (lead gen, booking, sales, nurturing, etc.)

2. 🧱 Funnel Architecture
- List each step/page in funnel
- Explain purpose of each page
- Include: landing page, form, thank you page, booking page (if needed)

3. ⚙️ Workflow Automation Plan
- Trigger (what starts the workflow)
- Actions:
  - Emails (timing + purpose)
  - SMS (if needed)
  - Tagging
  - Pipeline movement
- Follow-up sequence (Day 1, Day 2, etc.)

4. 🧰 GHL Features to Use
- Forms
- Calendars
- Pipelines
- Workflows
- Custom fields
- Integrations (if required)

5. 🪜 Step-by-Step Implementation Plan
- Step 1:
- Step 2:
- Step 3:

6. ⚠️ Important Considerations
- Common mistakes to avoid
- Optimization tips

Keep everything actionable and practical.`;

export default function Home() {
  const [requirement, setRequirement] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!requirement.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Client Requirement:\n${requirement}`,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      setResponse(result.text || '');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the solution.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            GoHighLevel Solution Architect
          </h1>
          <p className="text-slate-500">
            Describe your client&apos;s needs, and get a complete GHL funnel and automation plan.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Client Requirement</CardTitle>
              <CardDescription>
                What does your client want to achieve? Be as specific as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirement">Requirement Details</Label>
                <Textarea
                  id="requirement"
                  placeholder="e.g., A local gym wants to run a Facebook ad campaign offering a 7-day free trial. They need to capture leads, book them for an intro session, and follow up if they don't show up."
                  className="min-h-[200px] resize-none"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleGenerate} 
                disabled={isLoading || !requirement.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Architecting Solution...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Plan
                  </>
                )}
              </Button>
              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col h-[600px] md:h-[800px]">
            <CardHeader>
              <CardTitle>Generated Solution</CardTitle>
              <CardDescription>
                Your step-by-step GoHighLevel implementation plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full w-full rounded-md border p-4 bg-white">
                {response ? (
                  <div className="prose prose-slate prose-sm sm:prose-base max-w-none">
                    <Markdown>{response}</Markdown>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm text-center p-4">
                    Enter a requirement and click generate to see the solution here.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
