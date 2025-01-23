"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Article } from "app/api/types.gen";
import { franc } from "franc";

interface BilingualPreviewProps {
  article: Article;
}

export function BilingualPreview({ article }: BilingualPreviewProps) {
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [previewLanguage, setPreviewLanguage] = useState<"en" | "fr">(
    detectedLanguage as "en" | "fr"
  );

  const toggleLanguage = () => {
    setPreviewLanguage((prev) => (prev === "en" ? "fr" : "en"));
  };

  // Mock translation function (replace with actual translation logic)
  const translate = (text: string, targetLang: string) => {
    if (targetLang === detectedLanguage) return text;
    return `[Translated] ${text}`;
  };

  useEffect(() => {
    const detectedLanguage = franc(article.title || article.content || "");
    setDetectedLanguage(detectedLanguage);
    setPreviewLanguage(detectedLanguage as "en" | "fr");
    console.log("detectedLanguage: ", detectedLanguage);
  }, [article]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Article Preview</CardTitle>
        <Button onClick={toggleLanguage} variant="outline" size="sm">
          {previewLanguage === "en" ? "Switch to French" : "Switch to English"}
        </Button>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-bold mb-2">
          {translate(article.title, previewLanguage)}
        </h3>
        <p className="whitespace-pre-wrap">
          {translate(article.content, previewLanguage)}
        </p>
      </CardContent>
    </Card>
  );
}
