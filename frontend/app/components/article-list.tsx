"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../components/ui/use-toast";
import { ArticlesService } from "../api/sdk.gen";
import { Article } from "../api/types.gen";
import { franc } from "franc";

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("date");
  const [filterLanguage, setFilterLanguage] = useState("all");

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
      );
    }
    return a[sortBy].localeCompare(b[sortBy]);
  });

  const filteredArticles = sortedArticles.filter((article) => {
    const detectedLanguage = franc(article.title || article.content || "");

    if (filterLanguage === "all") {
      return true;
    }
    if (filterLanguage === "fr") {
      return detectedLanguage === "fra";
    }
    if (filterLanguage === "en") {
      return detectedLanguage === "eng";
    }
    return false;
  });

  const handleDelete = async (id: string) => {
    const response = await ArticlesService.deleteArticlesById({
      id: id,
    });
    toast({
      title: "Article deleted",
      description: "The article has been successfully deleted.",
    });
    setArticles(articles.filter((article) => article.id !== id));
  };

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is still mounted

    const fetchArticles = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const response = await ArticlesService.getArticles();
        console.log("\n\nResponse: ", response);

        if (isMounted) {
          setArticles(
            Array.isArray(response?.results) ? response?.results : []
          ); // Ensure we set an array
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("An error occurred while fetching articles");
          setLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      isMounted = false; // Cleanup to prevent setting state if the component unmounts
    };
  }, []);

  if (loading) {
    return <div>Loading articles...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterLanguage} onValueChange={setFilterLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">French</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Content</TableHead>
            {/* <TableHead>Language</TableHead> */}
            <TableHead>Tags</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredArticles.map((article, index) => (
            <TableRow key={index}>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.author}</TableCell>
              <TableCell>{article.content}</TableCell>
              {/* <TableCell>
                {article.language === "en" ? "English" : "French"}
              </TableCell> */}
              <TableCell>
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="mr-1">
                    {tag}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <div className="button-group">
                  <Link href={`/edit/${article.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
                <div className="button-group mt-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
