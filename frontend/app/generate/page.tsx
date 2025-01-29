"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { useToast } from "../../hooks/use-toast";
import { BilingualPreview } from "app/components/bilingual-preview";
import { ArticlesService } from "app/api/sdk.gen";
import { useWebSocket } from "hooks/use-websocket";
import PressReleases from "app/components/press-releases";
import pressReleases from "../../press_releases.json";

export default function GenerateArticlePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [article, setArticle] = useState({
    title: "",
    content: "",
    language: "english",
    author: "John Doe",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingData, setStreamingData] = useState([]);

  const handleWebSocketMessage = (data: any) => {
    console.log("handleWebSocketMessage", data);
  
    if (data.type === "articleChunk") {
      console.log("articleChunk", data);
  
      // Buffer the data instead of updating state immediately
      setStreamingData((prev) => [...prev, data]);
  
      // Use a ref to collect the latest article content without frequent re-renders
      setArticle((prev) => ({
        ...prev,
        content: prev.content + (data.content || ""),
      }));
    } else if (data.type === "articleGenerated") {
      setIsGenerating(false);
      toast({
        title: "Article generated",
        description: "Your article has been successfully generated.",
      });
      setArticle((prev) => ({ ...prev, ...data.article }));
    } else if (data.type === "error") {
      setIsGenerating(false);
      toast({
        title: "Error",
        description: data.message || "An error occurred while generating the article.",
        variant: "destructive",
      });
    } else {
      console.log("unknown message type", data);
    }
  };
  

  const { sendMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080",
    handleWebSocketMessage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // const response = await ArticlesService.postArticlesGenerate({
      //   requestBody: {
      //     pressRelease: article.content,
      //     language: article.language,
      //   },
      // });

      // if (!response) {
      //   throw new Error("Failed to generate article");
      // }

      // toast({
      //   title: "Article generated",
      //   description: "Your article has been successfully generated.",
      // });

      // router.push("/");

      sendMessage({
        type: "generateArticle",
        pressRelease: article.content,
        language: article.language,
      });
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
          <Label htmlFor="content" className="text-lg mb-2 font-bold">Press Release</Label>
          <Textarea
            id="content"
            name="content"
            value={article.content}
            onChange={handleChange}
            required
            rows={10}
          />
        </div>

        {/* <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Press Releases</h2>
          <PressReleases pressReleases={pressReleases} />
        </div> */}

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
        <h2 className="text-2xl font-bold mb-4">Streaming Data Preview</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
          {JSON.stringify(streamingData, null, 2)}
        </pre>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Article Preview</h2>
        <BilingualPreview article={article} />
      </div>
    </div>
  );
}
