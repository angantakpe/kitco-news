import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "../../components/ui/use-toast";
import { ArticlesService } from "app/api/sdk.gen";
import { franc } from "franc";
import { Article } from "app/api/types.gen";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";

interface ArticleActionsProps {
  params: { id: string };
  article: Article;
}

export function ArticleActions({ params, article }: ArticleActionsProps) {
  const [translatedContent, setTranslatedContent] = useState("");
  const [summary, setSummary] = useState("");
  const [tagged, setTagged] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [language, setLanguage] = useState("");

  const handleTranslate = async () => {
    if (!language) {
      toast({
        title: "Language not set",
        description: "Please set the language first.",
      });
      return;
    }
    const translatedArticle = await ArticlesService.postArticlesByIdTranslate({
      id: params.id,
      requestBody: {
        language: language,
      },
    });
    let translatedContent =
      language === "english"
        ? translatedArticle.content
        : translatedArticle.contentFr;

    setTranslatedContent(translatedContent);
    toast({
      title: "Article translated",
      description: "Your article has been translated.",
    });
  };

  const handleSummarize = async () => {
    console.log("language: ", language);
    if (!language) {
      toast({
        title: "Language not set",
        description: "Please set the language first.",
      });
      return;
    }
    const summarizedArticle = await ArticlesService.postArticlesByIdSummarize({
      id: params.id,
      requestBody: {
        language: language,
      },
    });

    setSummary(summarizedArticle.summary);
    toast({
      title: "Article summarized",
      description: "Your article has been summarized.",
    });
  };

  const handleTag = async () => {
    if (!language) {
      toast({
        title: "Language not set",
        description: "Please set the language first.",
      });
      return;
    }
    const taggedArticle = await ArticlesService.postArticlesByIdTag({
      id: params.id,
      requestBody: {
        language: language,
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
      setLanguage("french");
    }

    if (
      detectedLanguage === "fra" ||
      detectedLanguage === "fr" ||
      detectedLanguage === "french"
    ) {
      setDetectedLanguage("french");
      setLanguage("english");
    }

    console.log("detectedLanguage: ", detectedLanguage);
    console.log("language: ", language);
  }, [article]);

  useEffect(() => {
    console.log("language: ", language);
    if (!language) {
      toast({
        title: "Language not set",
        description: "Please set the language first.",
      });
    }
  }, [language]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Language</Label>
        <RadioGroup
          name="language"
          value={language}
          onValueChange={(value) => setLanguage(value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="english" id="english" />
            <Label htmlFor="english">English</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="french" id="french" />
            <Label htmlFor="french">French</Label>
          </div>
        </RadioGroup>
      </div>
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
