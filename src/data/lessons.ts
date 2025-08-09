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
};
