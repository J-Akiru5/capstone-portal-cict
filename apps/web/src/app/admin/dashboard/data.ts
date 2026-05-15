import { prisma, DefenseStage, EvaluationVerdict } from "@capstone/database"

export async function getDashboardStats() {
  const [
    totalProjects,
    totalStudents,
    totalFaculty,
    projectsByStatus,
    evaluations,
    milestones,
    projects
  ] = await Promise.all([
    prisma.capstoneProject.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "FACULTY" } }),
    prisma.capstoneProject.groupBy({
      by: ['status'],
      _count: true
    }),
    prisma.evaluation.findMany({
      select: { stage: true, verdict: true }
    }),
    prisma.milestone.findMany({
      select: { status: true, dueDate: true }
    }),
    prisma.capstoneProject.findMany({
      select: { domain: true, createdAt: true }
    })
  ])

  // 1. Process Domain Distribution
  const domainMap: Record<string, number> = {}
  projects.forEach(p => {
    domainMap[p.domain] = (domainMap[p.domain] || 0) + 1
  })
  const domainData = Object.entries(domainMap).map(([name, value]) => ({ name, value }))

  // 2. Process Pass Rates per Stage
  const stageStats: Record<string, { total: number, passed: number }> = {}
  evaluations.forEach(e => {
    if (!stageStats[e.stage]) stageStats[e.stage] = { total: 0, passed: 0 }
    stageStats[e.stage].total++
    if (e.verdict === EvaluationVerdict.PASS) stageStats[e.stage].passed++
  })
  const passRateData = Object.entries(stageStats).map(([stage, stats]) => ({
    stage: stage.replace(/_/g, " "),
    rate: Math.round((stats.passed / stats.total) * 100)
  }))

  // 3. Process Cohort Velocity (Projects created per month)
  const monthlyMap: Record<string, number> = {}
  projects.forEach(p => {
    const month = p.createdAt.toLocaleString('default', { month: 'short' })
    monthlyMap[month] = (monthlyMap[month] || 0) + 1
  })
  const velocityData = Object.entries(monthlyMap).map(([name, count]) => ({ name, count }))

  return {
    overview: {
      totalProjects,
      totalStudents,
      totalFaculty,
      completionRate: Math.round((projectsByStatus.find(s => s.status === 'APPROVED')?._count || 0) / totalProjects * 100) || 0
    },
    domainData,
    passRateData,
    velocityData
  }
}
