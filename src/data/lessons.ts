import type { Course } from "./courses";

export interface JsTestCase {
  args: any[];
  expected: any;
}

export interface LessonDef {
  slug: string;
  title: string;
  description: string;
  sampleLanguage?: string;
  sampleCode?: string;
  assignment: {
    title: string;
    description: string;
    language: "javascript"; // runner supports JS in-browser
    functionName: string;
    starterCode: string;
    tests: JsTestCase[];
  };
}

export const lessonsByCourse: Record<string, LessonDef[]> = {
  "ai-fundamentals": [
    {
      slug: "ai-paradigms",
      title: "AI Paradigms",
      description:
        "Understand symbolic (rule-based) vs learning-based approaches and when to use each.",
      sampleLanguage: "javascript",
      sampleCode:
        `// A tiny reflex agent example\nfunction reflexAgent(percept) {\n  if (percept === 'dirty') return 'clean';\n  if (percept === 'bump') return 'turn';\n  return 'move';\n}\nconsole.log(reflexAgent('dirty')); // clean`,
      assignment: {
        title: "Argmax Index",
        description:
          "Implement argmaxIndex(arr) that returns the index of the first maximum value.",
        language: "javascript",
        functionName: "argmaxIndex",
        starterCode:
          `// Return the index of the first maximum value in the array\nfunction argmaxIndex(arr) {\n  // TODO\n}\n\n;`,
        tests: [
          { args: [[3, 5, 2]], expected: 1 },
          { args: [[-1, -5, -2]], expected: 0 },
          { args: [[7, 7, 1]], expected: 0 },
          { args: [[0]], expected: 0 },
        ],
      },
    },
    {
      slug: "search-strategies",
      title: "Search Strategies",
      description:
        "Breadth-first vs depth-first search; optimality and completeness in graphs.",
      sampleLanguage: "javascript",
      sampleCode:
        `// BFS: shortest path length in an unweighted graph (adjacency list)\nfunction bfsLen(graph, start, goal) {\n  const q = [[start, 0]];\n  const seen = new Set([start]);\n  while (q.length) {\n    const [node, d] = q.shift();\n    if (node === goal) return d;\n    for (const nxt of graph[node] || []) {\n      if (!seen.has(nxt)) { seen.add(nxt); q.push([nxt, d + 1]); }\n    }\n  }\n  return -1;\n}\nconsole.log(bfsLen({A:['B'],B:['C'],C:[]}, 'A','C')); // 2`,
      assignment: {
        title: "BFS Shortest Path Length",
        description:
          "Write bfsShortestPathLen(graph, start, goal) returning the fewest edges from start to goal, or -1.",
        language: "javascript",
        functionName: "bfsShortestPathLen",
        starterCode:
          `// graph is an object: { A: ['B','C'], B: ['C'], ... }\nfunction bfsShortestPathLen(graph, start, goal) {\n  // TODO\n}\n\n;`,
        tests: [
          { args: [{ A: ['B'], B: ['C'], C: [] }, 'A', 'C'], expected: 2 },
          { args: [{ A: ['B','C'], B: [], C: ['D'], D: [] }, 'A', 'D'], expected: 2 },
          { args: [{ A: ['B'], B: [], C: [] }, 'A', 'C'], expected: -1 },
        ],
      },
    },
  ],

  "algorithms-and-complexity": [
    {
      slug: "sorting",
      title: "Sorting Algorithms",
      description:
        "Learn how comparison-based sorting works (O(n^2) vs O(n log n)), stability, and when to choose each algorithm.",
      sampleLanguage: "javascript",
      sampleCode:
        `// Bubble Sort (educational example)\nfunction bubbleSort(arr) {\n  const a = arr.slice();\n  for (let i = 0; i < a.length - 1; i++) {\n    for (let j = 0; j < a.length - i - 1; j++) {\n      if (a[j] > a[j + 1]) {\n        [a[j], a[j + 1]] = [a[j + 1], a[j]];\n      }\n    }\n  }\n  return a;\n}\n\nconsole.log(bubbleSort([5,2,4,6,1])); // [1,2,4,5,6]`,
      assignment: {
        title: "Implement Insertion Sort",
        description:
          "Write insertionSort(arr) that returns a new sorted array ascending. Aim for O(n^2) and no built-ins like sort().",
        language: "javascript",
        functionName: "insertionSort",
        starterCode:
          `// Implement insertion sort\nfunction insertionSort(arr) {\n  // TODO: return a new sorted array\n}\n\n// export for runner\n;`,
        tests: [
          { args: [[3, 1, 2]], expected: [1, 2, 3] },
          { args: [[5, -1, 0, 5]], expected: [-1, 0, 5, 5] },
          { args: [[1]], expected: [1] },
          { args: [[2, 2, 2]], expected: [2, 2, 2] },
        ],
      },
    },
    {
      slug: "searching",
      title: "Searching Algorithms",
      description:
        "Understand linear vs binary search, preconditions (sorted arrays), and time complexities.",
      sampleLanguage: "javascript",
      sampleCode:
        `// Binary Search (iterative)\nfunction binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;\n  }\n  return -1;\n}\n\nconsole.log(binarySearch([1,3,4,7,9,12], 7)); // 3`,
      assignment: {
        title: "Implement Binary Search",
        description:
          "Write binarySearch(arr, target) returning the index of target in a sorted array or -1 if not found.",
        language: "javascript",
        functionName: "binarySearch",
        starterCode:
          `// Implement binary search (array is sorted ascending)\nfunction binarySearch(arr, target) {\n  // TODO: return index or -1\n}\n\n// export for runner\n;`,
        tests: [
          { args: [[1, 3, 4, 7, 9, 12], 7], expected: 3 },
          { args: [[-5, -2, 0, 2, 10, 10, 11], -2], expected: 1 },
          { args: [[1, 2, 3, 4, 5], 6], expected: -1 },
          { args: [[], 1], expected: -1 },
        ],
      },
    },
  ],

  "machine-learning-101": [
    {
      slug: "metrics",
      title: "Model Metrics",
      description:
        "Key metrics like accuracy, precision, recall, and when to use each.",
      sampleLanguage: "javascript",
      sampleCode:
        `// Compute accuracy given predictions and labels\nfunction accuracy(preds, labels) {\n  let correct = 0;\n  for (let i = 0; i < preds.length; i++) if (preds[i] === labels[i]) correct++;\n  return correct / preds.length;\n}\nconsole.log(accuracy([1,0,1,1],[1,1,1,0])); // 0.5`,
      assignment: {
        title: "Implement accuracy",
        description: "Write accuracy(preds, labels) returning a number between 0 and 1.",
        language: "javascript",
        functionName: "accuracy",
        starterCode:
          `function accuracy(preds, labels) {\n  // TODO\n}\n\n;`,
        tests: [
          { args: [[1,0,1,1], [1,1,1,0]], expected: 0.5 },
          { args: [[0,0,0], [0,0,0]], expected: 1 },
          { args: [[1,0], [0,1]], expected: 0 },
        ],
      },
    },
    {
      slug: "linear-regression",
      title: "Linear Regression",
      description:
        "Predict with y = a*x + b and evaluate with Mean Squared Error (MSE).",
      sampleLanguage: "javascript",
      sampleCode:
        `function mse(yTrue, yPred) {\n  let s = 0;\n  for (let i = 0; i < yTrue.length; i++) {\n    const e = yTrue[i] - yPred[i];\n    s += e*e;\n  }\n  return s / yTrue.length;\n}\nconsole.log(mse([1,2],[1,3])); // 0.5`,
      assignment: {
        title: "Implement MSE",
        description: "Write mse(yTrue, yPred) returning the mean squared error.",
        language: "javascript",
        functionName: "mse",
        starterCode:
          `function mse(yTrue, yPred) {\n  // TODO\n}\n\n;`,
        tests: [
          { args: [[1,2],[1,3]], expected: 0.5 },
          { args: [[0,0,0],[0,0,0]], expected: 0 },
          { args: [[-1,1],[0,0]], expected: 1 },
        ],
      },
    },
  ],

  "data-structures": [
    {
      slug: "stacks-queues",
      title: "Stacks and Queues",
      description:
        "LIFO vs FIFO, typical operations, and common use-cases.",
      sampleLanguage: "javascript",
      sampleCode:
        `class Stack {\n  constructor(){ this.a = []; }\n  push(x){ this.a.push(x); }\n  pop(){ return this.a.pop(); }\n  size(){ return this.a.length; }\n}\nconst s = new Stack(); s.push(1); s.push(2); console.log(s.pop()); // 2`,
      assignment: {
        title: "Valid Parentheses (Stack)",
        description: "Write isValidParentheses(s) that returns true if (),{},[] are properly closed.",
        language: "javascript",
        functionName: "isValidParentheses",
        starterCode:
          `function isValidParentheses(s){\n  // TODO\n}\n\n;`,
        tests: [
          { args: ["()[]{}"], expected: true },
          { args: ["(]"], expected: false },
          { args: ["({[]})"], expected: true },
          { args: ["(("], expected: false },
        ],
      },
    },
    {
      slug: "hash-tables",
      title: "Hash Tables",
      description:
        "Constant-time lookups on average; collisions and typical patterns.",
      sampleLanguage: "javascript",
      sampleCode:
        `// Two-sum using a map\nfunction twoSum(nums, target){\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++){\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n  return [-1, -1];\n}\nconsole.log(twoSum([2,7,11,15], 9)); // [0,1]`,
      assignment: {
        title: "Implement twoSum",
        description: "Write twoSum(nums, target) returning the indices of two numbers adding to target or [-1,-1].",
        language: "javascript",
        functionName: "twoSum",
        starterCode:
          `function twoSum(nums, target){\n  // TODO\n}\n\n;`,
        tests: [
          { args: [[2,7,11,15], 9], expected: [0,1] },
          { args: [[3,2,4], 6], expected: [1,2] },
          { args: [[3,3], 6], expected: [0,1] },
        ],
      },
    },
  ],

  "system-design": [
    {
      slug: "url-shortener",
      title: "URL Shortener Basics",
      description:
        "Identifiers, base62 encoding, and the request flow for redirection.",
      sampleLanguage: "javascript",
      sampleCode:
        `const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';\nfunction encodeBase62(n){\n  if (n === 0) return '0';\n  let s=''; while(n>0){ s = ALPHABET[n%62] + s; n = Math.floor(n/62);} return s;\n}\nfunction decodeBase62(s){\n  let n=0; for(const ch of s){ n = n*62 + ALPHABET.indexOf(ch);} return n;\n}\nconsole.log(encodeBase62(125)); // '21'`,
      assignment: {
        title: "Round-trip Base62",
        description: "Write encodeDecodeRoundTrip(n) that encodes to base62 and decodes back, returning the original number.",
        language: "javascript",
        functionName: "encodeDecodeRoundTrip",
        starterCode:
          `const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';\nfunction encodeBase62(n){\n  // TODO\n}\nfunction decodeBase62(s){\n  // TODO\n}\nfunction encodeDecodeRoundTrip(n){\n  // TODO: use the helpers above\n}\n\n;`,
        tests: [
          { args: [0], expected: 0 },
          { args: [61], expected: 61 },
          { args: [125], expected: 125 },
          { args: [99999], expected: 99999 },
        ],
      },
    },
    {
      slug: "caching",
      title: "Caching (LRU intuition)",
      description:
        "Eviction policies and recency; how LRU approximates what users access most.",
      sampleLanguage: "javascript",
      sampleCode:
        `// Track most-recently-used keys by scanning an access list\nfunction recentlyUsed(keys, capacity){\n  const seen = new Set();\n  const order = [];\n  for (const k of keys){\n    const i = order.indexOf(k); if (i !== -1) order.splice(i,1);\n    order.unshift(k);\n    if (order.length > capacity) order.pop();\n  }\n  return order; // most recent first\n}\nconsole.log(recentlyUsed([1,2,3,1], 2)); // [1,3]`,
      assignment: {
        title: "Recently-used keys",
        description: "Write recentlyUsed(keys, capacity) returning the most-recent-first keys limited by capacity.",
        language: "javascript",
        functionName: "recentlyUsed",
        starterCode:
          `function recentlyUsed(keys, capacity){\n  // TODO\n}\n\n;`,
        tests: [
          { args: [[1,2,3,1], 2], expected: [1,3] },
          { args: [["a","b","a","c"], 2], expected: ["c","a"] },
          { args: [[1,1,1], 1], expected: [1] },
        ],
      },
    },
  ],
};
