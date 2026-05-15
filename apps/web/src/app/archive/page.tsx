import { prisma } from "@capstone/database"
import { Card, CardHeader, CardTitle, CardContent } from "@capstone/ui/components/card"
import { Button } from "@capstone/ui/components/button"
import { Badge } from "@capstone/ui/components/badge"
import { Search, BookOpen, User, Calendar, Tag } from "lucide-react"
import Link from "next/link"

export default async function PublicArchivePage({
  searchParams,
}: {
  searchParams: { q?: string, domain?: string }
}) {
  const { q, domain } = await searchParams

  const projects = await prisma.capstoneProject.findMany({
    where: {
      status: "APPROVED", // Only public/completed projects
      ...(q ? {
        title: { contains: q, mode: 'insensitive' }
      } : {}),
      ...(domain ? { domain } : {})
    },
    include: {
      group: {
        include: { members: { include: { user: true } } }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="bg-maroon-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-8 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter">
            CICT Institutional Research Archive
          </h1>
          <p className="text-maroon-100 max-w-2xl mx-auto text-lg">
            Discover and explore institutional knowledge from the Iloilo State University of Fisheries Science and Technology.
          </p>
          
          <form className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              name="q"
              defaultValue={q}
              className="w-full h-14 pl-12 pr-32 rounded-full border-none shadow-2xl text-gray-900 focus:ring-4 focus:ring-maroon-500/20 text-lg outline-none"
              placeholder="Search by title, technology, or domain..."
            />
            <Button className="absolute right-2 top-2 bottom-2 rounded-full px-8 bg-maroon-700 hover:bg-maroon-600">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <Card key={p.id} className="group hover:shadow-2xl hover:-translate-y-1 transition-all border-none bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="h-2 bg-primary w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <CardHeader>
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline" className="text-[9px] uppercase font-bold text-primary border-primary/20">
                    {p.domain}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] uppercase font-bold text-muted-foreground border-muted">
                    {new Date(p.createdAt).getFullYear()}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold font-outfit line-clamp-2 group-hover:text-primary transition-colors">
                  {p.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {p.abstract || "No abstract available for this research project."}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                    <User className="w-3 h-3 text-primary/60" />
                    {p.group.members.slice(0, 3).map(m => m.user.lastName).join(", ")}
                    {p.group.members.length > 3 && " et al."}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                    <Tag className="w-3 h-3 text-primary/60" />
                    {p.techStack.join(", ")}
                  </div>
                </div>

                <Link href={`/archive/${p.id}`} className="block">
                  <Button variant="outline" className="w-full gap-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                    <BookOpen className="w-4 h-4" /> View Research Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-muted-foreground">No projects found matching your search.</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your keywords or browsing all domains.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
