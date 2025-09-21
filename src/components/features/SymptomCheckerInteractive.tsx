
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { symptomChecker, SymptomCheckerInput, SymptomCheckerOutput } from "@/ai/flows/symptom-checker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Stethoscope, AlertTriangle, ShieldCheck, MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SymptomCheckerSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters." }),
});

type SymptomCheckerFormValues = z.infer<typeof SymptomCheckerSchema>;

export default function SymptomCheckerInteractive() {
  const [result, setResult] = useState<SymptomCheckerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SymptomCheckerFormValues>({
    resolver: zodResolver(SymptomCheckerSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const onSubmit: SubmitHandler<SymptomCheckerFormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);

    try {
      const symptomsArray = data.symptoms.split(',').map(s => s.trim()).filter(s => s.length > 0);
      if (symptomsArray.length === 0) {
        toast({
            title: "Invalid Input",
            description: "Please list at least one symptom.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const input: SymptomCheckerInput = { symptoms: symptomsArray };
      const response = await symptomChecker(input);
      setResult(response);
    } catch (error) {
      console.error("Error calling symptomChecker flow:", error);
      toast({
        title: "Error",
        description: "Could not analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold font-headline">
          <Stethoscope className="mr-2 h-6 w-6 text-primary" />
          AI Symptom Checker
        </CardTitle>
        <CardDescription>Describe your symptoms to get an AI-powered assessment. This is not a medical diagnosis.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your symptoms (comma-separated):</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., fever, cough, headache"
                      {...field}
                      className="min-h-[100px] rounded-md"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full rounded-md">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze Symptoms"}
            </Button>
          </form>
        </Form>

        {result && (
          <Card className="mt-6 bg-muted/50 rounded-md border">
            <CardHeader>
              <CardTitle className="text-md font-semibold font-headline">Assessment Results:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong className="flex items-center"><AlertTriangle className="h-4 w-4 mr-1 text-destructive" /> Severity:</strong> 
                <p className="pl-5 text-foreground/90">{result.severity}</p>
              </div>
              <div>
                <strong className="flex items-center"><ShieldCheck className="h-4 w-4 mr-1 text-accent" /> Possible Treatment Options:</strong>
                <p className="pl-5 text-foreground/90">{result.treatmentOptions}</p>
              </div>
              <div>
                <strong className="flex items-center"><MessageCircle className="h-4 w-4 mr-1 text-primary" /> Further Guidance:</strong>
                <p className="pl-5 text-foreground/90">{result.chatbotRedirection}</p>
                <Button variant="link" className="p-0 h-auto text-primary mt-1 text-sm" onClick={() => alert("Redirecting to chatbot...")}>
                  Open AI Chatbot
                </Button>
              </div>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground">
              Disclaimer: This AI symptom checker is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health.
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
