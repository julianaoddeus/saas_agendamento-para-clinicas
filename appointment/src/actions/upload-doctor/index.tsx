"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadDoctorAvatar = async (formData: FormData) => {
  const file = formData.get("file") as File | null;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      data: null,
      error:
        "Supabase credentials ausentes. Defina SUPABASE_URL e SUPABASE_ANON_KEY (ou suas versões NEXT_PUBLIC_) em Environment Variables.",
    };
  }

  if (!file) {
    return { data: null, error: "Nenhum arquivo fornecido." };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `imagens-doctors/${fileName}`;

  try {
    const { error } = await supabase.storage
      .from("doctors-diary01")
      .upload(filePath, file, {
        cacheControl: "3000",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return { data: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("doctors-diary01")
      .getPublicUrl(filePath);

    return { data: { publicUrl: publicUrlData.publicUrl }, error: null };
  } catch (error) {
    console.error("Unexpected error during upload:", error);
  }
};
