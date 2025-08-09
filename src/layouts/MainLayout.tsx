import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import profAvatar from "@/assets/profai-avatar.png";

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? "bg-secondary text-foreground" : "text-foreground/70 hover:text-foreground"
      }`
    }
  >
    {label}
  </NavLink>
);

export default function MainLayout() {
  const { pathname } = useLocation();
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Update page title fallback (Helmet sets more specific titles per page)
    if (pathname === "/") document.title = "ProfAI – AI Professor Platform";
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header
        className={`sticky top-0 z-40 border-b transition-colors ${
          atTop ? "border-transparent" : "border-border bg-background/80 backdrop-blur"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={profAvatar} alt="ProfAI friendly AI professor avatar" className="h-8 w-8 rounded-full" />
            <span className="font-semibold">ProfAI</span>
          </Link>
            <nav className="hidden md:flex items-center gap-1">
              <NavItem to="/dashboard" label="Dashboard" />
              <NavItem to="/courses" label="Courses" />
              <NavItem to="/lesson/intro" label="Lesson" />
              <NavItem to="/analytics" label="Analytics" />
              <NavItem to="/settings" label="Settings" />
            </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost"><Link to="/login">Log in</Link></Button>
            <Button asChild><Link to="/signup">Start learning</Link></Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="container py-8 text-sm text-foreground/70 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ProfAI. Learn prompt engineering the MIT way.</p>
          <nav className="flex gap-4">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/settings" className="hover:text-foreground">Settings</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
