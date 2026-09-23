import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Helper to remove YAML frontmatter from raw markdown
function stripFrontmatter(markdown) {
  if (markdown.startsWith('---')) {
    const endMatch = markdown.indexOf('---', 3);
    if (endMatch !== -1) {
      return markdown.substring(endMatch + 3).trim();
    }
  }
  return markdown;
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;
  
  const cleanContent = stripFrontmatter(content);

  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}
