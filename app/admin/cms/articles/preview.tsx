'use client';

import { useEffect, useState } from 'react';

interface ArticleForm {
  title: string;
  category: string;
  author: string;
  content: string;
  excerpt: string;
}

export default function PreviewPage() {
  const [data, setData] = useState<ArticleForm | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('preview-article');
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  if (!data) {
    return <div className="text-center mt-10">No preview data found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10">

      <article className="prose prose-lg max-w-none">

        <h1>{data.title}</h1>

        <p className="text-gray-500">
          {data.category} • {data.author}
        </p>

        <div
          dangerouslySetInnerHTML={{ __html: data.content }}
        />

        <hr />

        <p className="text-sm text-gray-400">{data.excerpt}</p>

      </article>

    </div>
  );
}