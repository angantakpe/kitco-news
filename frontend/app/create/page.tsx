"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { toast } from "../../components/ui/use-toast";
import { BilingualPreview } from "../components/bilingual-preview";
import { ArticlesService } from "../api/sdk.gen";

export default function CreateArticlePage() {
  const router = useRouter();
  const [article, setArticle] = useState({
    title: "",
    content: "",
    tags: [],
    category: "",
    language: "english",
    author: "fake@email.com",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await ArticlesService.postArticles({
        requestBody: article,
      });

      console.log("RESPONSE: ", response);

      if (!response) {
        throw new Error("Failed to create article");
      }

      toast({
        title: "Article created",
        description: "Your article has been successfully created.",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            value={article.content}
            onChange={(e) =>
              setArticle({ ...article, content: e.target.value })
            }
            required
            rows={10}
          />
        </div>
        <div>
          <RadioGroup
            name="category"
            value={article.category}
            onValueChange={(value) =>
              setArticle((prev) => ({ ...prev, category: value }))
            }
          >
            <Label className="text-lg font-bold mt-4">Category</Label>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mining" id="mining" />
              <Label htmlFor="mining">Mining</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="crypto" id="crypto" />
              <Label htmlFor="crypto">Crypto</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Article"}
        </Button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Article Preview</h2>
        <BilingualPreview article={article} />
      </div>
    </div>
  );
}
