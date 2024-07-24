"use client";

import { Input } from "./components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

function Login() {
  const FormSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.username.charAt(0) === "T") {
      toast({
        title: "Please wait a few minutes",
        description: "A game is already ocurring",
      });
    } else {
      toast({
        title: "You should be redirected to the Game Page",
        description: "🙃",
      });
    }
  }

  return (
    <>
      <div className="w-full fixed top-0 left-0 bg-space-cadet shadow-md shadow-slate-gray text-teal-500 p-4">
        <h1 className="text-xl font-bold text-white">Stock Market Simulator</h1>
      </div>

      <div className="flex items-center justify-center w-full h-full">
        <div className="w-full max-w-lg p-8 space-y-6 mt-20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel className="text-left">Username</FormLabel>
                    <div className="flex items-center space-x-4">
                      <FormControl className="flex-grow">
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <Button type="submit">Submit</Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default Login;
