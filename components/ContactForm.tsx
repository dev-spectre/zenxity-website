import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast"; // assuming useToast is available or I can import it from components/ui/use-toast

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  contactNumber: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid contact number format.")
    .min(10, "Contact number must be at least 10 characters long."),
  city: z.string().min(2, "City must be at least 2 characters."),
  landSize: z.coerce
    .number({
      required_error: "Land size is required.",
      invalid_type_error: "Land size must be a number.",
    })
    .positive("Land size must be a positive number."),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactNumber: "",
      city: "",
      landSize: undefined as unknown as number,
      additionalNotes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("entry.2005620554", data.name);
      formData.append("entry.1166974658", data.contactNumber);
      formData.append("entry.1065046570", data.city);
      formData.append("entry.29411773", String(data.landSize));
      if (data.additionalNotes) {
        formData.append("entry.839337160", data.additionalNotes);
      }

      await fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSc3UtTYwZYYOIZTdYA1f2DRBXj8kGRNWnLOGvk83X5FyVlarw/formResponse",
        {
          method: "POST",
          body: formData,
          mode: "no-cors",
        }
      );

      setIsSuccess(true);
      form.reset();
      
      // hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      alert("There was an error submitting your request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 border-l-4 border-green-500 rounded-md flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Thank you! Your details have been submitted successfully. We will get in touch with you soon.</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City / Location of Land<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Coimbatore" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="landSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Land Size (in acres)<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 50" 
                    {...field} 
                    onChange={e => field.onChange(e.target.value === "" ? "" : e.target.value)}
                    value={field.value === undefined ? "" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any specific requirements, current crops, or questions..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20 transition-colors rounded-xl py-6 text-base font-semibold" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
