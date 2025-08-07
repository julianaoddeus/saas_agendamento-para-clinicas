import { zodResolver } from "@hookform/resolvers/zod";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { capitalize } from "@/_helpers/capitalize";
import UploadImageForm from "@/app/(protected)/_components/upload-image-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "use pelo menos 3 caracteres" })
    .transform(capitalize),
  email: z.string().trim().email({ message: "Insira um e-mail válido" }),
  image: z.string().optional(),
});

export default function AccountForm() {
  const [open, setOpen] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
    },
    shouldUnregister: true,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let avatarUrl = values.image ?? "";

    if (selectedAvatarFile) {
      const formData = new FormData();
      formData.append("file", selectedAvatarFile);

      const response = await fetch("/api/upload-doctor", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("Erro ao fazer upload da imagem.");
        return;
      }

      avatarUrl = result?.publicUrl;
      toast.success("Imagem enviada com sucesso.");

      // Atualiza o valor do campo "image" no formulário
      form.setValue("image", avatarUrl);
    }

    // Envie os dados do formulário (incluindo image)
    const updatedValues = {
      ...values,
      image: avatarUrl,
    };

    console.log("Dados para envio:", updatedValues);
    toast.success("Dados atualizados com sucesso.");
    setOpen(false);
  };

  const handleAvatarFileSelect = (file: File | null) => {
    setSelectedAvatarFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2"
          onSelect={(e) => e.preventDefault()}
        >
          <Settings className="h-4 w-4" />
          Conta
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="flex flex-row items-start gap-4 pb-4">
              <div className="flex-shrink-0">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <UploadImageForm
                          initialUrl={field.value}
                          onFileSelect={handleAvatarFileSelect}
                          fallbackText="N/A"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1 pt-6">
                <DialogTitle>Atualizar dados da conta</DialogTitle>
                <DialogDescription>
                  Atualize seu email, nome da clínica ou foto de perfil.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Nome da clínica" />
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
                    <FormControl>
                      <Input {...field} placeholder="Novo e-mail" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
