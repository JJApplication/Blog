import { create } from 'zustand';

export interface Article {
  id: number;
  name: string;
  title: string;
  date: string;
  abstract: string;
  tags: string;
  lock: number;
}

interface BlogState {
  articles: Article[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchArticles: (page?: number) => Promise<void>;
}

export const useBlogStore = create<BlogState>((set) => ({
  articles: [],
  total: 0,
  isLoading: false,
  error: null,
  fetchArticles: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      // Proxy route configured in next.config.js will handle this request
      const res = await fetch(`/api/article/posts?p=${page}`);
      if (!res.ok) {
        throw new Error('Failed to fetch articles');
      }
      const json = await res.json();
      
      if (json.code === 233200) {
        set({ articles: json.data || [], total: json.len || 0, isLoading: false });
      } else {
        throw new Error(json.msg || 'Error fetching data');
      }
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isLoading: false });
      } else {
        set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },
}));
