"use server";

import { prisma } from "@/lib/prismacl";
import { revalidatePath } from "next/cache";
import { User } from "@/generated/prisma";

// Get all users
export async function getUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users");
  }
}

// Get a single user by ID
export async function getUser(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user");
  }
}

// Update user email verification status
export async function updateUserVerification(id: string, verified: boolean) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    await prisma.user.update({
      where: { id },
      data: {
        emailVerified: verified,
      },
    });

    revalidatePath("/admin/users");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to update user:", error);
    throw new Error("Failed to update user");
  }
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error("Failed to delete user:", error);
    throw new Error("Failed to delete user");
  }
}
