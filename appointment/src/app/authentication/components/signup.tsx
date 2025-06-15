"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { capitalize } from "@/helpers/capitalize";
import { authClient } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Nome deve conter pelo menos 3 caracteres" })
    .max(150, { message: "Nome deve conter no máximo 150 caracteres" })
    .transform((val) => capitalize(val)),
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

const Signup = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = async (values: z.infer<typeof registerSchema>) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        // Implementar a verificação de e-mail callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          if (ctx.error.code === "USER_ALREADY_EXISTS") {
            toast.error("E-mail já cadastrado!");
          } else {
            toast.error("Erro ao criar conta!");
          }
        },
      },
    );
  };

  return (
    <Card>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleOnSubmit)}
          className="space-y-8"
        >
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Crie uma conta para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button className="w-full" type="submit">
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Criar conta"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default Signup;
