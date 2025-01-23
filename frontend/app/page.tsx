import { ArticleList } from "./components/article-list";
import { MarketData } from "./components/market-data";
import { SearchBar } from "./components/search-bar";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Article Management Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SearchBar />
          <ArticleList />
        </div>
        <div>
          <MarketData />
        </div>
      </div>
    </div>
  );
}
