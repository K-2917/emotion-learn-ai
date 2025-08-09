import heroImage from "@/assets/hero-campus.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <img
          src={heroImage}
          alt="Warm academic abstract background"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 [background:var(--gradient-hero)]" />
      </div>
      <div className="relative container py-20 md:py-28">
        <div className="max-w-3xl animate-fade-in-up">
          <h1 className="font-serif text-4xl md:text-6xl font-semibold leading-tight">
            Learn Prompt Engineering with an Encouraging AI Professor
          </h1>
          <p className="mt-4 md:mt-6 text-lg text-foreground/80">
            ProfAI blends theory and hands-on practice—guiding you step-by-step, sensing confusion,
            and celebrating your progress like a favorite teacher.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild className="relative overflow-hidden btn-ripple">
              <Link to="/signup" aria-label="Start the free course">Start free course</Link>
            </Button>
            <Button asChild variant="secondary" className="relative overflow-hidden btn-ripple">
              <a href="#demo" aria-label="Watch a demo lesson">Watch demo</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
