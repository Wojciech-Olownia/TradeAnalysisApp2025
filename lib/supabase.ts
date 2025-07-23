import { createClient } from "@supabase/supabase-js";

// Mock Supabase configuration for TradeAnalysisApp - replace with real values when setting up Supabase
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript interfaces for TradeAnalysisApp
export interface UserPrompt {
  id: string;
  user_id: string;
  title: string;
  prompt_text: string;
  instrument: string;
  created_at: string;
  updated_at: string;
  usage_count: number;
  is_favorite: boolean;
  category: string;
  tags: string[];
}

export interface PromptHistory {
  id: string;
  user_id: string;
  prompt_id: string;
  instrument_used: string;
  executed_at: string;
  result_summary?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Mock authentication functions
export const mockAuthOperations = {
  async signUp(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: any }> {
    // Mock implementation - replace with real Supabase auth
    if (email && password) {
      const mockUser: User = {
        id: Math.random().toString(36),
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { user: mockUser, error: null };
    }
    return { user: null, error: { message: "Invalid credentials" } };
  },

  async signIn(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: any }> {
    // Mock implementation - replace with real Supabase auth
    if (email && password) {
      const mockUser: User = {
        id: "demo-user-123",
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { user: mockUser, error: null };
    }
    return { user: null, error: { message: "Invalid credentials" } };
  },

  async signOut(): Promise<{ error: any }> {
    // Mock implementation
    return { error: null };
  },

  async getCurrentUser(): Promise<User | null> {
    // Mock implementation - return demo user
    return {
      id: "demo-user-123",
      email: "demo@tradeanalysis.com",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },
};

// Mock functions for database operations
export const mockPromptOperations = {
  async getUserPrompts(userId: string): Promise<UserPrompt[]> {
    // Mock implementation - replace with real Supabase queries
    return [];
  },

  async savePrompt(
    prompt: Omit<UserPrompt, "id" | "created_at" | "updated_at">
  ): Promise<UserPrompt> {
    // Mock implementation
    return {
      ...prompt,
      id: Math.random().toString(36),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async updatePrompt(
    promptId: string,
    updates: Partial<UserPrompt>
  ): Promise<UserPrompt | null> {
    // Mock implementation
    return null;
  },

  async deletePrompt(promptId: string): Promise<boolean> {
    // Mock implementation
    return true;
  },

  async getPromptHistory(userId: string): Promise<PromptHistory[]> {
    // Mock implementation
    return [];
  },

  async addPromptToHistory(
    history: Omit<PromptHistory, "id" | "executed_at">
  ): Promise<PromptHistory> {
    // Mock implementation
    return {
      ...history,
      id: Math.random().toString(36),
      executed_at: new Date().toISOString(),
    };
  },
};
