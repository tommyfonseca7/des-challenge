"use client";

import React from "react";
import { Input } from "./components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

function Login() {
  const navigate = useNavigate();

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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch(
        "http://summercamp24.ddns.net:4000/game/register-player",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: data.username }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      navigate("/game", { state: { userData: responseData } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register player",
      });
      console.error("Failed to register player:", error);
    }
  }

  return (
    <>
      <div className="flex w-full h-screen">
        {/* Left half of the screen */}
        <div className="w-1/2 bg-space-cadet flex items-center justify-center">
          <img
            src=".\src\assets\logo-dark-bg.png"
            alt="Logo"
            className="w-1/2 h-auto"
          />
        </div>

        {/* Right half of the screen */}
        <div className="w-1/2 flex items-center justify-center shadow-lg shadow-slate-gray">
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
                      <FormLabel className="text-left my-2 text-xl font-bold">
                        Enter your name
                      </FormLabel>
                      <div className="flex items-center space-x-4">
                        <FormControl className="flex-grow">
                          <Input placeholder="Name" {...field} />
                        </FormControl>
                        <Button type="submit">Join!</Button>
                      </div>
                      <FormMessage />
                      <FormDescription>
                        Stock Master is a stock simulator based game where users
                        get to experience the ups and downs of the stock market.
                        Enter your name and join!
                      </FormDescription>
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
