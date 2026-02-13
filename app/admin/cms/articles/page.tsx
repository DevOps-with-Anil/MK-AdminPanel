'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Eye, Heart, MessageCircle, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Article } from '@/lib/types';
import { getLocalizedText, initializeMultiLang } from '@/i18n/langHelper';
import MultiLangInput from '@/components/common/MultiLangInput';
import { Label } from '@/components/ui/label';

const mockArticles: Article[] = [
  {
    id: 'ART001',
    title: { en: 'Understanding Islamic Finance', hi: 'इस्लामिक वित्त को समझना', ar: 'فهم التمويل الإسلامي' },
    content: { en: 'Article content...', hi: 'लेख सामग्री...', ar: 'محتوى المقالة...' },
    category: 'islamic-studies',
    tags: ['finance', 'education'],
    featuredImage: '/images/article-1.jpg',
    author: 'Ahmed Khan',
    published: true,
    publishedAt: new Date().toISOString(),
    likes: 245,
    comments: 12,
    views: 1200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ART002',
    title: { en: 'Web Development Basics', hi: 'वेब विकास की मूल बातें', ar: 'أساسيات تطوير الويب' },
    content: { en: 'Article content...', hi: 'लेख सामग्री...', ar: 'محتوى المقالة...' },
    category: 'technology',
    tags: ['web', 'coding'],
    featuredImage: '/images/article-2.jpg',
    author: 'Fatima Ali',
    published: false,
    likes: 89,
    comments: 5,
    views: 340,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function ArticlesPageContent() {
  const { currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = articles.filter(
    (article) =>
      getLocalizedText(article.title, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddArticle = () => {
    setEditingArticle(null);
    setIsFormOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter(a => a.id !== articleId));
    }
  };

  const handleTogglePublish = (article: Article) => {
    setArticles(
      articles.map(a =>
        a.id === article.id
          ? { ...a, published: !a.published, publishedAt: !a.published ? new Date().toISOString() : undefined }
          : a
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <BookOpen className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Articles & News</h1>
            <p className="text-muted-foreground">Manage and publish articles with comments and likes</p>
          </div>
        </div>
        <Button onClick={handleAddArticle} className="gap-2">
          <Plus className="w-4 h-4" />
          New Article
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
              <CardDescription>{filteredArticles.length} article(s) found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No articles found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredArticles.map((article) => (
                        <TableRow
                          key={article.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{getLocalizedText(article.title, currentLanguage)}</p>
                              <p className="text-xs text-muted-foreground">{article.category}</p>
                            </div>
                          </TableCell>
                          <TableCell>{article.author}</TableCell>
                          <TableCell>
                            <Badge className={article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {article.published ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Eye className="w-4 h-4" />
                              {article.views}
                            </div>
                          </TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditArticle(article);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteArticle(article.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-0">
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedArticle ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-semibold">{getLocalizedText(selectedArticle.title, currentLanguage)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Author</p>
                    <p className="text-sm">{selectedArticle.author}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 font-semibold">
                        <Eye className="w-4 h-4" />
                        {selectedArticle.views}
                      </div>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 font-semibold">
                        <Heart className="w-4 h-4" />
                        {selectedArticle.likes}
                      </div>
                      <p className="text-xs text-muted-foreground">Likes</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 font-semibold">
                        <MessageCircle className="w-4 h-4" />
                        {selectedArticle.comments}
                      </div>
                      <p className="text-xs text-muted-foreground">Comments</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleTogglePublish(selectedArticle)}
                  >
                    {selectedArticle.published ? 'Unpublish' : 'Publish'}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Select an article to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Article Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? 'Edit Article' : 'Create New Article'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <MultiLangInput
              label="Article Title"
              value={editingArticle?.title || initializeMultiLang()}
              onChange={() => {}}
            />
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                defaultValue={editingArticle?.author}
                placeholder="Author name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                defaultValue={editingArticle?.category}
                placeholder="e.g., islamic-studies"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button className="flex-1">Save Article</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <ArticlesPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
