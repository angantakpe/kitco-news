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
  const [previewLanguage, setPreviewLanguage] = useState<"en" | "fr">("en");
  const toggleLanguage = () => {
    setPreviewLanguage((prev) => (prev === "en" ? "fr" : "en"));
  };

  const translate = (text: string, targetLang: string) => {
    return text || "";
  };

  useEffect(() => {
    const detectedLanguage = franc(article.title || article.content || "");
    if (detectedLanguage === "eng" || detectedLanguage === "en") {
      setPreviewLanguage("en");
    } else if (
      detectedLanguage === "fra" ||
      detectedLanguage === "fr" ||
      detectedLanguage === "french"
    ) {
      setPreviewLanguage("fr");
    } else {
      setPreviewLanguage("en"); // Default to English for other languages
    }
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
        <div className="flex flex-col gap-2">
          {previewLanguage === "en" && (
            <h3 className="text-xl font-bold mb-2">
              {translate(article.title, previewLanguage)}
            </h3>
          )}
          {previewLanguage === "fr" && (
            <p className="whitespace-pre-wrap">
              {translate(article.titleFr, previewLanguage)}
            </p>
          )}
          {previewLanguage === "en" && (
            <p className="whitespace-pre-wrap">
              {translate(article.content, previewLanguage)}
            </p>
          )}
          {previewLanguage === "fr" && (
            <p className="whitespace-pre-wrap">
              {translate(article.contentFr, previewLanguage)}
            </p>
          )}
          <p className="whitespace-pre-wrap">
            Category: {translate(article.category, previewLanguage)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
