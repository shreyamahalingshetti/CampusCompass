"use server";

import { prisma } from "@/lib/prisma";

export async function loginOrRegisterUser(email: string, name: string) {
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        email,
        name,
      },
    });
    return { success: true, user };
  } catch (error: any) {
    console.error("Error in loginOrRegisterUser Server Action:", error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}
