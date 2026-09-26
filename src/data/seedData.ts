import {
  UserProfile,
  CodingProblem,
  QuizSection,
  RoadmapPhase,
  DailyTask,
  JobRecommendation,
  ApplicationRecord,
  AssessmentResult,
  SkillGap
} from '../types';

export const DEMO_USER: UserProfile = {
  id: 'user-demo-1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@campus.edu',
  targetRole: 'Software/IT',
  careerGoals: 'Crack an SDE-1 / Software Engineering internship at a top product tech company with solid fundamentals in DSA, clean system design, and strong behavioral confidence.',
  targetCompanyTier: 'Tier 1 / Product (Google, Microsoft, Amazon)',
  graduationYear: '2026',
  college: 'National Institute of Technology',
  proficiencyLevel: 'Intermediate',
  overallReadiness: 74,
  roleReadiness: 78,
  streakDays: 6,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalXp: 1850,
  completedTasksCount: 22,
  createdAt: '2026-09-01T08:00:00.000Z',
};

export const INITIAL_SKILL_GAPS: SkillGap[] = [
  {
    skill: 'Dynamic Programming & Graph Traversal',
    category: 'Coding Fundamentals',
    currentScore: 58,
    targetScore: 85,
    gapLevel: 'High',
    priorityAction: 'Complete 5 1-D & 2-D DP problem patterns and memorize state transitions.',
  },
  {
    skill: 'System Design Basics & Scalability Concepts',
    category: 'Role Specific',
    currentScore: 62,
    targetScore: 80,
    gapLevel: 'Medium',
    priorityAction: 'Review Caching strategies (Redis/CDN), Load Balancing, and Database Indexing.',
  },
  {
    skill: 'Behavioral STAR Storytelling',
    category: 'Communication',
    currentScore: 70,
    targetScore: 88,
    gapLevel: 'Medium',
    priorityAction: 'Draft structured STAR narratives for 3 leadership/conflict project scenarios.',
  },
  {
    skill: 'Permutation, Combination & Probability',
    category: 'Aptitude',
    currentScore: 68,
    targetScore: 85,
    gapLevel: 'Medium',
    priorityAction: 'Practice 15 fast mental-math and combinatorics questions under 60-second limit.',
  },
];

export const INITIAL_ASSESSMENT: AssessmentResult = {
  id: 'assess-init-1',
  userId: 'user-demo-1',
  date: '2026-09-20',
  overallScore: 74,
  aptitudeScore: 78,
  codingScore: 72,
  communicationScore: 75,
  roleSpecificScore: 71,
  weakAreas: ['Dynamic Programming', 'Graph BFS/DFS Cycle Detection', 'STAR Behavioral Clarity', 'Complex Probability'],
  strongAreas: ['Data Structures (Arrays, HashMaps, Trees)', 'OOP Principles', 'Time & Space Complexity Analysis', 'Written Technical Articulation'],
  recommendations: [
    'Focus today on 2-D DP state transition formulation.',
    'Do 1 text mock interview focusing on past project conflict resolution.',
    'Enhance resume bullet points with quantified performance metrics.',
  ],
  roleReadinessBreakdown: [
    { role: 'Software/IT Engineer', readiness: 78, fitLevel: 'Strong Fit' },
    { role: 'AI/ML Engineer', readiness: 64, fitLevel: 'Moderate Fit' },
    { role: 'Data Scientist', readiness: 68, fitLevel: 'Moderate Fit' },
    { role: 'CS & Systems Engineer', readiness: 72, fitLevel: 'Strong Fit' },
  ],
};

export const INITIAL_DAILY_TASKS: DailyTask[] = [
  {
    id: 'task-1',
    title: 'Solve "Longest Substring Without Repeating Characters"',
    description: 'Master the Sliding Window + HashMap pattern. Test with edge cases containing empty strings and duplicate symbols.',
    category: 'DSA',
    difficulty: 'Medium',
    estimatedMinutes: 30,
    completed: true,
    priority: 1,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'task-2',
    title: 'Mock Behavioral Session: "Describe a project roadblock"',
    description: 'Use the STAR framework. Record your answer and review the AI critique for concise outcome quantification.',
    category: 'Mock',
    difficulty: 'Medium',
    estimatedMinutes: 20,
    completed: false,
    priority: 2,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'task-3',
    title: 'Review Operating Systems: Virtual Memory & Page Faults',
    description: 'Revise LRU page replacement algorithm, TLB hit rates, and demand paging mechanisms.',
    category: 'Core CS',
    difficulty: 'Easy',
    estimatedMinutes: 25,
    completed: false,
    priority: 3,
    date: new Date().toISOString().split('T')[0],
  },
];

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'prob-1',
    title: 'Two Sum (Optimal Hash Map)',
    difficulty: 'Easy',
    category: 'Arrays',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int comp = target - nums[i];
        if (seen.count(comp)) return {seen[comp], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) return new int[] { map.get(complement), i };
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
    },
    solutionCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    approach: 'Single-pass Hash Table. As we iterate through the array, we check if the complement (target - nums[i]) exists in our hash table. If yes, we immediately return the stored index and current index. If not, we store the current number with its index.',
    timeComplexity: 'O(n) - Single iteration through the array',
    spaceComplexity: 'O(n) - Hash map storing up to n elements',
    testCases: [
      { input: JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }), expectedOutput: '[0,1]' },
      { input: JSON.stringify({ nums: [3, 2, 4], target: 6 }), expectedOutput: '[1,2]' },
      { input: JSON.stringify({ nums: [3, 3], target: 6 }), expectedOutput: '[0,1]' },
    ],
  },
  {
    id: 'prob-2',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Strings',
    description: `Given a string \`s\`, find the length of the longest substring without duplicate characters.

A substring is a contiguous non-empty sequence of characters within a string.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3. Note that "pwke" is a subsequence, not a substring.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your code here
  let maxLength = 0;
  let left = 0;
  const lastSeen = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }
    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    last_seen = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> lastSeen;
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.size(); ++right) {
        if (lastSeen.count(s[right]) && lastSeen[s[right]] >= left) {
            left = lastSeen[s[right]] + 1;
        }
        lastSeen[s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
      java: `import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
                left = lastSeen.get(c) + 1;
            }
            lastSeen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
    },
    solutionCode: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let left = 0;
  const lastSeen = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }
    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}`,
    approach: 'Sliding Window technique with Map. We maintain a window [left, right]. When character s[right] has been seen within the current window (its index >= left), we jump the left pointer right past its previous occurrence.',
    timeComplexity: 'O(n) - Each character is visited at most twice',
    spaceComplexity: 'O(min(m, n)) - Space for character set',
    testCases: [
      { input: JSON.stringify({ s: 'abcabcbb' }), expectedOutput: '3' },
      { input: JSON.stringify({ s: 'bbbbb' }), expectedOutput: '1' },
      { input: JSON.stringify({ s: 'pwwkew' }), expectedOutput: '3' },
      { input: JSON.stringify({ s: '' }), expectedOutput: '0' },
    ],
  },
  {
    id: 'prob-3',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.`,
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The max area is formed between index 1 and index 8: min(8, 7) * (8 - 1) = 49.',
      },
      {
        input: 'height = [1,1]',
        output: '1',
        explanation: 'The max area is min(1, 1) * 1 = 1.',
      },
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4',
    ],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your code here
  let max = 0;
  let left = 0;
  let right = height.length - 1;

  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const w = right - left;
    max = Math.max(max, h * w);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
}`,
      python: `def maxArea(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_area = 0
    while left < right:
        h = min(height[left], height[right])
        max_area = max(max_area, h * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1, ans = 0;
    while (left < right) {
        int h = min(height[left], height[right]);
        ans = max(ans, h * (right - left));
        if (height[left] < height[right]) left++;
        else right--;
    }
    return ans;
}`,
      java: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1, max = 0;
        while (left < right) {
            int h = Math.min(height[left], height[right]);
            max = Math.max(max, h * (right - left));
            if (height[left] < height[right]) left++;
            else right--;
        }
        return max;
    }
}`,
    },
    solutionCode: `function maxArea(height) {
  let max = 0;
  let left = 0;
  let right = height.length - 1;

  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const w = right - left;
    max = Math.max(max, h * w);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
}`,
    approach: 'Two-pointer greedy strategy. Start pointers at both extremes. The width is at its maximum. The height is bottlenecked by the shorter line. Moving the taller line inward cannot possibly increase the area, so we greedily move the shorter line inward.',
    timeComplexity: 'O(n) - Single pass where pointers meet in the middle',
    spaceComplexity: 'O(1) - Constant auxiliary space',
    testCases: [
      { input: JSON.stringify({ height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }), expectedOutput: '49' },
      { input: JSON.stringify({ height: [1, 1] }), expectedOutput: '1' },
      { input: JSON.stringify({ height: [4, 3, 2, 1, 4] }), expectedOutput: '16' },
    ],
  },
  {
    id: 'prob-4',
    title: 'Climbing Stairs (Dynamic Programming)',
    difficulty: 'Easy',
    category: 'DP',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways: (1 step + 1 step) or (2 steps).',
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: (1+1+1), (1+2), or (2+1).',
      },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
      python: `def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
      cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; ++i) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}`,
      java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
    },
    solutionCode: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`,
    approach: 'State transition recurrence: dp[i] = dp[i-1] + dp[i-2]. Since reaching step i only depends on the previous two steps, we can optimize space to O(1) using two variables.',
    timeComplexity: 'O(n) - Single loop up to n',
    spaceComplexity: 'O(1) - Constant auxiliary space',
    testCases: [
      { input: JSON.stringify({ n: 2 }), expectedOutput: '2' },
      { input: JSON.stringify({ n: 3 }), expectedOutput: '3' },
      { input: JSON.stringify({ n: 5 }), expectedOutput: '8' },
    ],
  },
  {
    id: 'prob-5',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    category: 'Trees',
    description: `Given the root of a binary tree in array representation, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys less than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- Both the left and right subtrees must also be binary search trees.`,
    examples: [
      {
        input: 'tree = [2,1,3]',
        output: 'true',
        explanation: 'Node 2 has left child 1 (< 2) and right child 3 (> 2).',
      },
      {
        input: 'tree = [5,1,4,null,null,3,6]',
        output: 'false',
        explanation: 'The root node is 5, but its right child\'s left value is 3, which is not > 5.',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1',
    ],
    starterCode: {
      javascript: `function isValidBST(nodes) {
  // Input is level-order array: e.g. [2, 1, 3]
  function validate(index, min, max) {
    if (index >= nodes.length || nodes[index] === null || nodes[index] === undefined) {
      return true;
    }
    const val = nodes[index];
    if (val <= min || val >= max) return false;
    return validate(2 * index + 1, min, val) && validate(2 * index + 2, val, max);
  }
  return validate(0, -Infinity, Infinity);
}`,
      python: `def isValidBST(nodes):
    def validate(index, low, high):
        if index >= len(nodes) or nodes[index] is None:
            return True
        val = nodes[index]
        if not (low < val < high):
            return False
        return validate(2 * index + 1, low, val) and validate(2 * index + 2, val, high)
    return validate(0, float('-inf'), float('inf'))`,
      cpp: `#include <vector>
#include <climits>
using namespace std;

// Represented via level-order vector with INT_MIN as null
bool validate(const vector<long long>& nodes, int idx, long long low, long long high) {
    if (idx >= nodes.size() || nodes[idx] == LLONG_MIN) return true;
    long long val = nodes[idx];
    if (val <= low || val >= high) return false;
    return validate(nodes, 2 * idx + 1, low, val) && validate(nodes, 2 * idx + 2, val, high);
}`,
      java: `class Solution {
    public boolean isValidBST(Integer[] nodes) {
        return validate(nodes, 0, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    private boolean validate(Integer[] nodes, int idx, long low, long high) {
        if (idx >= nodes.length || nodes[idx] == null) return true;
        long val = nodes[idx];
        if (val <= low || val >= high) return false;
        return validate(nodes, 2 * idx + 1, low, val) && validate(nodes, 2 * idx + 2, val, high);
    }
}`,
    },
    solutionCode: `function isValidBST(nodes) {
  function validate(index, min, max) {
    if (index >= nodes.length || nodes[index] === null || nodes[index] === undefined) {
      return true;
    }
    const val = nodes[index];
    if (val <= min || val >= max) return false;
    return validate(2 * index + 1, min, val) && validate(2 * index + 2, val, max);
  }
  return validate(0, -Infinity, Infinity);
}`,
    approach: 'Range Propagation with DFS. At each step, a node is bounded by (min, max). For its left child, the upper bound becomes current node value; for the right child, the lower bound becomes current node value.',
    timeComplexity: 'O(n) - Visiting each tree node once',
    spaceComplexity: 'O(h) - Call stack height',
    testCases: [
      { input: JSON.stringify({ nodes: [2, 1, 3] }), expectedOutput: 'true' },
      { input: JSON.stringify({ nodes: [5, 1, 4, null, null, 3, 6] }), expectedOutput: 'false' },
    ],
  },
];

export const QUIZ_SECTIONS: QuizSection[] = [
  {
    id: 'quiz-fundamentals',
    title: 'Core CS & DSA Fundamentals',
    description: 'Data structures, algorithm complexity, pointers, memory models, and sorting fundamentals.',
    questionsCount: 4,
    category: 'Fundamentals',
    questions: [
      {
        id: 'q-f1',
        question: 'What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?',
        options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
        correctOptionIndex: 1,
        explanation: 'In the worst case (e.g. elements inserted in strictly sorted order), the BST degenerates into a singly linked list with height n, yielding O(n) search time.',
        category: 'Data Structures',
      },
      {
        id: 'q-f2',
        question: 'Which sorting algorithm is guaranteed to be stable and operates in O(n log n) time in all cases?',
        options: ['QuickSort', 'MergeSort', 'HeapSort', 'SelectionSort'],
        correctOptionIndex: 1,
        explanation: 'MergeSort divides the array recursively and merges sorted halves while preserving relative order of equal elements in all cases (O(n log n)). QuickSort is not stable by default and has an O(n^2) worst case.',
        category: 'Algorithms',
      },
      {
        id: 'q-f3',
        question: 'What happens during a "Page Fault" in virtual memory systems?',
        options: [
          'The CPU crashes due to invalid memory write',
          'The requested page is not currently resident in physical RAM and must be loaded from secondary storage',
          'The cache controller detects dirty cache lines',
          'Two processes attempt to modify the same virtual address without synchronization',
        ],
        correctOptionIndex: 1,
        explanation: 'A page fault is an OS trap raised by hardware (MMU) when a program accesses a mapped memory page not currently loaded into physical memory (RAM).',
        category: 'Operating Systems',
      },
      {
        id: 'q-f4',
        question: 'In relational databases, which isolation level prevents "Dirty Reads" but still allows "Non-Repeatable Reads"?',
        options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
        correctOptionIndex: 1,
        explanation: 'Read Committed guarantees that any data read was committed at the moment it is read, eliminating dirty reads, but concurrent transactions can still commit updates between successive reads.',
        category: 'Databases',
      },
    ],
  },
  {
    id: 'quiz-role-specific',
    title: 'Role-Specific Concepts (AI/ML & Software)',
    description: 'System design, REST APIs, ML evaluation metrics, concurrency, and architecture patterns.',
    questionsCount: 4,
    category: 'Role-Specific',
    questions: [
      {
        id: 'q-r1',
        question: 'When evaluating a model on an imbalanced dataset where detecting positive fraud cases is paramount, which metric is most reliable?',
        options: ['Accuracy', 'ROC-AUC alone', 'Precision-Recall AUC / F1-Score', 'Mean Squared Error'],
        correctOptionIndex: 2,
        explanation: 'In severe class imbalance (e.g. 99% negative cases), standard accuracy can be 99% while catching zero fraud. PR-AUC and F1-score focus directly on the minority class trade-off.',
        category: 'AI/ML',
      },
      {
        id: 'q-r2',
        question: 'What is the primary difference between horizontal scaling and vertical scaling?',
        options: [
          'Horizontal scaling adds more machines to the resource pool, while vertical scaling adds power (CPU/RAM) to existing servers',
          'Horizontal scaling requires downtime while vertical scaling does not',
          'Horizontal scaling is only used for databases, never web servers',
          'Vertical scaling distributes queries using a load balancer',
        ],
        correctOptionIndex: 0,
        explanation: 'Horizontal scaling (scaling out) distributes load across multiple independent nodes, while vertical scaling (scaling up) upgrades the hardware capacity of a single machine.',
        category: 'System Design',
      },
      {
        id: 'q-r3',
        question: 'Which HTTP status code should be returned when a client makes a request with valid authentication credentials, but lacks permission to access the resource?',
        options: ['401 Unauthorized', '403 Forbidden', '404 Not Found', '422 Unprocessable Entity'],
        correctOptionIndex: 1,
        explanation: '401 Unauthorized implies lack of valid authentication credentials. 403 Forbidden means the identity is known, but the client does not have authorization to access the specific resource.',
        category: 'Web & APIs',
      },
      {
        id: 'q-r4',
        question: 'In Deep Learning, what issue does "Batch Normalization" primarily mitigate during training?',
        options: [
          'Internal covariate shift by normalizing layer activations across mini-batches',
          'Overfitting by randomly dropping 50% of weights',
          'Vanishing gradients only in the final output layer',
          'Memory leaks in GPU VRAM',
        ],
        correctOptionIndex: 0,
        explanation: 'Batch Normalization normalizes the outputs of previous layers across the batch, reducing internal covariate shift, allowing higher learning rates, and stabilizing convergence.',
        category: 'AI/ML',
      },
    ],
  },
  {
    id: 'quiz-aptitude',
    title: 'Quantitative & Analytical Aptitude',
    description: 'Speed math, probability, logical sequences, and placement round screening puzzles.',
    questionsCount: 4,
    category: 'Aptitude',
    questions: [
      {
        id: 'q-a1',
        question: 'A train 180 meters long running at 54 km/h passes a bridge in 20 seconds. What is the length of the bridge?',
        options: ['120 meters', '150 meters', '180 meters', '200 meters'],
        correctOptionIndex: 0,
        explanation: 'Speed = 54 * (5/18) = 15 m/s. Total distance in 20s = 15 * 20 = 300 meters. Bridge length = 300 - 180 (train length) = 120 meters.',
        category: 'Speed & Distance',
      },
      {
        id: 'q-a2',
        question: 'In a bag of 5 red and 7 blue balls, two balls are drawn at random without replacement. What is the probability that both balls are red?',
        options: ['5/33', '10/33', '25/144', '5/22'],
        correctOptionIndex: 0,
        explanation: 'Total balls = 12. P(First Red) = 5/12. P(Second Red) = 4/11. P(Both Red) = (5/12) * (4/11) = 20/132 = 5/33.',
        category: 'Probability',
      },
      {
        id: 'q-a3',
        question: 'Find the next number in the sequence: 4, 9, 25, 49, 121, 169, ?',
        options: ['196', '225', '289', '361'],
        correctOptionIndex: 2,
        explanation: 'The series consists of squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169. The next prime is 17, and 17^2 = 289.',
        category: 'Number Series',
      },
      {
        id: 'q-a4',
        question: 'Pipe A can fill a tank in 6 hours and Pipe B can empty it in 8 hours. If both pipes are opened simultaneously, in how many hours will the tank be full?',
        options: ['14 hours', '20 hours', '24 hours', '48 hours'],
        correctOptionIndex: 2,
        explanation: 'Net rate per hour = 1/6 - 1/8 = (4 - 3)/24 = 1/24. Thus, it will take 24 hours to fill the tank completely.',
        category: 'Work & Pipes',
      },
    ],
  },
];

export const INITIAL_ROADMAP: RoadmapPhase[] = [
  {
    phaseNumber: 1,
    phaseName: 'Phase 1: Core Fundamentals & DSA Mastery',
    durationWeeks: 'Weeks 1 - 3',
    focus: 'Data Structures, Algorithmic Complexity, and Pattern Recognition',
    milestones: [
      {
        id: 'm-1-1',
        phaseId: 1,
        title: 'Arrays, Two Pointers & Sliding Window',
        description: 'Solve 15 essential problems covering prefix sums, contiguous sub-arrays, and two-pointer convergence.',
        topics: ['Two Sum Variants', 'Max Subarray Sum (Kadane)', 'Trapping Rain Water', 'Minimum Window Substring'],
        estimatedHours: 12,
        completed: true,
        resources: [
          { title: 'NeetCode 150 - Arrays & Hashing', type: 'practice' },
          { title: 'Sliding Window Algorithm In-Depth', type: 'doc' },
        ],
      },
      {
        id: 'm-1-2',
        phaseId: 1,
        title: 'Binary Trees, BST & DFS/BFS Traversal',
        description: 'Understand recursive vs iterative traversals, lowest common ancestor, and diameter computation.',
        topics: ['Inorder/Preorder/Postorder', 'Level Order BFS', 'LCA in Binary Tree', 'Path Sum III'],
        estimatedHours: 14,
        completed: true,
        resources: [
          { title: 'Visualgo - Tree Visualizations', type: 'practice' },
          { title: 'MIT 6.006 Tree Recurrences', type: 'video' },
        ],
      },
      {
        id: 'm-1-3',
        phaseId: 1,
        title: 'Dynamic Programming & State Transitions',
        description: 'Conquer 1D and 2D DP. Practice memoization vs tabulation, knapsack patterns, and string matching.',
        topics: ['0/1 Knapsack', 'Coin Change I & II', 'Longest Common Subsequence', 'Edit Distance'],
        estimatedHours: 18,
        completed: false,
        resources: [
          { title: 'Grokking DP Patterns', type: 'doc' },
          { title: 'CSES Dynamic Programming Practice', type: 'practice' },
        ],
      },
    ],
  },
  {
    phaseNumber: 2,
    phaseName: 'Phase 2: Role-Specific Engineering & Systems',
    durationWeeks: 'Weeks 4 - 6',
    focus: 'High-Level Architecture, Operating Systems, Networks & Modern Frameworks',
    milestones: [
      {
        id: 'm-2-1',
        phaseId: 2,
        title: 'System Design Fundamentals (Scalability & Caching)',
        description: 'Learn load balancing, horizontal vs vertical scaling, Redis caching strategies, and CAP theorem.',
        topics: ['Rate Limiting', 'URL Shortener Architecture', 'Cache Eviction Policies', 'Database Indexing (B-Trees)'],
        estimatedHours: 16,
        completed: false,
        resources: [
          { title: 'System Design Primer', type: 'doc' },
          { title: 'ByteByteGo Scalability Patterns', type: 'video' },
        ],
      },
      {
        id: 'm-2-2',
        phaseId: 2,
        title: 'Operating Systems & Concurrency',
        description: 'Process vs thread synchronization, mutexes, deadlocks, and memory virtualization.',
        topics: ['Dining Philosophers Problem', 'Thread Pools', 'Virtual Memory & Demand Paging', 'TCP Handshake & Sockets'],
        estimatedHours: 12,
        completed: false,
        resources: [
          { title: 'OSTEP - Three Easy Pieces', type: 'doc' },
        ],
      },
    ],
  },
  {
    phaseNumber: 3,
    phaseName: 'Phase 3: High-Impact Projects & ATS Resume Polish',
    durationWeeks: 'Weeks 7 - 8',
    focus: 'Packaging Engineering Work with Quantifiable Impact Metrics',
    milestones: [
      {
        id: 'm-3-1',
        phaseId: 3,
        title: 'Full-Stack / ML Production Project Audit',
        description: 'Add automated testing, Docker containerization, CI/CD pipeline, and benchmark metrics to key projects.',
        topics: ['Docker Deployment', 'Lighthouse Optimization', 'Latency Benchmarking', 'API Documentation'],
        estimatedHours: 15,
        completed: false,
        resources: [
          { title: 'PlacementPilot Project Analyzer', type: 'practice' },
        ],
      },
      {
        id: 'm-3-2',
        phaseId: 3,
        title: 'ATS Resume Keyword Alignment',
        description: 'Eliminate filler language, adopt Google XYZ resume bullet formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
        topics: ['Action Verbs', 'Metric Quantification', 'Target Keyword Scanning'],
        estimatedHours: 8,
        completed: false,
        resources: [
          { title: 'PlacementPilot ATS Analyzer', type: 'practice' },
        ],
      },
    ],
  },
  {
    phaseNumber: 4,
    phaseName: 'Phase 4: AI Mock Interviews & Behavioral Mastery',
    durationWeeks: 'Weeks 9 - 10',
    focus: 'STAR Behavioral Framework, Live Coding Communication & HR Drills',
    milestones: [
      {
        id: 'm-4-1',
        phaseId: 4,
        title: 'Live Technical & Problem Explanation Rounds',
        description: 'Practice speaking thoughts aloud while writing code, discussing time/space trade-offs proactively.',
        topics: ['Think-Aloud Protocol', 'Edge Case Probing', 'Alternative Trade-offs'],
        estimatedHours: 10,
        completed: false,
        resources: [
          { title: 'PlacementPilot Mock AI Interviewer', type: 'practice' },
        ],
      },
      {
        id: 'm-4-2',
        phaseId: 4,
        title: 'HR Leadership & Situational Rounds',
        description: 'Refine 5 flagship career stories covering conflict, failure, tight deadlines, and initiative.',
        topics: ['Tell Me About Yourself', 'Handling Disagreements', 'Greatest Technical Challenge'],
        estimatedHours: 8,
        completed: false,
        resources: [
          { title: 'STAR Framework Cheat Sheet', type: 'doc' },
        ],
      },
    ],
  },
];

export const JOB_RECOMMENDATIONS: JobRecommendation[] = [
  {
    id: 'job-1',
    company: 'Razorpay',
    role: 'Software Development Engineer - Intern',
    location: 'Bengaluru / Hybrid',
    type: 'Internship',
    stipendOrSalary: '₹45,000 / month',
    targetRoleCategory: 'Software/IT',
    matchPercentage: 92,
    matchingSkills: ['Data Structures & Algorithms', 'JavaScript / TypeScript', 'REST APIs', 'Node.js', 'SQL'],
    missingSkills: ['Redis Caching', 'Kafka Basics'],
    whyItFits: 'Your solid score in Arrays, HashMaps, and API design matches 92% of Razorpay payment platform intern requisites.',
    deadline: 'In 5 days',
  },
  {
    id: 'job-2',
    company: 'Microsoft',
    role: 'Software Engineer - Campus Graduate',
    location: 'Hyderabad / Noida',
    type: 'Full-time',
    stipendOrSalary: '₹18 - 24 LPA',
    targetRoleCategory: 'Software/IT',
    matchPercentage: 86,
    matchingSkills: ['C++ / Java', 'OOP Design', 'Tree Traversals', 'Operating Systems', 'System Fundamentals'],
    missingSkills: ['Advanced Dynamic Programming', 'Distributed Transactions'],
    whyItFits: 'Your academic background in Computer Science and 78% placement readiness align closely with Microsoft Tier-1 screening thresholds.',
    deadline: 'In 12 days',
  },
  {
    id: 'job-3',
    company: 'Swiggy',
    role: 'Associate Machine Learning Engineer',
    location: 'Bengaluru',
    type: 'Full-time',
    stipendOrSalary: '₹15 - 19 LPA',
    targetRoleCategory: 'AI/ML',
    matchPercentage: 78,
    matchingSkills: ['Python', 'Pandas & NumPy', 'Model Evaluation (Precision/Recall)', 'SQL Queries'],
    missingSkills: ['PyTorch Deep Learning', 'Feature Store / Vector Databases'],
    whyItFits: 'Fits your target goal of applying algorithmic optimization and ML models to high-throughput logistics data.',
    deadline: 'In 18 days',
  },
  {
    id: 'job-4',
    company: 'CRED',
    role: 'Backend Engineering Intern',
    location: 'Bengaluru',
    type: 'Internship',
    stipendOrSalary: '₹60,000 / month',
    targetRoleCategory: 'Software/IT',
    matchPercentage: 89,
    matchingSkills: ['Clean Code Principles', 'Database Indexing', 'Concurrency', 'Algorithms'],
    missingSkills: ['Go (Golang)', 'gRPC Microservices'],
    whyItFits: 'High-bar engineering culture that heavily weighs pure problem solving and disciplined API design.',
    deadline: 'In 8 days',
  },
  {
    id: 'job-5',
    company: 'Fractal Analytics',
    role: 'Data Scientist - Trainee',
    location: 'Mumbai / Pune',
    type: 'Full-time',
    stipendOrSalary: '₹10 - 13 LPA',
    targetRoleCategory: 'Data Science',
    matchPercentage: 84,
    matchingSkills: ['Statistics & Probability', 'Python', 'Exploratory Data Analysis', 'A/B Testing'],
    missingSkills: ['Time Series Forecasting', 'Tableau / PowerBI'],
    whyItFits: 'Strong quantitative assessment aptitude scores qualify you directly for their fast-track interview rounds.',
    deadline: 'In 15 days',
  },
];

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-1',
    company: 'Razorpay',
    role: 'Software Engineering Intern',
    status: 'Technical Round',
    appliedDate: '2026-09-14',
    interviewDate: '2026-09-28',
    stipendOrSalary: '₹45,000/mo',
    notes: 'Completed online assessment (2/2 test cases passed). Next round is 45-min live coding with senior SDE on Trees & Hashing.',
    followUpReminder: '2026-09-27',
  },
  {
    id: 'app-2',
    company: 'Amazon',
    role: 'SDE-1 Campus Hiring',
    status: 'Screening',
    appliedDate: '2026-09-18',
    stipendOrSalary: '₹22 LPA',
    notes: 'Submitted resume via university placement portal. Waiting for online test link.',
    followUpReminder: '2026-10-02',
  },
  {
    id: 'app-3',
    company: 'Atlassian',
    role: 'Associate Software Engineer',
    status: 'Applied',
    appliedDate: '2026-09-21',
    stipendOrSalary: '₹25 LPA',
    notes: 'Tailored resume emphasizing clean Git collaboration and full-stack project.',
  },
  {
    id: 'app-4',
    company: 'Zomato',
    role: 'Backend Intern',
    status: 'Offered',
    appliedDate: '2026-08-25',
    interviewDate: '2026-09-08',
    stipendOrSalary: '₹50,000/mo',
    notes: 'Received official offer letter! Requires acceptance by October 5.',
  },
];
