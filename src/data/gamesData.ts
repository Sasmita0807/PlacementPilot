export interface PatternBlitzQuestion {
  id: string;
  problemScenario: string;
  options: string[];
  correctPattern: string;
  explanation: string;
}

export const PATTERN_BLITZ_QUESTIONS: PatternBlitzQuestion[] = [
  {
    id: 'pb-1',
    problemScenario: 'Given an array of positive integers, find the contiguous subarray with the minimum sum that is greater than or equal to a target S.',
    options: ['Two Pointers / Sliding Window', 'Topological Sort', 'Disjoint Set (Union-Find)', 'Dijkstra Algorithm'],
    correctPattern: 'Two Pointers / Sliding Window',
    explanation: 'Since the array has positive integers, expanding the right pointer monotonically increases the sum and contracting the left pointer decreases it, making variable-size Sliding Window O(n).',
  },
  {
    id: 'pb-2',
    problemScenario: 'You are given a list of scheduled course prerequisites (e.g. course A must be taken before B). Determine if it is possible to finish all courses without a deadlock.',
    options: ['Sliding Window', 'Topological Sort / Cycle Detection (BFS/DFS)', 'Greedy Interval Scheduling', 'Binary Search on Answer'],
    correctPattern: 'Topological Sort / Cycle Detection (BFS/DFS)',
    explanation: 'Prerequisites form a directed graph. Finishing all courses requires checking if the directed graph is a Directed Acyclic Graph (DAG) using Kahn’s Algorithm or DFS coloring.',
  },
  {
    id: 'pb-3',
    problemScenario: 'Given daily stock prices, find the next day with a higher temperature/price for each day. If no future day is warmer, output 0.',
    options: ['Monotonic Stack', 'Dynamic Programming Matrix', 'Floyd-Warshall', 'Prefix Sum Array'],
    correctPattern: 'Monotonic Stack',
    explanation: 'Monotonic stack solves "next greater element" or "next smaller element" in linear O(n) time by maintaining elements in decreasing order until a larger element arrives.',
  },
  {
    id: 'pb-4',
    problemScenario: 'You are given a knapsack with maximum weight capacity W and a set of items with distinct weights and values. Each item can be picked at most once. Maximize total value.',
    options: ['0/1 Knapsack (Dynamic Programming)', 'Sliding Window', 'Breadth-First Search', 'Two Pointers'],
    correctPattern: '0/1 Knapsack (Dynamic Programming)',
    explanation: 'Because items cannot be fractional and have optimal substructure with overlapping subproblems, 0/1 Dynamic Programming (dp[w] = max(dp[w], dp[w - weight] + value)) is the exact approach.',
  },
  {
    id: 'pb-5',
    problemScenario: 'Given a rotated sorted array with unique elements, find the index of a target element in O(log n) time.',
    options: ['Modified Binary Search', 'Bubble Sort', 'Hash Set Lookup', 'Sliding Window'],
    correctPattern: 'Modified Binary Search',
    explanation: 'In any rotated sorted array, dividing at mid leaves at least one half strictly sorted. Comparing target against the sorted half boundaries allows binary elimination of half the search space.',
  },
  {
    id: 'pb-6',
    problemScenario: 'You have a collection of meeting intervals [start, end]. Find the minimum number of conference rooms required to hold all meetings without overlaps.',
    options: ['Min-Heap / Chronological Sweep-line (Greedy)', 'Dynamic Programming Bitmask', 'Topological Sort', 'Depth-First Search Backtracking'],
    correctPattern: 'Min-Heap / Chronological Sweep-line (Greedy)',
    explanation: 'Sort intervals by start time and maintain a min-heap of active meeting end times. If the earliest ending meeting finishes before the next starts, reuse the room; otherwise allocate a new room.',
  },
];

export interface CodeDetectiveQuestion {
  id: string;
  title: string;
  codeSnippet: string;
  language: 'javascript' | 'python' | 'cpp';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CODE_DETECTIVE_QUESTIONS: CodeDetectiveQuestion[] = [
  {
    id: 'cd-1',
    title: 'Off-By-One Binary Search Loop',
    language: 'javascript',
    codeSnippet: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low < high) { // Line 4
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    question: 'Why does this code fail when searching for a target that exists at the single remaining element or boundary?',
    options: [
      'The while loop condition should be "low <= high", otherwise single-element ranges or last matches are skipped',
      'Math.floor causes negative overflow',
      'The mid formula should be (low - high) / 2',
      'arr.length - 1 throws an error for even-sized arrays',
    ],
    correctIndex: 0,
    explanation: 'When low == high, there is still one candidate element to examine. Using "while (low < high)" exits prematurely without testing the element at low.',
  },
  {
    id: 'cd-2',
    title: 'Python Mutable Default Argument Pitfall',
    language: 'python',
    codeSnippet: `def append_item(item, basket=[]):
    basket.append(item)
    return basket

list_a = append_item("apple")
list_b = append_item("banana")
print(list_a)`,
    question: 'What is printed in the console?',
    options: [
      "['apple', 'banana']",
      "['apple']",
      "['banana']",
      "TypeError: default parameter mutated",
    ],
    correctIndex: 0,
    explanation: 'In Python, default arguments are evaluated only once when the function is defined, not each time it is called. The same mutable list object is shared across invocations.',
  },
  {
    id: 'cd-3',
    title: 'JavaScript Asynchronous Loop with var vs let',
    language: 'javascript',
    codeSnippet: `for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 100);
}`,
    question: 'What does this snippet print after 100ms?',
    options: [
      '3, 3, 3',
      '0, 1, 2',
      'undefined, undefined, undefined',
      '0, 0, 0',
    ],
    correctIndex: 0,
    explanation: 'Because "var" has function scope (or global scope here), the variable "i" is shared. By the time the callbacks execute on the event loop, the loop has completed and i is 3. Replacing "var" with "let" creates a new lexical binding per iteration.',
  },
  {
    id: 'cd-4',
    title: 'SQL Subquery NULL Trap in NOT IN',
    language: 'javascript',
    codeSnippet: `SELECT student_name 
FROM students 
WHERE id NOT IN (
  SELECT mentor_id 
  FROM assignments
); -- mentor_id contains at least one NULL row`,
    question: 'What happens when assignments has at least one NULL mentor_id in the subquery?',
    options: [
      'The query returns 0 rows because comparisons with NULL result in UNKNOWN, causing NOT IN to evaluate to FALSE/UNKNOWN for all rows',
      'The query ignores NULLs and returns all non-mentors correctly',
      'The database throws an exception: NullPointerException',
      'The query returns all students unconditionally',
    ],
    correctIndex: 0,
    explanation: 'In SQL 3-valued logic, `id NOT IN (1, 2, NULL)` expands to `id <> 1 AND id <> 2 AND id <> NULL`. Since `id <> NULL` is UNKNOWN, the entire conjunction is never TRUE, returning zero rows. The safe pattern is NOT EXISTS or filtering WHERE mentor_id IS NOT NULL.',
  },
];

export interface TerminologyMatchPair {
  id: string;
  term: string;
  category: string;
  definition: string;
}

export const TERMINOLOGY_PAIRS: TerminologyMatchPair[] = [
  {
    id: 'pair-1',
    term: 'CAP Theorem',
    category: 'System Design',
    definition: 'In a distributed system, you can only guarantee two out of Consistency, Availability, and Partition Tolerance.',
  },
  {
    id: 'pair-2',
    term: 'LRU Cache',
    category: 'Data Structures',
    definition: 'Eviction policy that discards the least recently used item first, commonly implemented using a HashMap + Doubly Linked List.',
  },
  {
    id: 'pair-3',
    term: 'Deadlock 4 Conditions',
    category: 'Operating Systems',
    definition: 'Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait occurring simultaneously.',
  },
  {
    id: 'pair-4',
    term: 'B+ Tree Index',
    category: 'Databases',
    definition: 'N-ary tree structure where all data records reside at leaf nodes linked together, optimizing disk I/O and range scans.',
  },
  {
    id: 'pair-5',
    term: 'Overfitting Regularization (L2)',
    category: 'Machine Learning',
    definition: 'Ridge penalty adding the squared magnitude of coefficients to the loss function to shrink weights toward zero.',
  },
  {
    id: 'pair-6',
    term: 'Idempotence',
    category: 'Web & APIs',
    definition: 'Property where performing the exact same operation multiple times yields the same state as a single invocation (e.g. HTTP PUT, DELETE).',
  },
];
