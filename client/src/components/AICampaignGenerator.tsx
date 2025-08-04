import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wand2, RefreshCw, Copy, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const campaignGenerationSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().optional(),
  campaignType: z.enum(['email', 'sms', 'whatsapp']),
  campaignGoal: z.enum(['promotion', 'welcome', 'retention', 'announcement', 'survey']),
  targetAudience: z.string().optional(),
  productService: z.string().optional(),
  tone: z.enum(['professional', 'friendly', 'casual', 'urgent', 'formal']).optional(),
  keyMessage: z.string().optional(),
  callToAction: z.string().optional(),
});

const campaignEnhancementSchema = z.object({
  originalMessage: z.string().min(1, 'Original message is required'),
  campaignType: z.enum(['email', 'sms', 'whatsapp']),
  improvements: z.array(z.enum(['tone', 'clarity', 'engagement', 'cta', 'personalization', 'length'])),
  businessName: z.string().min(1, 'Business name is required'),
  targetAudience: z.string().optional(),
});

type CampaignGenerationForm = z.infer<typeof campaignGenerationSchema>;
type CampaignEnhancementForm = z.infer<typeof campaignEnhancementSchema>;

interface AIGeneratedCampaign {
  subject?: string;
  message: string;
  suggestions: string[];
  wordCount: number;
  estimatedEngagement: 'low' | 'medium' | 'high';
}

export function AICampaignGenerator() {
  const [mode, setMode] = useState<'generate' | 'enhance'>('generate');
  const [generatedCampaign, setGeneratedCampaign] = useState<AIGeneratedCampaign | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const { toast } = useToast();

  const generateForm = useForm<CampaignGenerationForm>({
    resolver: zodResolver(campaignGenerationSchema),
    defaultValues: {
      campaignType: 'email',
      campaignGoal: 'promotion',
      tone: 'friendly',
    },
  });

  const enhanceForm = useForm<CampaignEnhancementForm>({
    resolver: zodResolver(campaignEnhancementSchema),
    defaultValues: {
      campaignType: 'email',
      improvements: ['engagement', 'clarity'],
    },
  });

  const generateMutation = useMutation({
    mutationFn: (data: CampaignGenerationForm) => apiRequest('/api/campaigns/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (response) => {
      setGeneratedCampaign(response.campaign);
      toast({
        title: "Campaign Generated!",
        description: "Your AI-powered campaign is ready to review.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const enhanceMutation = useMutation({
    mutationFn: (data: CampaignEnhancementForm) => apiRequest('/api/campaigns/enhance', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (response) => {
      setGeneratedCampaign(response.campaign);
      toast({
        title: "Campaign Enhanced!",
        description: "Your campaign has been improved by AI.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Enhancement Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const variationsMutation = useMutation({
    mutationFn: (data: { originalMessage: string; count: number }) => 
      apiRequest('/api/campaigns/variations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (response) => {
      setVariations(response.variations);
      toast({
        title: "Variations Generated!",
        description: `Created ${response.variations.length} alternative versions.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Variations Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onGenerate = (data: CampaignGenerationForm) => {
    generateMutation.mutate(data);
  };

  const onEnhance = (data: CampaignEnhancementForm) => {
    enhanceMutation.mutate(data);
  };

  const generateVariations = () => {
    if (generatedCampaign?.message) {
      variationsMutation.mutate({
        originalMessage: generatedCampaign.message,
        count: 3,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Campaign Generator
          </CardTitle>
          <CardDescription>
            Generate or enhance marketing campaigns using AI for different platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={mode === 'generate' ? 'default' : 'outline'}
              onClick={() => setMode('generate')}
            >
              Generate New
            </Button>
            <Button
              variant={mode === 'enhance' ? 'default' : 'outline'}
              onClick={() => setMode('enhance')}
            >
              Enhance Existing
            </Button>
          </div>

          {mode === 'generate' ? (
            <Form {...generateForm}>
              <form onSubmit={generateForm.handleSubmit(onGenerate)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={generateForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generateForm.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Restaurant, Retail, Service" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={generateForm.control}
                    name="campaignType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generateForm.control}
                    name="campaignGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Goal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="promotion">Promotion</SelectItem>
                            <SelectItem value="welcome">Welcome</SelectItem>
                            <SelectItem value="retention">Retention</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="survey">Survey</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generateForm.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={generateForm.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Young professionals, Families, Seniors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={generateForm.control}
                  name="keyMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What's the main message you want to convey?"
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={generateForm.control}
                  name="callToAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call to Action (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Visit our store, Call now, Book appointment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={generateMutation.isPending} className="w-full">
                  {generateMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Campaign
                    </>
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...enhanceForm}>
              <form onSubmit={enhanceForm.handleSubmit(onEnhance)} className="space-y-4">
                <FormField
                  control={enhanceForm.control}
                  name="originalMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Campaign Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Paste your existing campaign message here..."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={enhanceForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={enhanceForm.control}
                    name="campaignType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={enhanceForm.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Who is this campaign for?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={enhanceForm.control}
                  name="improvements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Focus Areas for Improvement</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {['tone', 'clarity', 'engagement', 'cta', 'personalization', 'length'].map((improvement) => (
                            <Badge
                              key={improvement}
                              variant={field.value.includes(improvement as any) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => {
                                const newValue = field.value.includes(improvement as any)
                                  ? field.value.filter(i => i !== improvement)
                                  : [...field.value, improvement as any];
                                field.onChange(newValue);
                              }}
                            >
                              {improvement.charAt(0).toUpperCase() + improvement.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={enhanceMutation.isPending} className="w-full">
                  {enhanceMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Enhance Campaign
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {generatedCampaign && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Campaign</span>
              <div className="flex items-center gap-2">
                <Badge className={getEngagementColor(generatedCampaign.estimatedEngagement)}>
                  {generatedCampaign.estimatedEngagement} engagement
                </Badge>
                <Badge variant="outline">
                  {generatedCampaign.wordCount} words
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedCampaign.subject && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Subject Line</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedCampaign.subject!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  {generatedCampaign.subject}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Message</h4>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateVariations}
                    disabled={variationsMutation.isPending}
                  >
                    <RefreshCw className={`h-4 w-4 ${variationsMutation.isPending ? 'animate-spin' : ''}`} />
                    Variations
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedCampaign.message)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                {generatedCampaign.message}
              </div>
            </div>

            {generatedCampaign.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">AI Suggestions</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {generatedCampaign.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {variations.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3">Alternative Versions</h4>
                  <div className="space-y-3">
                    {variations.map((variation, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Badge variant="outline">V{index + 1}</Badge>
                        <div className="flex-1 p-3 bg-gray-50 rounded-md">
                          {variation}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(variation)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}