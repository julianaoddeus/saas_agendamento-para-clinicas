/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase-client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 },
      );
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Apenas arquivos de imagem são permitidos" },
        { status: 400 },
      );
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "O arquivo deve ter no máximo 5MB" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();

    // Gerar nome único para o arquivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload para o Supabase Storage
    const { data, error } = await supabase.storage
      .from("doctors-diary01")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Erro no upload do Supabase:", error);
      return NextResponse.json(
        { error: `Erro no upload: ${error.message}` },
        { status: 500 },
      );
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from("doctors-diary01")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json(
        { error: "Erro ao obter URL pública" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Upload realizado com sucesso",
      publicUrl: publicUrlData.publicUrl,
      path: filePath,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
