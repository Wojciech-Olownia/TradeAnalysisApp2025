"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from './components/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Copy, Edit, Plus, Heart, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const CURRENCY_PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 
  'USD/CHF', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
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
    title: 'Daily EUR/USD Technical Analysis',
    category: 'Technical Analysis',
    description: 'Analyze the current technical setup for [INSTRUMENT]. Focus on key support at 1.0850 and resistance at 1.0920. Check RSI levels, MACD crossover signals, and 50/200 MA positioning. Provide entry points with 2:1 risk-reward ratio.',
    isFavorite: true,
    tags: ['Technical Analysis'],
    usageCount: 15,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    title: 'Risk Management Assessment',
    category: 'Risk Management',
    description: 'Evaluate risk factors for [INSTRUMENT] trading today. Consider market volatility (ATR), upcoming economic events, correlation with DXY, and optimal position sizing for 1% account risk. Include stop-loss placement strategy.',
    isFavorite: false,
    tags: ['Risk Management'],
    usageCount: 8,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    title: 'Market Sentiment Overview',
    category: 'Market Sentiment',
    description: 'Provide market sentiment analysis for [INSTRUMENT]. Include risk-on/risk-off indicators, central bank policy outlook, economic data impact, and institutional positioning. Assess how sentiment affects price action.',
    isFavorite: true,
    tags: ['Market Sentiment'],
    usageCount: 12,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19'
  },
  {
    id: 4,
    title: 'Swing Trading Setup',
    category: 'Price Action',
    description: 'Identify swing trading opportunities for [INSTRUMENT] on H4 and Daily timeframes. Look for trend continuation patterns, key Fibonacci levels, and momentum divergences. Provide 3-5 day holding period strategy.',
    isFavorite: false,
    tags: ['Price Action'],
    usageCount: 6,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-16'
  },
  {
    id: 5,
    title: 'News Impact Analysis',
    category: 'Fundamental Analysis',
    description: 'Analyze how recent economic releases affect [INSTRUMENT]. Focus on NFP, CPI, Fed speeches, and ECB policy decisions. Predict short-term volatility and directional bias based on fundamental drivers.',
    isFavorite: false,
    tags: ['Fundamental Analysis'],
    usageCount: 4,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-14'
  }
];

const SUGGESTED_PROMPTS: Prompt[] = [
  {
    id: 101,
    title: 'Correlation Analysis',
    category: 'Advanced Analysis',
    description: 'Analyze the correlation between [INSTRUMENT] and major market indices (SPX, DXY, Gold). Identify divergences and potential trading opportunities based on correlation breakdowns.',
    isFavorite: false,
    tags: ['Correlation', 'Advanced'],
    usageCount: 0,
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21'
  },
  {
    id: 102,
    title: 'Volatility Breakout Strategy',
    category: 'Volatility Trading',
    description: 'Identify potential volatility breakouts for [INSTRUMENT]. Analyze Bollinger Bands, ATR expansion, and volume patterns. Provide entry triggers and volatility-based position sizing.',
    isFavorite: false,
    tags: ['Volatility', 'Breakout'],
    usageCount: 0,
    createdAt: '2024-01-21',
    updatedAt: '2024-01-21'
  }
];

const EDUCATION_CONTENT = [
  {
    id: 'forex-basics',
    title: 'Forex Market Basics',
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
    `
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis',
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
    `
  },
  {
    id: 'risk-management',
    title: 'Risk Management',
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
    `
  }
];

export default function Home() {
  const [selectedInstrument, setSelectedInstrument] = useState<string>('EUR/USD');
  const [activeCategory, setActiveCategory] = useState<string>('my-prompts');
  const [prompts, setPrompts] = useState<Prompt[]>(INITIAL_PROMPTS);
  const [suggestedPrompts] = useState<Prompt[]>(SUGGESTED_PROMPTS);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isNewPromptOpen, setIsNewPromptOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEducationTopic, setSelectedEducationTopic] = useState('forex-basics');
  const [educationTopics, setEducationTopics] = useState(EDUCATION_CONTENT);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    id: '',
    title: '',
    content: ''
  });

  // New prompt form state
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    category: '',
    description: '',
    tags: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem('marketai-prompts');
    if (savedPrompts) {
      setPrompts(JSON.parse(savedPrompts));
    }
    const savedTopics = localStorage.getItem('marketai-education-topics');
    if (savedTopics) {
      setEducationTopics(JSON.parse(savedTopics));
    }
  }, []);

  // Save prompts to localStorage whenever prompts change
  useEffect(() => {
    localStorage.setItem('marketai-prompts', JSON.stringify(prompts));
  }, [prompts]);

  // Save education topics to localStorage whenever topics change
  useEffect(() => {
    localStorage.setItem('marketai-education-topics', JSON.stringify(educationTopics));
  }, [educationTopics]);

  const handleCopyPrompt = (prompt: Prompt) => {
    const customizedPrompt = prompt.description.replace(/\[INSTRUMENT\]/g, selectedInstrument);
    navigator.clipboard.writeText(customizedPrompt);
    
    // Update usage count
    setPrompts(prev => prev.map(p => 
      p.id === prompt.id 
        ? { ...p, usageCount: p.usageCount + 1, updatedAt: new Date().toISOString().split('T')[0] }
        : p
    ));
    
    toast.success(`Prompt copied for ${selectedInstrument}!`);
  };

  const toggleFavorite = (promptId: number) => {
    // Check if it's a suggested prompt
    const suggestedPrompt = suggestedPrompts.find(p => p.id === promptId);
    if (suggestedPrompt) {
      // For suggested prompts, we need to add them to user prompts first
      const existingPrompt = prompts.find(p => p.title === suggestedPrompt.title);
      if (existingPrompt) {
        // If already exists in user prompts, just toggle favorite
        setPrompts(prev => prev.map(prompt => 
          prompt.id === existingPrompt.id 
            ? { 
                ...prompt, 
                isFavorite: !prompt.isFavorite,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : prompt
        ));
      } else {
        // Add to user prompts as favorite
        const newId = Math.max(...prompts.map(p => p.id), 0) + 1;
        const newPrompt = {
          ...suggestedPrompt,
          id: newId,
          isFavorite: true,
          usageCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setPrompts(prev => [...prev, newPrompt]);
      }
    } else {
      // Regular prompt toggle
      setPrompts(prev => prev.map(prompt => 
        prompt.id === promptId 
          ? { 
              ...prompt, 
              isFavorite: !prompt.isFavorite,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : prompt
      ));
    }
    
    const prompt = prompts.find(p => p.id === promptId) || suggestedPrompts.find(p => p.id === promptId);
    if (prompt) {
      toast.success(prompt.isFavorite ? 'Removed from favorites' : 'Added to favorites');
    }
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setIsNewPromptOpen(true);
    setEditingPrompt(prompt);
    setNewPrompt({
      title: prompt.title,
      category: prompt.category,
      description: prompt.description,
      tags: prompt.tags.join(', ')
    });
  };

  const handleSavePrompt = () => {
    if (!newPrompt.title || !newPrompt.description) {
      toast.error('Please fill in title and description');
      return;
    }

    const promptData = {
      title: newPrompt.title,
      category: newPrompt.category || 'Custom',
      description: newPrompt.description,
      tags: newPrompt.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isFavorite: false,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingPrompt) {
      // Update existing prompt
      setPrompts(prev => prev.map(p => 
        p.id === editingPrompt.id 
          ? { ...p, ...promptData, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ));
      toast.success('Prompt updated successfully!');
    } else {
      // Create new prompt
      const newId = Math.max(...prompts.map(p => p.id)) + 1;
      setPrompts(prev => [...prev, { ...promptData, id: newId }]);
      toast.success('New prompt created successfully!');
    }

    // Reset form
    setNewPrompt({ title: '', category: '', description: '', tags: '' });
    setEditingPrompt(null);
    setIsNewPromptOpen(false);
  };

  const handleAddToMyPrompts = (prompt: Prompt) => {
    // Check if prompt already exists
    const existingPrompt = prompts.find(p => p.title === prompt.title);
    if (existingPrompt) {
      toast.error('This prompt already exists in My Prompts');
      return;
    }
    
    const newId = Math.max(...prompts.map(p => p.id), 0) + 1;
    const newPrompt = {
      ...prompt,
      id: newId,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setPrompts(prev => [...prev, newPrompt]);
    toast.success('Prompt added to My Prompts!');
  };

  const handleDeletePrompt = (promptId: number) => {
    setPrompts(prev => prev.filter(p => p.id !== promptId));
    toast.success('Prompt deleted successfully!');
  };

  const resetNewPromptForm = () => {
    setNewPrompt({ title: '', category: '', description: '', tags: '' });
    setEditingPrompt(null);
  };

  const handleEditTopic = (topic: any) => {
    setIsNewTopicOpen(true);
    setEditingTopic(topic);
    setNewTopic({
      id: topic.id,
      title: topic.title,
      content: topic.content
    });
  };

  const handleSaveTopic = () => {
    if (!newTopic.title || !newTopic.content) {
      toast.error('Please fill in title and content');
      return;
    }

    if (editingTopic) {
      // Update existing topic
      setEducationTopics(prev => prev.map(t => 
        t.id === editingTopic.id 
          ? { ...t, title: newTopic.title, content: newTopic.content }
          : t
      ));
      toast.success('Topic updated successfully!');
    } else {
      // Create new topic
      const newId = `custom-${Date.now()}`;
      setEducationTopics(prev => [...prev, { 
        id: newId, 
        title: newTopic.title, 
        content: newTopic.content 
      }]);
      setSelectedEducationTopic(newId);
      toast.success('New topic created successfully!');
    }

    // Reset form
    setNewTopic({ id: '', title: '', content: '' });
    setEditingTopic(null);
    setIsNewTopicOpen(false);
  };

  const handleDeleteTopic = (topicId: string) => {
    setEducationTopics(prev => prev.filter(t => t.id !== topicId));
    if (selectedEducationTopic === topicId) {
      setSelectedEducationTopic(educationTopics[0]?.id || 'forex-basics');
    }
    toast.success('Topic deleted successfully!');
  };

  const resetNewTopicForm = () => {
    setNewTopic({ id: '', title: '', content: '' });
    setEditingTopic(null);
  };

  const getFilteredPrompts = () => {
    let filteredPrompts: Prompt[] = [];
    
    switch (activeCategory) {
      case 'my-prompts':
        filteredPrompts = prompts;
        break;
      case 'favorites':
        filteredPrompts = prompts.filter(p => p.isFavorite);
        break;
      case 'suggested':
        filteredPrompts = suggestedPrompts;
        break;
      default:
        filteredPrompts = prompts;
    }

    if (searchTerm) {
      filteredPrompts = filteredPrompts.filter(prompt =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filteredPrompts;
  };

  const getCategoryCount = (category: string) => {
    switch (category) {
      case 'my-prompts':
        return prompts.length;
      case 'favorites':
        return prompts.filter(p => p.isFavorite).length;
      case 'suggested':
        return suggestedPrompts.length;
      case 'education':
        return educationTopics.length;
      default:
        return 0;
    }
  };

  const PROMPT_CATEGORIES = [
    { id: 'my-prompts', label: 'My Prompts', count: getCategoryCount('my-prompts') },
    { id: 'favorites', label: 'Favorites', count: getCategoryCount('favorites') },
    { id: 'suggested', label: 'Suggested', count: getCategoryCount('suggested') },
    { id: 'education', label: 'Education', count: getCategoryCount('education') }
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
                  <span className="text-primary-foreground font-bold text-sm">T</span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">TradeAnalysisApp</h1>
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
                  <CardTitle className="text-foreground text-base">Select Trading Instrument</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {CURRENCY_PAIRS.map((pair) => (
                        <SelectItem key={pair} value={pair} className="text-foreground hover:bg-secondary">
                          {pair}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">Choose currency pair...</p>
                </CardContent>
              </Card>

              {/* Search */}
              {activeCategory !== 'education' && (
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
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
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
              
              {activeCategory !== 'education' && (
                <Dialog open={isNewPromptOpen} onOpenChange={setIsNewPromptOpen}>
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
                      <DialogTitle>{editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newPrompt.title}
                          onChange={(e) => setNewPrompt(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-input border-border text-foreground"
                          placeholder="Enter prompt title..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newPrompt.category}
                          onChange={(e) => setNewPrompt(prev => ({ ...prev, category: e.target.value }))}
                          className="bg-input border-border text-foreground"
                          placeholder="e.g., Technical Analysis, Risk Management..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newPrompt.description}
                          onChange={(e) => setNewPrompt(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-input border-border text-foreground min-h-[120px]"
                          placeholder="Enter your prompt description. Use [INSTRUMENT] as placeholder for the selected trading instrument..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                          id="tags"
                          value={newPrompt.tags}
                          onChange={(e) => setNewPrompt(prev => ({ ...prev, tags: e.target.value }))}
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
                        <Button onClick={handleSavePrompt} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          {editingPrompt ? 'Update' : 'Create'} Prompt
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              
              {activeCategory === 'education' && (
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
                      <DialogTitle>{editingTopic ? 'Edit Topic' : 'Create New Topic'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="topic-title">Title</Label>
                        <Input
                          id="topic-title"
                          value={newTopic.title}
                          onChange={(e) => setNewTopic(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-input border-border text-foreground"
                          placeholder="Enter topic title..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="topic-content">Content (HTML supported)</Label>
                        <Textarea
                          id="topic-content"
                          value={newTopic.content}
                          onChange={(e) => setNewTopic(prev => ({ ...prev, content: e.target.value }))}
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
                        <Button onClick={handleSaveTopic} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          {editingTopic ? 'Update' : 'Create'} Topic
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Content Area */}
            {activeCategory === 'education' ? (
              <div className="grid grid-cols-4 gap-6">
                {/* Education Topics Sidebar */}
                <div className="col-span-1">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground text-base">Topics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {educationTopics.map((topic) => (
                        <div
                          key={topic.id}
                          className={`w-full px-3 py-2 rounded-lg transition-colors ${
                            selectedEducationTopic === topic.id
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => setSelectedEducationTopic(topic.id)}
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
                              {!['forex-basics', 'technical-analysis', 'risk-management'].includes(topic.id) && (
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
                        {educationTopics.find(t => t.id === selectedEducationTopic)?.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: educationTopics.find(t => t.id === selectedEducationTopic)?.content || '' 
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
                  <Card key={prompt.id} className="bg-card border-border hover:border-slate-600 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <button
                              onClick={() => {
                                if (activeCategory === 'suggested') {
                                  toggleFavorite(prompt.id);
                                } else {
                                  toggleFavorite(prompt.id);
                                }
                              }}
                              className={`p-1 rounded ${
                                (activeCategory === 'suggested' ? 
                                  prompts.find(p => p.title === prompt.title)?.isFavorite : 
                                  prompt.isFavorite)
                                  ? 'text-yellow-400 hover:text-yellow-300' 
                                  : 'text-muted-foreground hover:text-yellow-400'
                              }`}
                            >
                              {(activeCategory === 'suggested' ? 
                                prompts.find(p => p.title === prompt.title)?.isFavorite : 
                                prompt.isFavorite) ? (
                                <Star className="w-4 h-4 fill-current" />
                              ) : (
                                <Star className="w-4 h-4" />
                              )}
                            </button>
                            {(activeCategory === 'my-prompts' || 
                              (activeCategory === 'favorites' && prompts.find(p => p.id === prompt.id)) ||
                              (activeCategory === 'suggested' && prompts.find(p => p.title === prompt.title))) ? (
                              <>
                                <button 
                                  onClick={() => {
                                    if (activeCategory === 'suggested') {
                                      const userPrompt = prompts.find(p => p.title === prompt.title);
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
                                    if (activeCategory === 'suggested') {
                                      const userPrompt = prompts.find(p => p.title === prompt.title);
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
                            {activeCategory === 'suggested' && !prompts.find(p => p.title === prompt.title) && (
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
                            {prompt.title.replace('EUR/USD', selectedInstrument)}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-secondary text-secondary-foreground text-xs">
                              {prompt.category}
                            </Badge>
                            {prompt.usageCount > 0 && (
                              <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                                Used {prompt.usageCount}x
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {prompt.description.replace(/\[INSTRUMENT\]/g, selectedInstrument)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {prompt.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="border-border text-muted-foreground text-xs">
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
            {activeCategory !== 'education' && getFilteredPrompts().length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="mb-4">
                  {searchTerm ? 'No prompts found matching your search.' : 'No prompts available in this category.'}
                </div>
                {activeCategory === 'my-prompts' && !searchTerm && (
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
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });

  const handleAuth = () => {
    if (!authForm.email || !authForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Mock authentication
    setIsAuthenticated(true);
    setShowAuthDialog(false);
    setAuthForm({ email: '', password: '' });
    toast.success(authMode === 'signin' ? 'Signed in successfully!' : 'Account created successfully!');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    toast.success('Signed out successfully!');
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-foreground">Demo Trader</span>
        <span className="text-xs text-muted-foreground">demo@tradeanalysis.com</span>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">D</AvatarFallback>
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
            <DialogTitle>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
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
                onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                className="bg-input border-border text-foreground"
                placeholder="Enter your password..."
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-primary hover:text-primary/80 text-sm"
              >
                {authMode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAuthDialog(false);
                  setAuthForm({ email: '', password: '' });
                }}
                className="border-border text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleAuth} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}