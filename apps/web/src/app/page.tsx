import { Button } from "@capstone/ui/components/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-8 text-center">
        <h1 className="text-6xl font-bold text-primary font-outfit">
          ISUFST Capstone Portal
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Empowering CICT students at Dingle Campus through a centralized, 
          modern digital research and capstone management portal.
        </p>
        
        <div className="flex gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/archive">Browse Archive</Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h3 className="text-lg font-bold text-primary mb-2">Smart Title Check</h3>
          <p className="text-sm text-muted-foreground">
            Automated trigram-based verification to ensure research originality and prevent duplication.
          </p>
        </div>
        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h3 className="text-lg font-bold text-primary mb-2">Version Control</h3>
          <p className="text-sm text-muted-foreground">
            Seamless manuscript management with paragraph-level annotations and revision history.
          </p>
        </div>
        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <h3 className="text-lg font-bold text-primary mb-2">Digital Defense</h3>
          <p className="text-sm text-muted-foreground">
            Real-time evaluation sheets with automated grade computation and departmental rubrics.
          </p>
        </div>
      </div>
    </main>
  );
}
