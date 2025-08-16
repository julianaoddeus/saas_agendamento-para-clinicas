"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const updateImageProfile = async (image: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  if (image) {
    await db
      .update(usersTable)
      .set({ image })
      .where(eq(usersTable.id, session.user.id));
  }

  redirect("/dashboard");
};
