"use client";

import { Camera, Trash2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  initialUrl?: string | null;
  onFileSelect: (file: File | null) => void;
  fallbackText: string;
}

export default function UploadImageDoctorForm({
  initialUrl,
  onFileSelect,
  fallbackText,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatarUrl(initialUrl || null);
  }, [initialUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        onFileSelect(file);
        setAvatarUrl(URL.createObjectURL(file));
      } else {
        toast("Por favor, selecione um arquivo .jpg ou .png.");
        onFileSelect(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const deleteHandleUpload = () => {
    onFileSelect(null);
    setAvatarUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

      <Avatar className="h-20 w-20">
        {avatarUrl ? (
          <AvatarImage
            src={avatarUrl || "/placeholder.svg"}
            alt="Avatar do médico"
            className="rounded-full object-cover"
          />
        ) : (
          <AvatarFallback>{fallbackText || "N/A"}</AvatarFallback>
        )}
      </Avatar>

      <div
        className="absolute bottom-0 left-11 z-10 rounded-full bg-white p-1 shadow-md"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Selecionar imagem"
      >
        <Camera className="h-4 w-4 cursor-pointer text-gray-700" />
      </div>
      <div className="absolute bottom-0 left-18 z-10 rounded-full bg-white p-1 shadow-md">
        {avatarUrl && (
          <Trash2
            className="h-4 w-4 cursor-pointer text-red-500"
            onClick={deleteHandleUpload}
            aria-label="Remover imagem"
          />
        )}
      </div>
    </div>
  );
}
