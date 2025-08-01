import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogPostSchema, type InsertBlogPost } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PenTool, Save, Eye, Gift, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function WriteBlog() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "career",
      isPublished: false,
      tags: [],
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const response = await apiRequest("POST", "/api/blogs", { 
        ...data, 
        tags 
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Blog Post Created!",
        description: `You earned 50 reward points for writing a blog! Total posts: ${data.totalPosts || 1}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/blogs");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const response = await apiRequest("POST", "/api/blogs", { 
        ...data, 
        tags,
        isPublished: false 
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Draft Saved",
        description: "Your blog post has been saved as a draft",
      });
      setLocation("/blogs/my-blogs");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save draft",
        variant: "destructive",
      });
    },
  });

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = (data: InsertBlogPost) => {
    if (data.isPublished) {
      createBlogMutation.mutate(data);
    } else {
      saveDraftMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PenTool className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              Write Blog Post
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your knowledge and experience with the community. Earn 50 reward points for each published blog post!
          </p>
        </div>

        {/* Reward Info */}
        <Card className="mb-8 border-purple-200 bg-gradient-to-r from-purple-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-600 to-green-600 p-3 rounded-full">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Earn Reward Points</h3>
                <p className="text-sm text-purple-700">
                  Get 50 points for publishing a blog post • Help others and build your reputation
                </p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-1 text-purple-600">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-bold">+50 Points</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Form */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/50">
          <CardHeader>
            <CardTitle>Create Your Blog Post</CardTitle>
            <CardDescription>
              Write an engaging blog post to share your insights with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Blog Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. How to ace your next technical interview"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="career">Career Advice</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="interview">Interview Tips</SelectItem>
                            <SelectItem value="experience">Work Experience</SelectItem>
                            <SelectItem value="skills">Skill Development</SelectItem>
                            <SelectItem value="industry">Industry Insights</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tags..."
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brief Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief summary of your blog post (optional)"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Content *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your blog content here... (minimum 50 characters)"
                          rows={12}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish Immediately</FormLabel>
                        <FormDescription className="text-sm text-gray-600">
                          Publish this blog post now to earn reward points and share with the community
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-green-600"
                    disabled={createBlogMutation.isPending || saveDraftMutation.isPending}
                  >
                    {form.watch("isPublished") ? (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Publish Blog Post
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save as Draft
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setLocation("/blogs")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}