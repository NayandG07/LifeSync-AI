
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { personalizedWaterIntake, PersonalizedWaterIntakeInput, PersonalizedWaterIntakeOutput } from "@/ai/flows/personalized-water-intake";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Droplets, TrendingUp, Activity, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WaterIntakeSchema = z.object({
  heightCm: z.coerce.number().positive({ message: "Height must be a positive number." }).min(50, "Height too short").max(300, "Height too tall"),
  weightKg: z.coerce.number().positive({ message: "Weight must be a positive number." }).min(10, "Weight too low").max(500, "Weight too high"),
  ageYears: z.coerce.number().int().positive({ message: "Age must be a positive integer." }).min(1, "Age too young").max(120, "Age too old"),
  activityLevel: z.enum(['sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'extraActive'], {
    required_error: "Activity level is required.",
  }),
});

type WaterIntakeFormValues = z.infer<typeof WaterIntakeSchema>;

const activityLevelOptions = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'lightlyActive', label: 'Lightly Active (light exercise/sports 1-3 days/week)' },
  { value: 'moderatelyActive', label: 'Moderately Active (moderate exercise/sports 3-5 days/week)' },
  { value: 'veryActive', label: 'Very Active (hard exercise/sports 6-7 days a week)' },
  { value: 'extraActive', label: 'Extra Active (very hard exercise/physical job & exercise 2x/day)' },
];

export default function WaterIntakeCalculator() {
  const [result, setResult] = useState<PersonalizedWaterIntakeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<WaterIntakeFormValues>({
    resolver: zodResolver(WaterIntakeSchema),
    defaultValues: {
      heightCm: undefined,
      weightKg: undefined,
      ageYears: undefined,
      activityLevel: undefined,
    },
  });

  const onSubmit: SubmitHandler<WaterIntakeFormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);

    try {
      const input: PersonalizedWaterIntakeInput = data;
      const response = await personalizedWaterIntake(input);
      setResult(response);
    } catch (error) {
      console.error("Error calling personalizedWaterIntake flow:", error);
      toast({
        title: "Error",
        description: "Could not calculate water intake. Please try again.",
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
          <Droplets className="mr-2 h-6 w-6 text-primary" />
          Personalized Water Intake Calculator
        </CardTitle>
        <CardDescription>Enter your details to get a personalized daily water intake suggestion.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heightCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 170" {...field} className="rounded-md" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 65" {...field} className="rounded-md" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ageYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 30" {...field} className="rounded-md" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="rounded-md">
                          <SelectValue placeholder="Select your activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activityLevelOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full rounded-md">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calculate Intake"}
            </Button>
          </form>
        </Form>

        {result && (
          <Card className="mt-6 bg-muted/50 rounded-md border">
            <CardHeader>
              <CardTitle className="text-md font-semibold font-headline">Your Personalized Recommendation:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong className="flex items-center"><Droplets className="h-4 w-4 mr-1 text-primary" /> Suggested Daily Intake:</strong>
                <p className="pl-5 text-xl font-bold text-primary">{result.suggestedIntakeMl} ml</p>
                <p className="pl-5 text-foreground/90">({(result.suggestedIntakeMl / 1000).toFixed(2)} liters or approx. {(result.suggestedIntakeMl / 250).toFixed(1)} glasses of 250ml)</p>
              </div>
              <div>
                <strong className="flex items-center"><TrendingUp className="h-4 w-4 mr-1 text-accent" /> Reasoning:</strong>
                <p className="pl-5 text-foreground/90">{result.reasoning}</p>
              </div>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground">
              Disclaimer: This is an AI-generated suggestion. Individual needs may vary. Consult a healthcare professional for personalized advice.
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
