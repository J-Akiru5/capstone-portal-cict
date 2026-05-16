"use server"

import { prisma, UserRole } from "@capstone/database"

type CreateUserProfileInput = {
  id: string
  email: string
  role: string
  firstName: string
  lastName: string
}

const allowedRoles = new Set(Object.values(UserRole))

export async function createUserProfile({
  id,
  email,
  role,
  firstName,
  lastName,
}: CreateUserProfileInput) {
  const trimmedFirstName = firstName.trim()
  const trimmedLastName = lastName.trim()

  if (!id || !email || !trimmedFirstName || !trimmedLastName) {
    throw new Error("Missing required user profile fields")
  }

  if (!allowedRoles.has(role as UserRole)) {
    throw new Error("Invalid role selection")
  }

  await prisma.user.upsert({
    where: { id },
    update: {
      email,
      role: role as UserRole,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
    },
    create: {
      id,
      email,
      role: role as UserRole,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
    },
  })
}
