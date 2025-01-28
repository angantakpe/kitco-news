"use client";
require("dotenv").config();

import { useEffect, useState } from "react";
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

interface Article {
  title: string;
  content: string;
  language: "english" | "french";
  author: string;
  publishedDate?: string;
  tags?: string[];
  category?: string;
  relatedCompanies?: string[];
  marketData?: {
    price: number;
    marketCap: number;
    change24h: number;
  };
}

interface WebSocketMessage {
  type: "articleChunk" | "articleGenerated" | "error";
  content?: string;
  article?: Article;
  error?: string;
  message?: string; // For welcome message
}

export default function GenerateArticlePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article>({
    title: "",
    content: "",
    language: "english",
    author: "John Doe",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  const handleWebSocketMessage = (data: WebSocketMessage) => {
    console.log("handleWebSocketMessage", data);

    // Handle welcome message
    if (data.message === "Welcome to Kitco News WebSocket server!") {
      console.log("Connected to WebSocket server");
      setConnectionStatus("connected");
      return;
    }
    
    switch (data.type) {
      case "articleChunk":
        if (data.content) {
          setArticle((prev) => ({
            ...prev,
            content: prev.content + data.content,
          }));
        }
        break;

      case "articleGenerated":
        if (data.article) {
          console.log("articleGenerated", data.article);
          setArticle((prev) => ({ ...prev, ...data.article }));
          toast({
            title: "Success",
            description: "Article has been generated successfully.",
          });
          setIsGenerating(false);
          setIsSubmitting(false);
        }
        break;

      case "error":
        console.error("WebSocket error:", data.error);
        toast({
          title: "Error",
          description:
            data.error || "An error occurred while generating the article",
          variant: "destructive",
        });
        setIsGenerating(false);
        setIsSubmitting(false);
        break;

      default:
        console.log("Received message:", data);
    }
  };

  const { sendMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080",
    handleWebSocketMessage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!article.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a press release",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setIsGenerating(true);
    setArticle((prev) => ({ ...prev, content: "" })); // Clear previous content

    try {
      sendMessage({
        type: "generateArticle",
        pressRelease: article.content,
        language: article.language,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      setIsGenerating(false);
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
      {connectionStatus !== "connected" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          {connectionStatus === "connecting"
            ? "Connecting to server..."
            : "Disconnected from server. Please refresh the page."}
        </div>
      )}

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

        <div className="mt-8 mb-4">
          <h2 className="text-2xl font-bold mb-4">Press Releases</h2>
          <PressReleases pressReleases={pressReleases} />
        </div>

        <RadioGroup
          name="language"
          value={article.language}
          onValueChange={(value: "english" | "french") =>
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

        <Button
          type="submit"
          disabled={connectionStatus !== "connected" || isSubmitting}
          className={isGenerating ? "animate-pulse" : ""}
        >
          {isGenerating
            ? "Generating..."
            : isSubmitting
            ? "Please wait..."
            : "Generate Article"}
        </Button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Article Preview</h2>
        <BilingualPreview article={article as any} />
      </div>
    </div>
  );
}
