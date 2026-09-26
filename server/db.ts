import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  AssessmentResult,
  SkillGap,
  DailyTask,
  RoadmapPhase,
  JobRecommendation,
  ApplicationRecord,
  InterviewSession,
  ResumeAnalysis,
  ProjectAnalysis,
} from '../src/types';
import {
  DEMO_USER,
  INITIAL_SKILL_GAPS,
  INITIAL_ASSESSMENT,
  INITIAL_DAILY_TASKS,
  INITIAL_ROADMAP,
  JOB_RECOMMENDATIONS,
  INITIAL_APPLICATIONS,
} from '../src/data/seedData';

export interface AppDatabase {
  user: UserProfile;
  skillGaps: SkillGap[];
  assessments: AssessmentResult[];
  dailyTasks: DailyTask[];
  roadmap: RoadmapPhase[];
  jobs: JobRecommendation[];
  applications: ApplicationRecord[];
  interviewSessions: InterviewSession[];
  resumeAnalyses: ResumeAnalysis[];
  projectAnalyses: ProjectAnalysis[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function getDefaultDb(): AppDatabase {
  return {
    user: { ...DEMO_USER },
    skillGaps: [...INITIAL_SKILL_GAPS],
    assessments: [{ ...INITIAL_ASSESSMENT }],
    dailyTasks: [...INITIAL_DAILY_TASKS],
    roadmap: [...INITIAL_ROADMAP],
    jobs: [...JOB_RECOMMENDATIONS],
    applications: [...INITIAL_APPLICATIONS],
    interviewSessions: [
      {
        id: 'session-demo-1',
        track: 'Technical',
        targetRole: 'Software/IT',
        status: 'completed',
        date: '2026-09-22',
        overallScore: 8,
        summaryFeedback: 'Good understanding of two pointers and hash maps. Strengthen explanations of edge cases and space complexity trade-offs.',
        messages: [
          {
            id: 'm-1',
            sender: 'ai',
            text: 'Hello Aarav! Welcome to your technical mock interview. Let’s start with a core concept: How would you explain the internal mechanism of a Hash Map, and how are collisions handled in modern language runtimes?',
            timestamp: '10:00 AM',
          },
          {
            id: 'm-2',
            sender: 'user',
            text: 'A Hash Map uses a hash function to map keys to bucket indices in an underlying array. When collisions occur—where different keys produce the same index—we commonly use separate chaining with linked lists or balanced trees (like Red-Black trees in Java 8+ when buckets exceed 8 nodes) or open addressing with linear/quadratic probing.',
            timestamp: '10:02 AM',
            feedback: {
              score: 9,
              strengths: [
                'Accurately highlighted both Separate Chaining and Open Addressing.',
                'Specific mention of Java 8 treeification threshold (>8 nodes) shows deep framework maturity.',
              ],
              improvements: [
                'Could briefly mention average vs worst-case load factor and rehashing cost O(n).',
              ],
              modelAnswer: 'A Hash Map converts keys into hash codes, modded by bucket array length. Collisions are resolved either via Separate Chaining (buckets hold linked lists or self-balancing BSTs when count > threshold) or Open Addressing (probing). As the load factor exceeds 0.75, rehashing doubles array capacity in O(n) amortized time.',
            },
          },
        ],
      },
    ],
    resumeAnalyses: [],
    projectAnalyses: [],
  };
}

export function initDb(): AppDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getDefaultDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed;
  } catch (err) {
    console.error('Failed to read or init database file, using in-memory default:', err);
    return getDefaultDb();
  }
}

let dbInstance: AppDatabase = initDb();

export function getDb(): AppDatabase {
  return dbInstance;
}

export function saveDb(updated?: Partial<AppDatabase>): AppDatabase {
  if (updated) {
    dbInstance = { ...dbInstance, ...updated };
  }
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbInstance, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database.json:', err);
  }
  return dbInstance;
}

export function resetToDemo(): AppDatabase {
  dbInstance = getDefaultDb();
  saveDb();
  return dbInstance;
}
