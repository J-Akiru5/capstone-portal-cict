import { Button } from "@capstone/ui/components/button"
import Link from "next/link"
import { GraduationCap, BookOpen, Shield, Users, BarChart3, Library } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Smart Title Check",
    description: "Automated trigram-based verification to ensure research originality and prevent duplication.",
  },
  {
    icon: Library,
    title: "Version Control",
    description: "Seamless manuscript management with paragraph-level annotations and revision history.",
  },
  {
    icon: Shield,
    title: "Digital Defense",
    description: "Real-time evaluation sheets with automated grade computation and departmental rubrics.",
  },
  {
    icon: Users,
    title: "Panel Management",
    description: "Streamlined panel assignments, scheduling, and collaborative feedback for defense proceedings.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive insights into student progress, evaluation trends, and departmental productivity.",
  },
  {
    icon: GraduationCap,
    title: "Archive & Discovery",
    description: "Searchable repository of past capstone projects with full-text access and citation export.",
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-bold text-primary">ISUFST</span>
              <span className="block text-[10px] leading-tight text-muted-foreground">Capstone Portal</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/archive" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Archive
            </Link>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="default" size="sm">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-24 md:py-36">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Iloilo State University of Fisheries Science and Technology
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-outfit text-foreground">
              CICT Research &{" "}
              <span className="text-primary">Capstone</span>
              <br />
              Management Portal
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Empowering students and faculty at the College of Information and Communications Technology
              with a centralized digital platform for research collaboration, manuscript management,
              and academic evaluation.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/login">Access Portal</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/archive">Browse Capstone Archive</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-primary/5">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Projects", value: "120+" },
              { label: "Faculty Members", value: "45+" },
              { label: "Completed Theses", value: "500+" },
              { label: "Years Established", value: "10+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-foreground">
              Everything you need to{" "}
              <span className="text-primary">succeed</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              A complete ecosystem designed specifically for CICT capstone and research workflows.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-outfit text-primary-foreground">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Sign in to access your dashboard, submit manuscripts, or evaluate student projects.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/login">Sign In to Portal</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/archive">Explore Archive</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <GraduationCap className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <span className="text-sm font-bold text-primary">ISUFST</span>
                  <span className="block text-[10px] leading-tight text-muted-foreground">Capstone Portal</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                College of Information and Communications Technology
                <br />
                Dingle, Iloilo, Philippines
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 text-foreground">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Archive", "Login"].map((link) => (
                  <li key={link}>
                    <Link
                      href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 text-foreground">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>CICT Dean&apos;s Office</li>
                <li>Dingle Campus</li>
                <li>Iloilo, Philippines</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ISUFST — College of Information and Communications Technology.
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
