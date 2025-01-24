import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "../../components/ui/use-toast";
import { ArticlesService } from "app/api/sdk.gen";
import { franc } from "franc";
import { Article } from "app/api/types.gen";

interface ArticleActionsProps {
  params: { id: string };
  article: Article;
}

export function ArticleActions({ params, article }: ArticleActionsProps) {
  const [translatedContent, setTranslatedContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tagged, setTagged] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");

  const handleTranslate = async () => {
    console.log("detectedLanguage: ", detectedLanguage);
    const translatedArticle = await ArticlesService.postArticlesByIdTranslate({
      id: params.id,
      requestBody: {
        language: detectedLanguage,
      },
    });

    setTranslatedContent(translatedArticle.content);
    toast({
      title: "Article translated",
      description: "Your article has been translated.",
    });
  };

  const handleSummarize = async () => {
    console.log("detectedLanguage: ", detectedLanguage);
    const summarizedArticle = await ArticlesService.postArticlesByIdSummarize({
      id: params.id,
      requestBody: {
        language: detectedLanguage,
      },
    });

    setSummary(summarizedArticle.summary);
    toast({
      title: "Article summarized",
      description: "Your article has been summarized.",
    });
  };

  const handleTag = async () => {
    console.log("detectedLanguage: ", detectedLanguage);
    const taggedArticle = await ArticlesService.postArticlesByIdTag({
      id: params.id,
      requestBody: {
        language: detectedLanguage,
      },
    });

    setTagged(taggedArticle.tags.join(", "));
    toast({
      title: "Article tagged",
      description: "Your article has been tagged.",
    });
  };

  useEffect(() => {
    const detectedLanguage = franc(article.title || article.content || "");

    if (detectedLanguage === "eng" || detectedLanguage === "en") {
      setDetectedLanguage("english");
    } else if (
      detectedLanguage === "fra" ||
      detectedLanguage === "fr" ||
      detectedLanguage === "french"
    ) {
      setDetectedLanguage("french");
    } else {
      console.log("Defaulting to english: ", detectedLanguage);
      setDetectedLanguage("english");
    }

    console.log("detectedLanguage: ", detectedLanguage);
  }, [article]);

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button onClick={handleTranslate}>Translate</Button>
        <Button onClick={handleSummarize}>Summarize</Button>
        <Button onClick={handleTag}>Tag</Button>
      </div>
      {translatedContent && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Translated Content</h3>
          <Textarea value={translatedContent} readOnly rows={5} />
        </div>
      )}
      {summary && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <Textarea value={summary} readOnly rows={5} />
        </div>
      )}
      {tagged && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Tagged</h3>
          <Textarea value={tagged} readOnly rows={5} />
        </div>
      )}
    </div>
  );
}
