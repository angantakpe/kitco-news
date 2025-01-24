"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { toast } from "../../../components/ui/use-toast";
import { BilingualPreview } from "../../components/bilingual-preview";
import { ArticleActions } from "./../../components/article-actions";
import { ArticlesService } from "../../api/sdk.gen";
import { Article } from "../../api/types.gen";

// interface TagsInputProps {
//   value: string[];
//   onChange: (tags: string[]) => void;
// }

// const TagsInput: React.FC<TagsInputProps> = ({ value, onChange }) => {
//   const [inputValue, setInputValue] = useState("");

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const handleAddTag = () => {
//     if (inputValue.trim() && !value.includes(inputValue.trim())) {
//       onChange([...value, inputValue.trim()]);
//       setInputValue("");
//     }
//   };

//   const handleRemoveTag = (tag: string) => {
//     onChange(value.filter((t) => t !== tag));
//   };

//   return (
//     <div>
//       <div>
//         {value.map((tag, index) => (
//           <span key={index} style={{ marginRight: "8px" }}>
//             {tag}
//             <button type="button" onClick={() => handleRemoveTag(tag)}>
//               &times;
//             </button>
//           </span>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={inputValue}
//         onChange={handleInputChange}
//         placeholder="Add a tag"
//       />
//       <button type="button" onClick={handleAddTag}>
//         Add Tag
//       </button>
//     </div>
//   );
// };

export default function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [article, setArticle] = useState<Article>({
    title: "",
    titleFr: "",
    content: "",
    contentFr: "",
    summary: "",
    status: "draft",
    category: "",
    tags: [],
    author: "",
  });

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await ArticlesService.getArticlesById({
        id: params.id,
      });
      if (!response) {
        throw new Error("Failed to fetch article");
      }

      console.log("Fetching article RESPONSE: ", response);

      setArticle({
        title: response.title,
        titleFr: response.titleFr,
        content: response.content,
        contentFr: response.contentFr,
        summary: response.summary,
        status: response.status || "draft",
        category: response.category || "",
        tags: response.tags || [],
        author: response.author || "",
      });
    };
    fetchArticle();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ArticlesService.patchArticlesById({
        id: params.id,
        requestBody: article,
      });

      if (!response) {
        throw new Error("Failed to update article");
      }

      toast({
        title: "Article updated",
        description: "Your article has been successfully updated.",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  // const handleTagsChange = (tags: string[]) => {
  //   setArticle((prevArticle) => ({
  //     ...prevArticle,
  //     tags,
  //   }));
  // };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            value={article.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            value={article.content}
            onChange={handleChange}
            required
            rows={10}
          />
        </div>
        {/* <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={article.tags}
            onChange={handleChange}
            placeholder="technology, science, politics"
          /> */}
        {/* </div> */}

        {/* <TagsInput value={article.tags} onChange={handleTagsChange} />
        <div>
          <Label>Language</Label>
          <RadioGroup
            name="language"
            value={article.language}
            onValueChange={(value) =>
              setArticle((prev) => ({ ...prev, language: value }))
            }
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
        </div> */}
        <Button type="submit">Update Article</Button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Article Preview</h2>
        <BilingualPreview article={article} />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Article Actions</h2>
        <ArticleActions params={params} article={article} />
      </div>
    </div>
  );
}
