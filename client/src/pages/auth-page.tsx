import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { type InsertUser } from "@shared/routes";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useUser } from "@/hooks/use-auth";

export default function AuthPage() {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="grid lg:grid-cols-2 gap-12 w-full max-w-5xl items-center">
        
        {/* Marketing Side */}
        <div className="hidden lg:flex flex-col gap-6 p-8">
          <h1 className="text-5xl font-display font-bold text-primary leading-tight">
            Structure your reasoning.
          </h1>
          <p className="text-lg text-muted-foreground">
            A professional platform for researchers, academics, and analysts to catalog, visualize, and analyze argumentative structures across multiple domains.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-border/50">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Visual Analytics</h3>
              <p className="text-sm text-muted-foreground">Track distribution of archetypes.</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-border/50">
              <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Catalog Arguments</h3>
              <p className="text-sm text-muted-foreground">Organized repository of logic.</p>
            </div>
          </div>
        </div>

        {/* Auth Form Side */}
        <div className="w-full max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <AuthForm mode="login" />
            </TabsContent>
            
            <TabsContent value="register">
              <AuthForm mode="register" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();
  
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: InsertUser) => {
    if (mode === "login") login(data);
    else register(data);
  };

  const isPending = isLoginPending || isRegisterPending;

  return (
    <Card className="border-border/50 shadow-xl shadow-black/5">
      <CardHeader>
        <CardTitle className="font-display text-2xl">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription>
          {mode === "login" 
            ? "Enter your credentials to access your dashboard." 
            : "Sign up to start cataloging your research."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="jdoe" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-11 mt-2 text-base font-medium transition-all"
              disabled={isPending}
            >
              {isPending ? "Processing..." : (mode === "login" ? "Sign In" : "Create Account")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
