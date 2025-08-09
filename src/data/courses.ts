export type CourseTopic = "ai" | "algorithms" | "ml" | "ds" | "systems" | "general";

export interface Course {
  slug: string;
  title: string;
  description: string;
  topic: CourseTopic;
  language: string;
  initialValue: string;
}

export const courses: Course[] = [
  {
    slug: "ai-fundamentals",
    title: "AI Fundamentals",
    description: "Core AI concepts: agents, search, knowledge, reasoning, ethics.",
    topic: "ai",
    language: "markdown",
    initialValue: `Goal: Summarize AI paradigms (symbolic vs learning-based)\nConstraints: Keep to 6 bullets, 1 real-world example, plain language.\nTask: Provide a simple comparison table.`,
  },
  {
    slug: "algorithms-and-complexity",
    title: "Algorithms & Complexity",
    description: "Big-O, sorting, searching, recursion, greedy vs DP.",
    topic: "algorithms",
    language: "python",
    initialValue: `# Implement binary search and explain time complexity in comments\n# Add a test that passes a sorted list and a target.`,
  },
  {
    slug: "machine-learning-101",
    title: "Machine Learning 101",
    description: "Training pipeline, metrics, evaluation, bias & variance.",
    topic: "ml",
    language: "markdown",
    initialValue: `Design a small ML experiment plan.\n- Data split: train/val/test\n- Metric: choose and justify\n- Baseline and one improvement\n- Risk: overfitting mitigation`,
  },
  {
    slug: "data-structures",
    title: "Data Structures",
    description: "Arrays, linked lists, stacks, queues, trees, hash tables.",
    topic: "ds",
    language: "typescript",
    initialValue: `// Implement a stack with push, pop, peek, size in TypeScript.\n// Then compare array vs. linked list for frequent inserts (2 bullets).`,
  },
  {
    slug: "system-design",
    title: "System Design",
    description: "APIs, databases, caching, scaling, trade-offs.",
    topic: "systems",
    language: "markdown",
    initialValue: `Design a URL shortener: endpoints, data model, scaling constraints.\nAdd rate limiting and caching approaches in bullets.`,
  },
];
