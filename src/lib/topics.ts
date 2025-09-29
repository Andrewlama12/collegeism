import NewsAPI from 'newsapi';
import { store } from './store';

const newsapi = new NewsAPI(process.env.NEWS_API_KEY || '');

// Categories that are likely to generate good debate topics
const DEBATE_CATEGORIES = [
  'education',
  'technology',
  'science',
  'politics',
  'business',
  'health',
  'environment'
];

export type TrendingTopic = {
  title: string;
  category: string;
  relevance: number;  // 0-1 score based on frequency and recency
  sources: number;    // number of sources mentioning this topic
};

export async function getTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    // Fetch news from multiple categories
    const topicPromises = DEBATE_CATEGORIES.map(async (category) => {
      const response = await newsapi.v2.topHeadlines({
        category,
        language: 'en',
        country: 'us',
        pageSize: 10
      });
      
      return response.articles.map(article => ({
        title: article.title,
        category,
        url: article.url,
        publishedAt: article.publishedAt
      }));
    });

    const allArticles = (await Promise.all(topicPromises)).flat();
    
    // Group similar topics and calculate relevance
    const topicGroups = new Map<string, {
      category: string,
      count: number,
      dates: Date[],
      urls: Set<string>
    }>();

    for (const article of allArticles) {
      if (!article.title) continue;
      
      // Clean and normalize the title
      const cleanTitle = article.title
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .toLowerCase();
      
      const existing = topicGroups.get(cleanTitle);
      if (existing) {
        existing.count++;
        existing.dates.push(new Date(article.publishedAt));
        existing.urls.add(article.url);
      } else {
        topicGroups.set(cleanTitle, {
          category: article.category,
          count: 1,
          dates: [new Date(article.publishedAt)],
          urls: new Set([article.url])
        });
      }
    }

    // Convert to trending topics
    const topics: TrendingTopic[] = [];
    for (const [title, data] of topicGroups.entries()) {
      // Calculate relevance based on frequency and recency
      const maxAge = Math.max(
        ...data.dates.map(d => Date.now() - d.getTime())
      );
      const recency = Math.exp(-maxAge / (24 * 60 * 60 * 1000)); // Decay over 24 hours
      const frequency = data.count / allArticles.length;
      
      topics.push({
        title,
        category: data.category,
        relevance: (recency + frequency) / 2,
        sources: data.urls.size
      });
    }

    // Sort by relevance and return top topics
    return topics
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return [];
  }
}

// Check if a topic has been recently used
export async function isTopicRecent(topic: string, daysThreshold = 7): Promise<boolean> {
  const statements = store.getStatements();
  const recentStatement = statements.find(s => {
    const isRecent = new Date(s.createdAt).getTime() > Date.now() - daysThreshold * 24 * 60 * 60 * 1000;
    const containsTopic = s.text.toLowerCase().includes(topic.toLowerCase());
    return isRecent && containsTopic;
  });
  
  return !!recentStatement;
}
