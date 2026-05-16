import { PrismaClient, UserRole, FacultyPosition, GroupStatus, ProjectStatus, DefenseStage } from "@prisma/client"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import { existsSync } from "fs"
import { resolve } from "path"

const prisma = new PrismaClient()

const envPaths = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "../../.env"),
  resolve(process.cwd(), "../../apps/web/.env"),
  resolve(process.cwd(), "../../apps/web/.env.local"),
]

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath })
    break
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const seedPassword = process.env.SEED_PASSWORD || "Capstone@123"
const resetDatabase = process.env.SEED_RESET === "true"

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

type SeedUser = {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  facultyPosition?: FacultyPosition
  studentNumber?: string
}

const baseUsers: SeedUser[] = [
  {
    email: "admin@isufst.edu.ph",
    firstName: "System",
    lastName: "Admin",
    role: UserRole.ADMIN,
  },
  {
    email: "dean@isufst.edu.ph",
    firstName: "Jose",
    lastName: "Rizal",
    role: UserRole.FACULTY,
    facultyPosition: FacultyPosition.DEAN,
  },
  {
    email: "chair@isufst.edu.ph",
    firstName: "Andres",
    lastName: "Bonifacio",
    role: UserRole.FACULTY,
    facultyPosition: FacultyPosition.PROGRAM_CHAIR,
  },
  {
    email: "instr1@isufst.edu.ph",
    firstName: "Melchora",
    lastName: "Aquino",
    role: UserRole.FACULTY,
    facultyPosition: FacultyPosition.INSTRUCTOR,
  },
]

const studentUsers: SeedUser[] = Array.from({ length: 5 }, (_, index) => {
  const studentNumber = index + 1
  return {
    email: `student${studentNumber}@isufst.edu.ph`,
    firstName: "Student",
    lastName: `${studentNumber}`,
    role: UserRole.STUDENT,
    studentNumber: `2024-000${studentNumber}`,
  }
})

const seedUsers: SeedUser[] = [...baseUsers, ...studentUsers]

async function resetDatabaseIfNeeded() {
  if (!resetDatabase) return

  console.log("🧹 SEED_RESET enabled. Clearing existing data...")

  await prisma.evaluationScore.deleteMany()
  await prisma.evaluation.deleteMany()
  await prisma.documentAnnotation.deleteMany()
  await prisma.documentVersion.deleteMany()
  await prisma.panelAssignment.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.defenseSchedule.deleteMany()
  await prisma.rubricCriterion.deleteMany()
  await prisma.evaluationRubric.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.historicalTitle.deleteMany()
  await prisma.capstoneProject.deleteMany()
  await prisma.groupMember.deleteMany()
  await prisma.capstoneGroup.deleteMany()
  await prisma.user.deleteMany()
}

async function ensureAuthUser(user: SeedUser) {
  if (!supabaseAdmin) return null

  const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (listError) {
    throw new Error(`Supabase lookup failed for ${user.email}: ${listError.message}`)
  }

  const existing = listData.users.find((candidate) => candidate.email === user.email)
  if (existing) return existing

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: user.email,
    password: seedPassword,
    email_confirm: true,
    user_metadata: {
      role: user.role,
      first_name: user.firstName,
      last_name: user.lastName,
    },
  })

  if (error || !data.user) {
    throw new Error(`Supabase create failed for ${user.email}: ${error?.message || "Unknown error"}`)
  }

  return data.user
}

async function ensurePrismaUser(user: SeedUser, authId?: string) {
  const prismaUser = await prisma.user.upsert({
    where: { email: user.email },
    update: {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      facultyPosition: user.facultyPosition,
      studentNumber: user.studentNumber,
      department: "CICT",
    },
    create: {
      id: authId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      facultyPosition: user.facultyPosition,
      studentNumber: user.studentNumber,
      department: "CICT",
    },
  })

  if (authId && prismaUser.id !== authId) {
    console.warn(`⚠️ Prisma user ID mismatch for ${user.email}. Consider SEED_RESET=true to realign.`)
  }

  return prismaUser
}

async function main() {
  console.log("🌱 Starting seeding...")

  if (!supabaseAdmin) {
    console.warn("⚠️ Supabase service role key missing. Auth users will not be created.")
  }

  await resetDatabaseIfNeeded()

  const createdUsers = new Map<string, string>()
  for (const user of seedUsers) {
    const authUser = await ensureAuthUser(user)
    const prismaUser = await ensurePrismaUser(user, authUser?.id)
    createdUsers.set(user.email, prismaUser.id)
  }

  console.log("✅ Users created.")

  const instructorId = createdUsers.get("instr1@isufst.edu.ph")
  const groupExists = await prisma.capstoneGroup.findFirst({ where: { name: "Team Aquaculture AI" } })

  let group1 = groupExists
  if (!group1 && instructorId) {
    group1 = await prisma.capstoneGroup.create({
      data: {
        name: "Team Aquaculture AI",
        status: GroupStatus.ACTIVE,
        adviserId: instructorId,
        members: {
          create: [
            { userId: createdUsers.get("student1@isufst.edu.ph")!, isLeader: true },
            { userId: createdUsers.get("student2@isufst.edu.ph")! },
            { userId: createdUsers.get("student3@isufst.edu.ph")! },
            { userId: createdUsers.get("student4@isufst.edu.ph")! },
          ],
        },
      },
    })
  }

  console.log("✅ Students and Groups created.")

  if (group1) {
    const existingProject = await prisma.capstoneProject.findUnique({
      where: { groupId: group1.id },
    })

    if (!existingProject) {
      await prisma.capstoneProject.create({
        data: {
          groupId: group1.id,
          title: "Smart Water Quality Monitoring for Local Fish Ponds using IoT",
          abstract: "This study aims to automate water quality monitoring in Dingle fish ponds...",
          techStack: ["Next.js", "Supabase", "Arduino", "ESP32"],
          domain: "Aquaculture",
          status: ProjectStatus.IN_PROGRESS,
        },
      })
    }
  }

  console.log("✅ Sample Project created.")

  const historicalTitles = [
    { title: "Automated Feeding System for Tilapia", year: 2022 },
    { title: "Water Quality Sensor Network for Freshwater Fish", year: 2023 },
    { title: "IoT Based Monitoring for Agricultural Soil", year: 2021 },
    { title: "Smart Irrigation System using Soil Moisture Sensors", year: 2023 },
    { title: "CICT Student Attendance System using RFID", year: 2022 },
    { title: "Mobile Application for Local Fishery Market", year: 2024 },
  ]

  for (const title of historicalTitles) {
    const exists = await prisma.historicalTitle.findFirst({
      where: { title: title.title, year: title.year },
    })
    if (!exists) {
      await prisma.historicalTitle.create({ data: title })
    }
  }

  console.log("✅ Historical Titles seeded.")

  for (const stage of Object.values(DefenseStage)) {
    const existingRubric = await prisma.evaluationRubric.findFirst({
      where: { defenseStage: stage },
    })
    if (!existingRubric) {
      await prisma.evaluationRubric.create({
        data: {
          defenseStage: stage,
          criteria: {
            create: [
              { name: "Content", description: "Clarity and depth of content", weight: 0.4 },
              { name: "Technical Merit", description: "Complexity and execution", weight: 0.4 },
              { name: "Presentation", description: "Delivery and Q&A", weight: 0.2 },
            ],
          },
        },
      })
    }
  }

  console.log("✅ Default Rubrics created.")
  console.log("🏁 Seeding completed successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
