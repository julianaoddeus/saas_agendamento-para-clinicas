"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "E-mail inválido" })
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .trim()
    .min(8, { message: "Senha deve conter pelo menos 8 caracteres" }),
});

const Login = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: (response) => {
            const session = response.data;
            // Se não tem clínica, redireciona para criar uma
            if (!session?.user?.clinic) {
              router.push("/clinic");
            } else {
              router.push("/dashboard");
            }
          },
          onError: (error) => {
            console.error("Erro no login:", error);
            toast.error("E-mail ou senha inválidos!");
          },
        },
      );
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Ocorreu um erro ao tentar fazer login. Tente novamente.");
    }
  };
  const handleOnLoginGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOnLogin)} className="space-y-4">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Faça login para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <Button className="w-full" type="submit">
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Entrar
              </Button>
              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={handleOnLoginGoogle}
              >
                <Image
                  src="/google.svg"
                  alt="Login com Google"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Entrar com Google
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default Login;
