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
        description: "A game is already occurring",
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
      <div className="flex w-full h-screen">
        {/* Left half of the screen */}
        <div className="w-1/2 bg-space-cadet flex items-center justify-center">
          <img
            src=".\src\assets\image.png"
            alt="Logo"
            className="w-1/2 h-auto"
          />
        </div>

        {/* Right half of the screen */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-full max-w-lg p-8 space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                      <FormLabel className="text-left my-2 text-xl font-bold">Insert your name</FormLabel>
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
      </div>
      <Toaster />
    </>
  );
}

export default Login;
