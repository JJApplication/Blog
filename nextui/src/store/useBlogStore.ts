import { create } from 'zustand';
import { apiFetch } from '@/lib/api';

export interface Article {
  id: number;
  name: string;
  title: string;
  date: string;
  abstract: string;
  tags: string;
  lock: number;
}

export interface Tag {
  tag: string;
}

export interface Zhuanlan {
  link: string;
  title: string;
  date: string;
  posts: string[];
  content: string;
}

export interface Archive {
  date: string;
  count: number;
}

export interface Message {
  primary_id: number;
  user: string;
  date: string;
  message: string;
}

interface BlogState {
  articles: Article[];
  searchResults: Article[];
  tags: Tag[];
  zhuanlans: Zhuanlan[];
  archives: Archive[];
  messages: Message[];
  stats: {
    views: number | null;
    routines: number | null;
  };
  total: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  setPageSize: (size: number) => void;
  fetchArticles: (page?: number, limit?: number) => Promise<void>;
  searchArticles: (key: string) => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchZhuanlans: () => Promise<void>;
  fetchArchives: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  postMessage: (message: string) => Promise<boolean>;
  fetchStats: () => Promise<void>;
}

export const useBlogStore = create<BlogState>((set) => ({
  articles: [],
  searchResults: [],
  tags: [],
  zhuanlans: [],
  archives: [],
  messages: [],
  stats: { views: null, routines: null },
  total: 0,
  pageSize: 10,
  isLoading: false,
  error: null,
  setPageSize: (size: number) => set({ pageSize: size }),
  fetchArticles: async (page = 1, limit) => {
    const currentLimit = limit || useBlogStore.getState().pageSize;
    set({ isLoading: true, error: null });
    try {
      // Proxy route configured in next.config.js will handle this request
      const res = await apiFetch(`/api/article/posts?p=${page}&limit=${currentLimit}`);
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
  searchArticles: async (key: string) => {
    if (!key.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch(`/api/article/search?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error('Failed to search articles');
      const json = await res.json();
      set({ searchResults: Array.isArray(json) ? json : [], isLoading: false });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isLoading: false });
      } else {
        set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },
  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch(`/api/article/tags`);
      if (!res.ok) throw new Error('Failed to fetch tags');
      const json = await res.json();
      if (json.code === 233200) {
        set({ tags: json.data || [], isLoading: false });
      } else {
        throw new Error(json.msg || 'Error fetching tags');
      }
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isLoading: false });
      } else {
        set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },
  fetchZhuanlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch(`/api/zhuanlan`);
      if (!res.ok) throw new Error('Failed to fetch zhuanlan');
      const json = await res.json();
      // The API doesn't seem to return a code for zhuanlan, just data and msg
      set({ zhuanlans: json.data || [], isLoading: false });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isLoading: false });
      } else {
        set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },
  fetchArchives: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch(`/api/article/archive`);
      if (!res.ok) throw new Error('Failed to fetch archives');
      const json = await res.json();
      set({ archives: json.data || [], isLoading: false });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isLoading: false });
      } else {
        set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },
  fetchMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch(`/api/message`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const json = await res.json();
      set({ messages: Array.isArray(json) ? json : [], isLoading: false });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message, isLoading: false });
      } else {
        set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },
  postMessage: async (message: string) => {
    try {
      const res = await apiFetch(`/api/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error('Failed to post message');
      // Re-fetch messages after successful post
      useBlogStore.getState().fetchMessages();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      }
      return false;
    }
  },
  fetchStats: async () => {
    try {
      const [viewsRes, routinesRes] = await Promise.all([
        apiFetch('/api/statistic/views'),
        apiFetch('/api/statistic/routines')
      ]);
      
      let views = null;
      let routines = null;

      if (viewsRes.ok) {
        const text = await viewsRes.text();
        views = parseInt(text, 10);
      }
      if (routinesRes.ok) {
        const text = await routinesRes.text();
        routines = parseInt(text, 10);
      }

      set({ stats: { views, routines } });
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  }
}));
