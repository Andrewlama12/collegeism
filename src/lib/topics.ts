import { store } from './store';

// Categories for organizing topics
export const CATEGORIES = {
  EDUCATION: 'education',
  TECHNOLOGY: 'technology',
  SOCIETY: 'society',
  ECONOMICS: 'economics',
  ENVIRONMENT: 'environment',
  POLITICS: 'politics',
  HEALTH: 'health'
} as const;

// Predefined debate topics
export const DEBATE_TOPICS = [
  {
    text: "Universal basic income should be implemented in all developed countries",
    category: CATEGORIES.ECONOMICS
  },
  {
    text: "Nuclear energy is essential for combating climate change",
    category: CATEGORIES.ENVIRONMENT
  },
  {
    text: "Social media companies should be held legally responsible for misinformation",
    category: CATEGORIES.TECHNOLOGY
  },
  {
    text: "The voting age should be lowered to 16 in national elections",
    category: CATEGORIES.POLITICS
  },
  {
    text: "Artificial intelligence development should be regulated by international law",
    category: CATEGORIES.TECHNOLOGY
  },
  {
    text: "Remote work should be a legal right for all compatible jobs",
    category: CATEGORIES.SOCIETY
  },
  {
    text: "College education should be free for all students",
    category: CATEGORIES.EDUCATION
  },
  {
    text: "Cryptocurrencies pose more risks than benefits to the global economy",
    category: CATEGORIES.ECONOMICS
  }
];

// Check if a topic has been recently used
export async function isTopicRecent(topic: string, daysThreshold = 7): Promise<boolean> {
  const statements = store.getStatements();
  const recentStatement = (await statements).find((s: { createdAt: string; text: string }) => {
    const isRecent = new Date(s.createdAt).getTime() > Date.now() - daysThreshold * 24 * 60 * 60 * 1000;
    const containsTopic = s.text.toLowerCase().includes(topic.toLowerCase());
    return isRecent && containsTopic;
  });
  
  return !!recentStatement;
}
