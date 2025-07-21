/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Camera, Loader2, Trash2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  initialUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  fallbackText: string;
}

export default function AvatarUpload({
  initialUrl,
  onUploadSuccess,
  fallbackText,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatarUrl(initialUrl || null);
  }, [initialUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setSelectedFile(file);
        setAvatarUrl(URL.createObjectURL(file));
      } else {
        toast("Por favor, selecione um arquivo .jpg ou .png.");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const deleteHandleUpload = async () => {
    setUploading(false);
    setSelectedFile(null);
    setAvatarUrl(initialUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      toast("Por favor, selecione uma imagem para fazer o upload.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload-doctor", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Erro ao fazer upload.");
      }

      if (result?.publicUrl) {
        onUploadSuccess(result.publicUrl);
        toast("A imagem foi salva no storage.");
      }
    } catch (error: any) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast(`Falha ao fazer upload da imagem: ${error.message}`);
    } finally {
      setUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.png"
        className="hidden"
      />
      <Avatar
        className="h-20 w-20 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {avatarUrl ? (
          <AvatarImage
            src={avatarUrl || "/profile.png"}
            alt="Avatar do médico"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        ) : (
          <>
            {fallbackText != "" ? (
              <AvatarFallback>{fallbackText}</AvatarFallback>
            ) : (
              <AvatarImage src="/profile.png" />
            )}
          </>
        )}
      </Avatar>
      <div
        className="absolute bottom-0 left-11 z-10 rounded-full bg-white p-1 shadow-md"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Selecionar imagem"
      >
        <Camera className="h-4 w-4 text-gray-700" />
      </div>

      {selectedFile && !uploading && (
        <>
          <Button type="button" onClick={handleUpload} className="ml-2">
            Salvar Imagem
          </Button>
          <Trash2
            onClick={deleteHandleUpload}
            className="text-destructive h-4 w-4"
          />
        </>
      )}
      {uploading && (
        <Button type="button" disabled className="ml-2">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Carregando...
        </Button>
      )}
    </div>
  );
}
