import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CourseLessons from "./pages/CourseLessons";
import LessonDetail from "./pages/LessonDetail";
import RedirectLegacyLesson from "./pages/RedirectLegacyLesson";
import RedirectLegacyLessonDetail from "./pages/RedirectLegacyLessonDetail";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import MainLayout from "./layouts/MainLayout";
import Onboarding from "./pages/Onboarding";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses/:slug/lessons" element={<CourseLessons />} />
              <Route path="/courses/:slug/lessons/:lessonSlug" element={<LessonDetail />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/lesson/:id" element={<RedirectLegacyLesson />} />
            <Route path="/lesson/:id/:lesson" element={<RedirectLegacyLessonDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
