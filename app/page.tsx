"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "../providers/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Copy, Edit, Plus, X } from "lucide-react";
import { toast } from "sonner";

const CURRENCY_PAIRS = [
  "USD/CHF",
  "USD/JPY",
  "USD/PLN",
  "USD/CAD",
  "USD/SGD",
  "USD/NOK",
  "EUR/CHF",
  "EUR/JPY",
  "EUR/NZD",
  "EUR/CAD",
  "EUR/PLN",
  "EUR/GBP",
  "EUR/USD",
  "EUR/AUD",
  "GBP/USD",
  "GBP/CAD",
  "GBP/CHF",
  "GBP/AUD",
  "GBP/JPY",
  "AUD/USD",
  "AUD/NZD",
  "AUD/JPY",
  "NZD/USD",
  "NZD/CHF",
  "NZD/JPY",
  "CAD/CHF",
  "CHF/PLN",
  "XAU/USD",
  "DE40",
  "US2000",
  "US500",
  "US100",
  "W20",
];

interface Prompt {
  id: number;
  title: string;
  category: string;
  description: string;
  isFavorite: boolean;
  tags: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

const INITIAL_PROMPTS: Prompt[] = [
  {
    id: 1,
    title: "Trend Analysis",
    category: "Trend Analysis",
    description:
      "Analyze the trend of [INSTRUMENT] and determine if it is trending upwards, downwards, or consolidating. Consider various factors such as price action, moving averages, and other technical indicators to assess the trend. # Steps 1. **Analyze Price Action:** Examine the recent price movements of [INSTRUMENT]. Look for patterns such as higher highs and higher lows (uptrend), lower highs and lower lows (downtrend), or sideways movement (consolidation). 2. **Evaluate Moving Averages:** Use moving averages (e.g., 50-day, 200-day) to identify the trend. * If the price is consistently above the moving average, it suggests an uptrend. * If the price is consistently below the moving average, it suggests a downtrend. * If the price is fluctuating around the moving average, it indicates consolidation. 3. **Consider Other Technical Indicators:** Use additional indicators such as the Relative Strength Index (RSI) or Moving Average Convergence Divergence (MACD) to confirm the trend. * RSI values above 70 may indicate overbought conditions (potential downtrend or consolidation). * RSI values below 30 may indicate oversold conditions (potential uptrend or consolidation). * MACD crossovers can signal potential trend changes. 4. **Determine the Trend:** Based on the analysis of price action, moving averages, and technical indicators, determine whether the [INSTRUMENT] is in an uptrend, downtrend, or consolidation phase. # Output Format A single sentence in Polish stating whether the [INSTRUMENT] is in an uptrend, downtrend, or consolidation phase. # Examples N/A (The model should perform a real-time analysis to determine the current trend.) # Notes The model should access real-time or near real-time market data to provide an accurate assessment of the current trend. The response should be concise and directly answer the question. # Notes The response should be in Polish.",
    isFavorite: true,
    tags: ["Trend Analysis"],
    usageCount: 15,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: 2,
    title: "Support and Resistance Levels",
    category: "Support and Resistance Levels",
    description:
      "Analyze a given [INSTRUMENT] to identify and explain the strongest support and resistance levels. Consider historical price data, trading volume, and significant price movements to determine key support and resistance levels for the specified [INSTRUMENT]. Explain the reasoning behind each identified level. # Steps 1. **Data Analysis:** Analyze historical price charts for the [INSTRUMENT], focusing on identifying areas where the price has consistently reversed direction. 2. **Volume Consideration:** Examine trading volume at potential support and resistance levels. Higher volume confirms the strength of these levels. 3. **Identification of Support Levels:** Identify price levels where the [INSTRUMENT] has consistently found buying support, preventing further price declines. 4. **Identification of Resistance Levels:** Identify price levels where the [INSTRUMENT] has consistently faced selling pressure, preventing further price increases.5. **Reasoning:** Provide clear explanations for why each identified level is considered strong support or resistance, referencing historical price action and volume. 6. **Output:** Provide the support and resistance levels with explanations. # Output Format The output should be a concise paragraph in Polish, identifying key support and resistance levels for the [INSTRUMENT], along with a brief explanation of why these levels are significant. # Examples **Example 1:** **Input:** 'WHERE ARE THE STRONGEST SUPPORT AND RESISTANCE LEVELS FOR THE [INSTRUMENT]?' **Output:** 'Silne wsparcie dla [INSTRUMENT] znajduje się w okolicach [support level], gdzie historycznie obserwowano zwiększony popyt. Opór występuje w pobliżu [resistance level], co wynika z wcześniejszych reakcji cenowych i zwiększonej presji sprzedaży w tym obszarze.' (Note: Real examples would include specific price levels like '0.9000' or '0.9150' in place of the bracketed placeholders.)' The response should be in Polish.",
    isFavorite: false,
    tags: ["Support and Resistance Levels"],
    usageCount: 8,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: 3,
    title: "Strongs Lows",
    category: "Strongs Lows",
    description:
      "Find the four most recent 'strong lows' for [INSTRUMENT]. You will need to analyze [INSTRUMENT] data to identify these points. # Steps 1. **Define 'strong lows':** Establish a clear, consistent definition of what constitutes a 'strong low.' This may involve factors like: * Significant price decrease followed by a substantial price increase. * Volume during the low.* Confirmation by technical indicators. 2. **Data Analysis:** Analyze [INSTRUMENT] historical price data. 3. **Identification:** Identify potential 'strong low' candidates based on your definition. 4. **Verification:** Verify that each candidate meets all criteria for a 'strong low.' 5. **Selection:** Select the four most recent verified 'strong lows.' # Output Format List the four most recent 'strong lows' for [INSTRUMENT], including the date and price for each. Output as a numbered list. 1. [Data: YYYY-MM-DD], [Cena: X.XXXX] 2. [Data: YYYY-MM-DD], [Cena: X.XXXX] 3. [Data: YYYY-MM-DD], [Cena: X.XXXX] 4. [Data: YYYY-MM-DD], [Cena: X.XXXX] # Notes * The definition of 'strong low' is critical. Ensure it is precise and consistently applied. * Specify the data source used for analysis. * Consider providing a brief explanation of why each identified low qualifies as a 'strong low' based on your criteria. (This can be added as an extra field in the output) * This prompt relies on your ability to interpret financial data and apply technical analysis techniques. * The level of precision needed for the date and price. The response should be in Polish. ",
    isFavorite: true,
    tags: ["Strongs Lows"],
    usageCount: 12,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
  },
  {
    id: 4,
    title: "Strong Highs",
    category: "Strong Highs",
    description:
      "Find the four most recent 'strong highs' for [INSTRUMENT]. You will need to analyze [INSTRUMENT] data to identify these points. # Steps 1. **Define 'strong highs' :** Establish a clear, consistent definition of what constitutes a 'strong highs.' This may involve factors like: * Significant price decrease followed by a substantial price increase. * Volume during the low. * Confirmation by technical indicators. 2. **Data Analysis:** Analyze [INSTRUMENT] historical price data. 3. **Identification:** Identify potential 'strong highs' candidates based on your definition. 4. **Verification:** Verify that each candidate meets all criteria for a 'strong highs.' 5. **Selection:** Select the four most recent verified 'strong highs.' # Output Format List the four most recent 'strong highs' for [INSTRUMENT], including the date and price for each. Output as a numbered list. 1. [Data: YYYY-MM-DD], [Cena: X.XXXX] 2. [Data: YYYY-MM-DD], [Cena: X.XXXX] 3. [Data: YYYY-MM-DD], [Cena: X.XXXX] 4. [Data: YYYY-MM-DD], [Cena: X.XXXX] # Notes * The definition of 'strong highs' is critical. Ensure it is precise and consistently applied. * Specify the data source used for analysis. * Consider providing a brief explanation of why each identified low qualifies as a 'strong highs' based on your criteria. (This can be added as an extra field in the output) * This prompt relies on your ability to interpret financial data and apply technical analysis techniques. * The level of precision needed for the date and price. The response should be in Polish.",
    isFavorite: false,
    tags: ["Strong Highs"],
    usageCount: 6,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
  },
];

const SUGGESTED_PROMPTS: Prompt[] = [
  {
    id: 5,
    title: "Trend Analysis",
    category: "Trend Analysis",
    description:
      "Analyze the trend of [INSTRUMENT] and determine if it is trending upwards, downwards, or consolidating. Consider various factors such as price action, moving averages, and other technical indicators to assess the trend. # Steps 1. **Analyze Price Action:** Examine the recent price movements of [INSTRUMENT]. Look for patterns such as higher highs and higher lows (uptrend), lower highs and lower lows (downtrend), or sideways movement (consolidation). 2. **Evaluate Moving Averages:** Use moving averages (e.g., 50-day, 200-day) to identify the trend. * If the price is consistently above the moving average, it suggests an uptrend. * If the price is consistently below the moving average, it suggests a downtrend. * If the price is fluctuating around the moving average, it indicates consolidation. 3. **Consider Other Technical Indicators:** Use additional indicators such as the Relative Strength Index (RSI) or Moving Average Convergence Divergence (MACD) to confirm the trend. * RSI values above 70 may indicate overbought conditions (potential downtrend or consolidation). * RSI values below 30 may indicate oversold conditions (potential uptrend or consolidation). * MACD crossovers can signal potential trend changes. 4. **Determine the Trend:** Based on the analysis of price action, moving averages, and technical indicators, determine whether the [INSTRUMENT] is in an uptrend, downtrend, or consolidation phase. # Output Format A single sentence in Polish stating whether the [INSTRUMENT] is in an uptrend, downtrend, or consolidation phase. # Examples N/A (The model should perform a real-time analysis to determine the current trend.) # Notes The model should access real-time or near real-time market data to provide an accurate assessment of the current trend. The response should be concise and directly answer the question. # Notes The response should be in Polish.",
    isFavorite: true,
    tags: ["Trend Analysis"],
    usageCount: 15,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: 6,
    title: "Support and Resistance Levels",
    category: "Support and Resistance Levels",
    description:
      "Analyze a given [INSTRUMENT] to identify and explain the strongest support and resistance levels. Consider historical price data, trading volume, and significant price movements to determine key support and resistance levels for the specified [INSTRUMENT]. Explain the reasoning behind each identified level. # Steps 1. **Data Analysis:** Analyze historical price charts for the [INSTRUMENT], focusing on identifying areas where the price has consistently reversed direction. 2. **Volume Consideration:** Examine trading volume at potential support and resistance levels. Higher volume confirms the strength of these levels. 3. **Identification of Support Levels:** Identify price levels where the [INSTRUMENT] has consistently found buying support, preventing further price declines. 4. **Identification of Resistance Levels:** Identify price levels where the [INSTRUMENT] has consistently faced selling pressure, preventing further price increases.5. **Reasoning:** Provide clear explanations for why each identified level is considered strong support or resistance, referencing historical price action and volume. 6. **Output:** Provide the support and resistance levels with explanations. # Output Format The output should be a concise paragraph in Polish, identifying key support and resistance levels for the [INSTRUMENT], along with a brief explanation of why these levels are significant. # Examples **Example 1:** **Input:** 'WHERE ARE THE STRONGEST SUPPORT AND RESISTANCE LEVELS FOR THE [INSTRUMENT]?' **Output:** 'Silne wsparcie dla [INSTRUMENT] znajduje się w okolicach [support level], gdzie historycznie obserwowano zwiększony popyt. Opór występuje w pobliżu [resistance level], co wynika z wcześniejszych reakcji cenowych i zwiększonej presji sprzedaży w tym obszarze.' (Note: Real examples would include specific price levels like '0.9000' or '0.9150' in place of the bracketed placeholders.)' The response should be in Polish.",
    isFavorite: false,
    tags: ["Support and Resistance Levels"],
    usageCount: 8,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: 7,
    title: "Strongs Lows",
    category: "Strongs Lows",
    description:
      "Find the four most recent 'strong lows' for [INSTRUMENT]. You will need to analyze [INSTRUMENT] data to identify these points. # Steps 1. **Define 'strong lows':** Establish a clear, consistent definition of what constitutes a 'strong low.' This may involve factors like: * Significant price decrease followed by a substantial price increase. * Volume during the low.* Confirmation by technical indicators. 2. **Data Analysis:** Analyze [INSTRUMENT] historical price data. 3. **Identification:** Identify potential 'strong low' candidates based on your definition. 4. **Verification:** Verify that each candidate meets all criteria for a 'strong low.' 5. **Selection:** Select the four most recent verified 'strong lows.' # Output Format List the four most recent 'strong lows' for [INSTRUMENT], including the date and price for each. Output as a numbered list. 1. [Data: YYYY-MM-DD], [Cena: X.XXXX] 2. [Data: YYYY-MM-DD], [Cena: X.XXXX] 3. [Data: YYYY-MM-DD], [Cena: X.XXXX] 4. [Data: YYYY-MM-DD], [Cena: X.XXXX] # Notes * The definition of 'strong low' is critical. Ensure it is precise and consistently applied. * Specify the data source used for analysis. * Consider providing a brief explanation of why each identified low qualifies as a 'strong low' based on your criteria. (This can be added as an extra field in the output) * This prompt relies on your ability to interpret financial data and apply technical analysis techniques. * The level of precision needed for the date and price. The response should be in Polish. ",
    isFavorite: true,
    tags: ["Strongs Lows"],
    usageCount: 12,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
  },
  {
    id: 8,
    title: "Strong Highs",
    category: "Strong Highs",
    description:
      "Find the four most recent 'strong highs' for [INSTRUMENT]. You will need to analyze [INSTRUMENT] data to identify these points. # Steps 1. **Define 'strong highs' :** Establish a clear, consistent definition of what constitutes a 'strong highs.' This may involve factors like: * Significant price decrease followed by a substantial price increase. * Volume during the low. * Confirmation by technical indicators. 2. **Data Analysis:** Analyze [INSTRUMENT] historical price data. 3. **Identification:** Identify potential 'strong highs' candidates based on your definition. 4. **Verification:** Verify that each candidate meets all criteria for a 'strong highs.' 5. **Selection:** Select the four most recent verified 'strong highs.' # Output Format List the four most recent 'strong highs' for [INSTRUMENT], including the date and price for each. Output as a numbered list. 1. [Data: YYYY-MM-DD], [Cena: X.XXXX] 2. [Data: YYYY-MM-DD], [Cena: X.XXXX] 3. [Data: YYYY-MM-DD], [Cena: X.XXXX] 4. [Data: YYYY-MM-DD], [Cena: X.XXXX] # Notes * The definition of 'strong highs' is critical. Ensure it is precise and consistently applied. * Specify the data source used for analysis. * Consider providing a brief explanation of why each identified low qualifies as a 'strong highs' based on your criteria. (This can be added as an extra field in the output) * This prompt relies on your ability to interpret financial data and apply technical analysis techniques. * The level of precision needed for the date and price. The response should be in Polish.",
    isFavorite: false,
    tags: ["Strong Highs"],
    usageCount: 6,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
  },
];

const EDUCATION_CONTENT = [
  {
    id: "forex-basics",
    title: "Forex Market Basics",
    content: `
      <h3>Understanding Currency Pairs</h3>
      <p>Currency pairs are the foundation of forex trading. Each pair consists of a base currency and a quote currency.</p>
      
      <h4>Major Currency Pairs:</h4>
      <ul>
        <li><strong>EUR/USD</strong> - Euro vs US Dollar (Most traded pair)</li>
        <li><strong>GBP/USD</strong> - British Pound vs US Dollar</li>
        <li><strong>USD/JPY</strong> - US Dollar vs Japanese Yen</li>
        <li><strong>AUD/USD</strong> - Australian Dollar vs US Dollar</li>
      </ul>
      
      <h4>Market Sessions:</h4>
      <ul>
        <li><strong>Asian Session</strong> - 12:00 AM - 9:00 AM GMT</li>
        <li><strong>European Session</strong> - 8:00 AM - 5:00 PM GMT</li>
        <li><strong>American Session</strong> - 1:00 PM - 10:00 PM GMT</li>
      </ul>
    `,
  },
  {
    id: "technical-analysis",
    title: "Technical Analysis",
    content: `
      <h3>Key Technical Indicators</h3>
      
      <h4>Trend Indicators:</h4>
      <ul>
        <li><strong>Moving Averages</strong> - Simple (SMA) and Exponential (EMA)</li>
        <li><strong>MACD</strong> - Moving Average Convergence Divergence</li>
        <li><strong>ADX</strong> - Average Directional Index</li>
      </ul>
      
      <h4>Momentum Indicators:</h4>
      <ul>
        <li><strong>RSI</strong> - Relative Strength Index (14-period)</li>
        <li><strong>Stochastic</strong> - %K and %D oscillator</li>
        <li><strong>Williams %R</strong> - Momentum oscillator</li>
      </ul>
      
      <h4>Support and Resistance:</h4>
      <p>Key levels where price tends to reverse or consolidate. These can be:</p>
      <ul>
        <li>Previous highs and lows</li>
        <li>Fibonacci retracement levels</li>
        <li>Psychological round numbers</li>
        <li>Moving average levels</li>
      </ul>
    `,
  },
  {
    id: "risk-management",
    title: "Risk Management",
    content: `
      <h3>Essential Risk Management Rules</h3>
      
      <h4>Position Sizing:</h4>
      <ul>
        <li><strong>1% Rule</strong> - Never risk more than 1% of account per trade</li>
        <li><strong>2% Rule</strong> - Maximum 2% for experienced traders</li>
        <li><strong>Kelly Criterion</strong> - Mathematical approach to position sizing</li>
      </ul>
      
      <h4>Stop Loss Strategies:</h4>
      <ul>
        <li><strong>Technical Stops</strong> - Based on support/resistance levels</li>
        <li><strong>Percentage Stops</strong> - Fixed percentage from entry</li>
        <li><strong>ATR Stops</strong> - Based on Average True Range</li>
        <li><strong>Time Stops</strong> - Exit after specific time period</li>
      </ul>
      
      <h4>Risk-Reward Ratios:</h4>
      <ul>
        <li><strong>1:2 Minimum</strong> - Risk $1 to make $2</li>
        <li><strong>1:3 Preferred</strong> - Higher probability of long-term success</li>
        <li><strong>Win Rate vs RR</strong> - Balance between accuracy and reward</li>
      </ul>
    `,
  },
];

export default function Home() {
  const [selectedInstrument, setSelectedInstrument] =
    useState<string>("EUR/USD");
  const [activeCategory, setActiveCategory] = useState<string>("my-prompts");
  const [prompts, setPrompts] = useState<Prompt[]>(INITIAL_PROMPTS);
  const [suggestedPrompts] = useState<Prompt[]>(SUGGESTED_PROMPTS);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isNewPromptOpen, setIsNewPromptOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEducationTopic, setSelectedEducationTopic] =
    useState("forex-basics");
  const [educationTopics, setEducationTopics] = useState(EDUCATION_CONTENT);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    id: "",
    title: "",
    content: "",
  });

  // New prompt form state
  const [newPrompt, setNewPrompt] = useState({
    title: "",
    category: "",
    description: "",
    tags: "",
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem("marketai-prompts");
    if (savedPrompts) {
      setPrompts(JSON.parse(savedPrompts));
    }
    const savedTopics = localStorage.getItem("marketai-education-topics");
    if (savedTopics) {
      setEducationTopics(JSON.parse(savedTopics));
    }
  }, []);

  // Save prompts to localStorage whenever prompts change
  useEffect(() => {
    localStorage.setItem("marketai-prompts", JSON.stringify(prompts));
  }, [prompts]);

  // Save education topics to localStorage whenever topics change
  useEffect(() => {
    localStorage.setItem(
      "marketai-education-topics",
      JSON.stringify(educationTopics)
    );
  }, [educationTopics]);

  const handleCopyPrompt = (prompt: Prompt) => {
    const customizedPrompt = prompt.description.replace(
      /\[INSTRUMENT\]/g,
      selectedInstrument
    );
    navigator.clipboard.writeText(customizedPrompt);

    // Update usage count
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === prompt.id
          ? {
              ...p,
              usageCount: p.usageCount + 1,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : p
      )
    );

    toast.success(`Prompt copied for ${selectedInstrument}!`);
  };

  const toggleFavorite = (promptId: number) => {
    // Check if it's a suggested prompt
    const suggestedPrompt = suggestedPrompts.find((p) => p.id === promptId);
    if (suggestedPrompt) {
      // For suggested prompts, we need to add them to user prompts first
      const existingPrompt = prompts.find(
        (p) => p.title === suggestedPrompt.title
      );
      if (existingPrompt) {
        // If already exists in user prompts, just toggle favorite
        setPrompts((prev) =>
          prev.map((prompt) =>
            prompt.id === existingPrompt.id
              ? {
                  ...prompt,
                  isFavorite: !prompt.isFavorite,
                  updatedAt: new Date().toISOString().split("T")[0],
                }
              : prompt
          )
        );
      } else {
        // Add to user prompts as favorite
        const newId = Math.max(...prompts.map((p) => p.id), 0) + 1;
        const newPrompt = {
          ...suggestedPrompt,
          id: newId,
          isFavorite: true,
          usageCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };
        setPrompts((prev) => [...prev, newPrompt]);
      }
    } else {
      // Regular prompt toggle
      setPrompts((prev) =>
        prev.map((prompt) =>
          prompt.id === promptId
            ? {
                ...prompt,
                isFavorite: !prompt.isFavorite,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : prompt
        )
      );
    }

    const prompt =
      prompts.find((p) => p.id === promptId) ||
      suggestedPrompts.find((p) => p.id === promptId);
    if (prompt) {
      toast.success(
        prompt.isFavorite ? "Removed from favorites" : "Added to favorites"
      );
    }
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setIsNewPromptOpen(true);
    setEditingPrompt(prompt);
    setNewPrompt({
      title: prompt.title,
      category: prompt.category,
      description: prompt.description,
      tags: prompt.tags.join(", "),
    });
  };

  const handleSavePrompt = () => {
    if (!newPrompt.title || !newPrompt.description) {
      toast.error("Please fill in title and description");
      return;
    }

    const promptData = {
      title: newPrompt.title,
      category: newPrompt.category || "Custom",
      description: newPrompt.description,
      tags: newPrompt.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      isFavorite: false,
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    if (editingPrompt) {
      // Update existing prompt
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === editingPrompt.id
            ? {
                ...p,
                ...promptData,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : p
        )
      );
      toast.success("Prompt updated successfully!");
    } else {
      // Create new prompt
      const newId = Math.max(...prompts.map((p) => p.id)) + 1;
      setPrompts((prev) => [...prev, { ...promptData, id: newId }]);
      toast.success("New prompt created successfully!");
    }

    // Reset form
    setNewPrompt({ title: "", category: "", description: "", tags: "" });
    setEditingPrompt(null);
    setIsNewPromptOpen(false);
  };

  const handleAddToMyPrompts = (prompt: Prompt) => {
    // Check if prompt already exists
    const existingPrompt = prompts.find((p) => p.title === prompt.title);
    if (existingPrompt) {
      toast.error("This prompt already exists in My Prompts");
      return;
    }

    const newId = Math.max(...prompts.map((p) => p.id), 0) + 1;
    const newPrompt = {
      ...prompt,
      id: newId,
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setPrompts((prev) => [...prev, newPrompt]);
    toast.success("Prompt added to My Prompts!");
  };

  const handleDeletePrompt = (promptId: number) => {
    setPrompts((prev) => prev.filter((p) => p.id !== promptId));
    toast.success("Prompt deleted successfully!");
  };

  const resetNewPromptForm = () => {
    setNewPrompt({ title: "", category: "", description: "", tags: "" });
    setEditingPrompt(null);
  };

  const handleEditTopic = (topic: any) => {
    setIsNewTopicOpen(true);
    setEditingTopic(topic);
    setNewTopic({
      id: topic.id,
      title: topic.title,
      content: topic.content,
    });
  };

  const handleSaveTopic = () => {
    if (!newTopic.title || !newTopic.content) {
      toast.error("Please fill in title and content");
      return;
    }

    if (editingTopic) {
      // Update existing topic
      setEducationTopics((prev) =>
        prev.map((t) =>
          t.id === editingTopic.id
            ? { ...t, title: newTopic.title, content: newTopic.content }
            : t
        )
      );
      toast.success("Topic updated successfully!");
    } else {
      // Create new topic
      const newId = `custom-${Date.now()}`;
      setEducationTopics((prev) => [
        ...prev,
        {
          id: newId,
          title: newTopic.title,
          content: newTopic.content,
        },
      ]);
      setSelectedEducationTopic(newId);
      toast.success("New topic created successfully!");
    }

    // Reset form
    setNewTopic({ id: "", title: "", content: "" });
    setEditingTopic(null);
    setIsNewTopicOpen(false);
  };

  const handleDeleteTopic = (topicId: string) => {
    setEducationTopics((prev) => prev.filter((t) => t.id !== topicId));
    if (selectedEducationTopic === topicId) {
      setSelectedEducationTopic(educationTopics[0]?.id || "forex-basics");
    }
    toast.success("Topic deleted successfully!");
  };

  const resetNewTopicForm = () => {
    setNewTopic({ id: "", title: "", content: "" });
    setEditingTopic(null);
  };

  const getFilteredPrompts = () => {
    let filteredPrompts: Prompt[] = [];

    switch (activeCategory) {
      case "my-prompts":
        filteredPrompts = prompts;
        break;
      case "favorites":
        filteredPrompts = prompts.filter((p) => p.isFavorite);
        break;
      case "suggested":
        filteredPrompts = suggestedPrompts;
        break;
      default:
        filteredPrompts = prompts;
    }

    if (searchTerm) {
      filteredPrompts = filteredPrompts.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    return filteredPrompts;
  };

  const getCategoryCount = (category: string) => {
    switch (category) {
      case "my-prompts":
        return prompts.length;
      case "favorites":
        return prompts.filter((p) => p.isFavorite).length;
      case "suggested":
        return suggestedPrompts.length;
      case "education":
        return educationTopics.length;
      default:
        return 0;
    }
  };

  const PROMPT_CATEGORIES = [
    {
      id: "my-prompts",
      label: "My Prompts",
      count: getCategoryCount("my-prompts"),
    },
    {
      id: "favorites",
      label: "Favorites",
      count: getCategoryCount("favorites"),
    },
    {
      id: "suggested",
      label: "Suggested",
      count: getCategoryCount("suggested"),
    },
    {
      id: "education",
      label: "Education",
      count: getCategoryCount("education"),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    T
                  </span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  Trade Analysis App
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AuthComponent />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <div className="space-y-6">
              {/* Instrument Selector */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-base">
                    Select Trading Instrument
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedInstrument}
                    onValueChange={setSelectedInstrument}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {CURRENCY_PAIRS.map((pair) => (
                        <SelectItem
                          key={pair}
                          value={pair}
                          className="text-foreground hover:bg-secondary"
                        >
                          {pair}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Choose currency pair...
                  </p>
                </CardContent>
              </Card>

              {/* Search */}
              {activeCategory !== "education" && (
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <Input
                      placeholder="Search prompts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Available Count */}
              <div className="text-center">
                <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  {getFilteredPrompts().length} Available
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {/* Category Tabs */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                {PROMPT_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{category.label}</span>
                    {category.count > 0 && (
                      <Badge className="bg-secondary text-secondary-foreground text-xs">
                        {category.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>

              {activeCategory !== "education" && (
                <Dialog
                  open={isNewPromptOpen}
                  onOpenChange={setIsNewPromptOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={resetNewPromptForm}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Prompt
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border text-foreground max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingPrompt ? "Edit Prompt" : "Create New Prompt"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newPrompt.title}
                          onChange={(e) =>
                            setNewPrompt((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="bg-input border-border text-foreground"
                          placeholder="Enter prompt title..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newPrompt.category}
                          onChange={(e) =>
                            setNewPrompt((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="bg-input border-border text-foreground"
                          placeholder="e.g., Technical Analysis, Risk Management..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newPrompt.description}
                          onChange={(e) =>
                            setNewPrompt((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="bg-input border-border text-foreground min-h-[120px]"
                          placeholder="Enter your prompt description. Use [INSTRUMENT] as placeholder for the selected trading instrument..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                          id="tags"
                          value={newPrompt.tags}
                          onChange={(e) =>
                            setNewPrompt((prev) => ({
                              ...prev,
                              tags: e.target.value,
                            }))
                          }
                          className="bg-input border-border text-foreground"
                          placeholder="e.g., Technical Analysis, RSI, MACD..."
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsNewPromptOpen(false);
                            resetNewPromptForm();
                          }}
                          className="border-border text-muted-foreground hover:bg-secondary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSavePrompt}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {editingPrompt ? "Update" : "Create"} Prompt
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {activeCategory === "education" && (
                <Dialog open={isNewTopicOpen} onOpenChange={setIsNewTopicOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={resetNewTopicForm}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Topic
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border text-foreground max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingTopic ? "Edit Topic" : "Create New Topic"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="topic-title">Title</Label>
                        <Input
                          id="topic-title"
                          value={newTopic.title}
                          onChange={(e) =>
                            setNewTopic((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="bg-input border-border text-foreground"
                          placeholder="Enter topic title..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="topic-content">
                          Content (HTML supported)
                        </Label>
                        <Textarea
                          id="topic-content"
                          value={newTopic.content}
                          onChange={(e) =>
                            setNewTopic((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          className="bg-input border-border text-foreground min-h-[300px] font-mono text-sm"
                          placeholder="Enter topic content with HTML formatting..."
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsNewTopicOpen(false);
                            resetNewTopicForm();
                          }}
                          className="border-border text-muted-foreground hover:bg-secondary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveTopic}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {editingTopic ? "Update" : "Create"} Topic
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Content Area */}
            {activeCategory === "education" ? (
              <div className="grid grid-cols-4 gap-6">
                {/* Education Topics Sidebar */}
                <div className="col-span-1">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground text-base">
                        Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {educationTopics.map((topic) => (
                        <div
                          key={topic.id}
                          className={`w-full px-3 py-2 rounded-lg transition-colors ${
                            selectedEducationTopic === topic.id
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() =>
                                setSelectedEducationTopic(topic.id)
                              }
                              className="flex-1 text-left"
                            >
                              {topic.title}
                            </button>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditTopic(topic)}
                                className="p-1 hover:bg-secondary rounded"
                                title="Edit topic"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              {![
                                "forex-basics",
                                "technical-analysis",
                                "risk-management",
                              ].includes(topic.id) && (
                                <button
                                  onClick={() => handleDeleteTopic(topic.id)}
                                  className="p-1 hover:bg-red-500 hover:text-white rounded"
                                  title="Delete topic"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Education Content */}
                <div className="col-span-3">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">
                        {
                          educationTopics.find(
                            (t) => t.id === selectedEducationTopic
                          )?.title
                        }
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            educationTopics.find(
                              (t) => t.id === selectedEducationTopic
                            )?.content || "",
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              /* Prompts Grid */
              <div className="grid grid-cols-2 gap-4">
                {getFilteredPrompts().map((prompt) => (
                  <Card
                    key={prompt.id}
                    className="bg-card border-border hover:border-slate-600 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <button
                              onClick={() => {
                                if (activeCategory === "suggested") {
                                  toggleFavorite(prompt.id);
                                } else {
                                  toggleFavorite(prompt.id);
                                }
                              }}
                              className={`p-1 rounded ${
                                (
                                  activeCategory === "suggested"
                                    ? prompts.find(
                                        (p) => p.title === prompt.title
                                      )?.isFavorite
                                    : prompt.isFavorite
                                )
                                  ? "text-yellow-400 hover:text-yellow-300"
                                  : "text-muted-foreground hover:text-yellow-400"
                              }`}
                            >
                              {(
                                activeCategory === "suggested"
                                  ? prompts.find(
                                      (p) => p.title === prompt.title
                                    )?.isFavorite
                                  : prompt.isFavorite
                              ) ? (
                                <Star className="w-4 h-4 fill-current" />
                              ) : (
                                <Star className="w-4 h-4" />
                              )}
                            </button>
                            {activeCategory === "my-prompts" ||
                            (activeCategory === "favorites" &&
                              prompts.find((p) => p.id === prompt.id)) ||
                            (activeCategory === "suggested" &&
                              prompts.find((p) => p.title === prompt.title)) ? (
                              <>
                                <button
                                  onClick={() => {
                                    if (activeCategory === "suggested") {
                                      const userPrompt = prompts.find(
                                        (p) => p.title === prompt.title
                                      );
                                      if (userPrompt) {
                                        handleEditPrompt(userPrompt);
                                      }
                                    } else {
                                      handleEditPrompt(prompt);
                                    }
                                  }}
                                  className="text-muted-foreground hover:text-foreground p-1 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (activeCategory === "suggested") {
                                      const userPrompt = prompts.find(
                                        (p) => p.title === prompt.title
                                      );
                                      if (userPrompt) {
                                        handleDeletePrompt(userPrompt.id);
                                      }
                                    } else {
                                      handleDeletePrompt(prompt.id);
                                    }
                                  }}
                                  className="text-muted-foreground hover:text-red-400 p-1 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : null}
                            {activeCategory === "suggested" &&
                              !prompts.find(
                                (p) => p.title === prompt.title
                              ) && (
                                <button
                                  onClick={() => handleAddToMyPrompts(prompt)}
                                  className="text-muted-foreground hover:text-green-400 p-1 rounded"
                                  title="Add to My Prompts"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              )}
                          </div>
                          <CardTitle className="text-foreground text-lg mb-1">
                            {prompt.title.replace(
                              "EUR/USD",
                              selectedInstrument
                            )}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-secondary text-secondary-foreground text-xs">
                              {prompt.category}
                            </Badge>
                            {prompt.usageCount > 0 && (
                              <Badge
                                variant="outline"
                                className="border-border text-muted-foreground text-xs"
                              >
                                Used {prompt.usageCount}x
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {prompt.description.replace(
                          /\[INSTRUMENT\]/g,
                          selectedInstrument
                        )}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {prompt.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-border text-muted-foreground text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPrompt(prompt)}
                          className="border-border text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Prompt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {activeCategory !== "education" &&
              getFilteredPrompts().length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="mb-4">
                    {searchTerm
                      ? "No prompts found matching your search."
                      : "No prompts available in this category."}
                  </div>
                  {activeCategory === "my-prompts" && !searchTerm && (
                    <Button
                      onClick={() => {
                        resetNewPromptForm();
                        setIsNewPromptOpen(true);
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Prompt
                    </Button>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock Authentication Component
function AuthComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock authenticated state
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });

  const handleAuth = () => {
    if (!authForm.email || !authForm.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Mock authentication
    setIsAuthenticated(true);
    setShowAuthDialog(false);
    setAuthForm({ email: "", password: "" });
    toast.success(
      authMode === "signin"
        ? "Signed in successfully!"
        : "Account created successfully!"
    );
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    toast.success("Signed out successfully!");
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-foreground">Demo Trader</span>
        <span className="text-xs text-muted-foreground">
          demo@tradeanalysis.com
        </span>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            D
          </AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="border-border text-muted-foreground hover:bg-secondary"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowAuthDialog(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Sign In
      </Button>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="bg-input border-border text-foreground"
                placeholder="Enter your email..."
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="bg-input border-border text-foreground"
                placeholder="Enter your password..."
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() =>
                  setAuthMode(authMode === "signin" ? "signup" : "signin")
                }
                className="text-primary hover:text-primary/80 text-sm"
              >
                {authMode === "signin"
                  ? "Need an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAuthDialog(false);
                  setAuthForm({ email: "", password: "" });
                }}
                className="border-border text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAuth}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {authMode === "signin" ? "Sign In" : "Sign Up"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
