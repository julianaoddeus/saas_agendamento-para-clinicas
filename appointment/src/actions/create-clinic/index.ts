"use server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (name: string) => {
  console.log(name)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado");
  }
  const existingClinic = await db
    .select()
    .from(clinicsTable)
    .where(eq(clinicsTable.id, session.user.id))
    .limit(1);

  console.log(existingClinic);
  if (existingClinic.length > 0) {
    await db
      .update(clinicsTable)
      .set({ name })
      .where(eq(clinicsTable.id, session.user.id));
    return;
  }

  const [clinic] = await db.insert(clinicsTable).values({ name }).returning();

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });

  redirect("/dashboard");
};
