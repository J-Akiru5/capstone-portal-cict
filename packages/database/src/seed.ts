import { PrismaClient, UserRole, FacultyPosition, GroupStatus, ProjectStatus, DefenseStage, MilestoneStatus, DocType } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seeding...")

  // 1. Create Faculty
  const dean = await prisma.user.upsert({
    where: { email: "dean@isufst.edu.ph" },
    update: {},
    create: {
      email: "dean@isufst.edu.ph",
      firstName: "Jose",
      lastName: "Rizal",
      role: UserRole.FACULTY,
      facultyPosition: FacultyPosition.DEAN,
      department: "CICT",
    },
  })

  const chair = await prisma.user.upsert({
    where: { email: "chair@isufst.edu.ph" },
    update: {},
    create: {
      email: "chair@isufst.edu.ph",
      firstName: "Andres",
      lastName: "Bonifacio",
      role: UserRole.FACULTY,
      facultyPosition: FacultyPosition.PROGRAM_CHAIR,
      department: "CICT",
    },
  })

  const instructor1 = await prisma.user.upsert({
    where: { email: "instr1@isufst.edu.ph" },
    update: {},
    create: {
      email: "instr1@isufst.edu.ph",
      firstName: "Melchora",
      lastName: "Aquino",
      role: UserRole.FACULTY,
      facultyPosition: FacultyPosition.INSTRUCTOR,
      department: "CICT",
    },
  })

  console.log("✅ Faculty created.")

  // 2. Create Students & Groups
  const students = []
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.upsert({
      where: { email: `student${i}@isufst.edu.ph` },
      update: {},
      create: {
        email: `student${i}@isufst.edu.ph`,
        firstName: `Student`,
        lastName: `${i}`,
        role: UserRole.STUDENT,
        studentNumber: `2024-000${i}`,
      },
    })
    students.push(student)
  }

  const group1 = await prisma.capstoneGroup.create({
    data: {
      name: "Team Aquaculture AI",
      status: GroupStatus.ACTIVE,
      adviserId: instructor1.id,
      members: {
        create: [
          { userId: students[0].id, isLeader: true },
          { userId: students[1].id },
          { userId: students[2].id },
          { userId: students[3].id },
        ],
      },
    },
  })

  console.log("✅ Students and Groups created.")

  // 3. Create Project
  const project1 = await prisma.capstoneProject.create({
    data: {
      groupId: group1.id,
      title: "Smart Water Quality Monitoring for Local Fish Ponds using IoT",
      abstract: "This study aims to automate water quality monitoring in Dingle fish ponds...",
      techStack: ["Next.js", "Supabase", "Arduino", "ESP32"],
      domain: "Aquaculture",
      status: ProjectStatus.IN_PROGRESS,
    },
  })

  console.log("✅ Sample Project created.")

  // 4. Create Historical Titles for pg_trgm testing
  const historicalTitles = [
    { title: "Automated Feeding System for Tilapia", year: 2022 },
    { title: "Water Quality Sensor Network for Freshwater Fish", year: 2023 },
    { title: "IoT Based Monitoring for Agricultural Soil", year: 2021 },
    { title: "Smart Irrigation System using Soil Moisture Sensors", year: 2023 },
    { title: "CICT Student Attendance System using RFID", year: 2022 },
    { title: "Mobile Application for Local Fishery Market", year: 2024 },
  ]

  await prisma.historicalTitle.createMany({
    data: historicalTitles,
  })

  console.log("✅ Historical Titles seeded.")

  // 5. Create Default Rubrics
  for (const stage of Object.values(DefenseStage)) {
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
