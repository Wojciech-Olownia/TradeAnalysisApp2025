import { createClient } from "@supabase/supabase-js";

// Supabase configuration for TradeAnalysisApp
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
  category: string;
  description: string;
  tags: string[];
  is_favorite: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface EducationTopic {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
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

// Authentication operations
export const authOperations = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { user: data.user, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return user;
  },
};

// Prompt operations
export const promptOperations = {
  async getUserPrompts(userId: string): Promise<UserPrompt[]> {
    const { data, error } = await supabase
      .from("user_prompts")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching user prompts:", error);
      return [];
    }

    return data || [];
  },

  async savePrompt(
    prompt: Omit<UserPrompt, "id" | "created_at" | "updated_at">
  ): Promise<UserPrompt | null> {
    const { data, error } = await supabase
      .from("user_prompts")
      .insert([prompt])
      .select()
      .single();

    if (error) {
      console.error("Error saving prompt:", error);
      return null;
    }

    return data;
  },

  async updatePrompt(
    promptId: string,
    updates: Partial<UserPrompt>
  ): Promise<UserPrompt | null> {
    const { data, error } = await supabase
      .from("user_prompts")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", promptId)
      .select()
      .single();

    if (error) {
      console.error("Error updating prompt:", error);
      return null;
    }

    return data;
  },

  async deletePrompt(promptId: string): Promise<boolean> {
    const { error } = await supabase
      .from("user_prompts")
      .delete()
      .eq("id", promptId);

    if (error) {
      console.error("Error deleting prompt:", error);
      return false;
    }

    return true;
  },

  async incrementUsageCount(promptId: string): Promise<void> {
    const { error } = await supabase.rpc("increment_usage_count", {
      prompt_id: promptId,
    });

    if (error) {
      console.error("Error incrementing usage count:", error);
    }
  },
};

// Education topic operations
export const educationOperations = {
  async getUserTopics(userId: string): Promise<EducationTopic[]> {
    const { data, error } = await supabase
      .from("education_topics")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching education topics:", error);
      return [];
    }

    return data || [];
  },

  async saveTopic(
    topic: Omit<EducationTopic, "id" | "created_at" | "updated_at">
  ): Promise<EducationTopic | null> {
    const { data, error } = await supabase
      .from("education_topics")
      .insert([topic])
      .select()
      .single();

    if (error) {
      console.error("Error saving education topic:", error);
      return null;
    }

    return data;
  },

  async updateTopic(
    topicId: string,
    updates: Partial<EducationTopic>
  ): Promise<EducationTopic | null> {
    const { data, error } = await supabase
      .from("education_topics")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", topicId)
      .select()
      .single();

    if (error) {
      console.error("Error updating education topic:", error);
      return null;
    }

    return data;
  },

  async deleteTopic(topicId: string): Promise<boolean> {
    const { error } = await supabase
      .from("education_topics")
      .delete()
      .eq("id", topicId);

    if (error) {
      console.error("Error deleting education topic:", error);
      return false;
    }

    return true;
  },
};

// Prompt history operations
export const historyOperations = {
  async getPromptHistory(userId: string): Promise<PromptHistory[]> {
    const { data, error } = await supabase
      .from("prompt_history")
      .select(
        `
        *,
        user_prompts (
          title,
          category
        )
      `
      )
      .eq("user_id", userId)
      .order("executed_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching prompt history:", error);
      return [];
    }

    return data || [];
  },

  async addPromptToHistory(
    history: Omit<PromptHistory, "id" | "executed_at">
  ): Promise<PromptHistory | null> {
    const { data, error } = await supabase
      .from("prompt_history")
      .insert([{ ...history, executed_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) {
      console.error("Error adding prompt to history:", error);
      return null;
    }

    return data;
  },
};

// Database schema types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      user_prompts: {
        Row: UserPrompt;
        Insert: Omit<UserPrompt, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<UserPrompt, "id" | "created_at">>;
      };
      education_topics: {
        Row: EducationTopic;
        Insert: Omit<EducationTopic, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<EducationTopic, "id" | "created_at">>;
      };
      prompt_history: {
        Row: PromptHistory;
        Insert: Omit<PromptHistory, "id" | "executed_at">;
        Update: Partial<Omit<PromptHistory, "id">>;
      };
    };
    Functions: {
      increment_usage_count: {
        Args: { prompt_id: string };
        Returns: void;
      };
    };
  };
};
