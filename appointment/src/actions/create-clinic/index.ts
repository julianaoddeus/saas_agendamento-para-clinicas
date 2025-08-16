"use server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (name: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  const userClinic = await db
    .select({
      clinicId: usersToClinicsTable.clinicId,
    })
    .from(usersToClinicsTable)
    .where(eq(usersToClinicsTable.userId, session.user.id))
    .limit(1);

  if (userClinic.length > 0) {
    await db
      .update(clinicsTable)
      .set({ name })
      .where(eq(clinicsTable.id, userClinic[0].clinicId));
    return;
  }

  const [clinic] = await db.insert(clinicsTable).values({ name }).returning();

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });

  redirect("/dashboard");
};
