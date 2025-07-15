"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const uploadDoctorAvatar = async (
  doctorId: string,
  imagemUrl: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  await db
    .update(doctorsTable)
    .set({
      avatarImageUrl: imagemUrl || null,
    })
    .where(eq(doctorsTable.id, doctorId))
    .returning();

  revalidatePath("/doctors");
};
