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
import { ArticlesService } from "app/api/sdk.gen";

export default function GenerateArticlePage() {
  const router = useRouter();
  const [article, setArticle] = useState({
    title: "",
    content: "",
    language: "english",
    author: "John Doe",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await ArticlesService.postArticlesGenerate({
        requestBody: {
          pressRelease: article.content,
          language: article.language,
        },
      });

      if (!response) {
        throw new Error("Failed to generate article");
      }

      toast({
        title: "Article generated",
        description: "Your article has been successfully generated.",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Generate Article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="content">Press Release</Label>
          <Textarea
            id="content"
            name="content"
            value={article.content}
            onChange={handleChange}
            required
            rows={10}
          />
        </div>

        <RadioGroup
          name="language"
          value={article.language}
          onValueChange={(value) =>
            setArticle((prev) => ({ ...prev, language: value }))
          }
        >
          <Label className="text-lg font-bold mt-4">Language</Label>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="english" id="english" />
            <Label htmlFor="english">English</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="french" id="french" />
            <Label htmlFor="french">French</Label>
          </div>
        </RadioGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating..." : "Generate Article"}
        </Button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Article Preview</h2>
        <BilingualPreview article={article}/>
      </div>
    </div>
  );
}
