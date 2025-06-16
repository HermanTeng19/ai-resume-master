'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';

interface PreviewPaneProps {
  html: string | null;
  isLoading: boolean;
}

interface PromptSet {
  id: number;
  title: string;
  content: string;
}

export default function PreviewPane({ html, isLoading }: PreviewPaneProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [promptSets, setPromptSets] = useState<PromptSet[]>([]);

  // 解析HTML内容，提取不同套数的提示词
  useEffect(() => {
    if (html) {
      const sets = parsePromptSets(html);
      setPromptSets(sets);
      setCurrentPage(0); // 重置到第一页
    } else {
      setPromptSets([]);
      setCurrentPage(0);
    }
  }, [html]);

  const parsePromptSets = (content: string): PromptSet[] => {
    const sets: PromptSet[] = [];
    
    // 尝试多种分割方式来识别套数
    // 1. 标准格式：第X套：
    let setRegex = /第(\d+)套[：:]/g;
    let matches: RegExpExecArray[] = [];
    let match;
    
    while ((match = setRegex.exec(content)) !== null) {
      matches.push(match);
    }
    
    // 2. 如果没找到，尝试其他格式：第X套 (空格)
    if (matches.length === 0) {
      setRegex = /第(\d+)套\s/g;
      while ((match = setRegex.exec(content)) !== null) {
        matches.push(match);
      }
    }
    
    // 3. 如果还没找到，尝试更宽松的格式
    if (matches.length === 0) {
      setRegex = /第(\d+)套/g;
      while ((match = setRegex.exec(content)) !== null) {
        matches.push(match);
      }
    }
    
    // 4. 如果仍然没有找到套数标识，检查是否有其他分割标识
    if (matches.length === 0) {
      // 尝试按照"---"分割
      const sections = content.split(/---+/).filter(section => section.trim().length > 0);
      if (sections.length > 1) {
        return sections.map((section, index) => ({
          id: index + 1,
          title: `第${index + 1}套提示词`,
          content: section.trim()
        }));
      }
      
      // 如果没有找到任何分割标识，将整个内容作为一套
      return [{
        id: 1,
        title: '提示词套装',
        content: content
      }];
    }
    
    // 解析找到的套数
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const setNumber = parseInt(match[1]);
      const startIndex = match.index || 0;
      const endIndex = i < matches.length - 1 ? (matches[i + 1].index || content.length) : content.length;
      
      const setContent = content.substring(startIndex, endIndex).trim();
      
      // 尝试多种方式提取标题
      let title = `第${setNumber}套提示词`;
      
      // 方式1：第X套：标题
      let titleMatch = setContent.match(/第\d+套[：:](.+?)(?:\n|$)/);
      if (titleMatch) {
        title = titleMatch[1].trim();
      } else {
        // 方式2：第X套 标题（空格分隔）
        titleMatch = setContent.match(/第\d+套\s+(.+?)(?:\n|$)/);
        if (titleMatch) {
          title = titleMatch[1].trim();
        } else {
          // 方式3：查找**风格特点**或类似标识
          const styleMatch = setContent.match(/\*\*风格特点[：:]\*\*\s*(.+?)(?:\n|$)/);
          if (styleMatch) {
            title = styleMatch[1].trim();
          }
        }
      }
      
      sets.push({
        id: setNumber,
        title: title,
        content: setContent
      });
    }
    
    return sets.sort((a, b) => a.id - b.id);
  };

  const handleDownload = () => {
    if (!html) return;
    
    const blob = new Blob([html], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-sets.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!promptSets.length || !promptSets[currentPage]) return;
    
    const currentSet = promptSets[currentPage];
    try {
      await navigator.clipboard.writeText(currentSet.content);
      toast.success('提示词已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      toast.error('复制失败，请手动选择文本复制');
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(promptSets.length - 1, prev + 1));
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  if (isLoading) {
    return (
      <div className="card h-full flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI正在生成提示词套装...</p>
        </div>
      </div>
    );
  }

  if (!html || promptSets.length === 0) {
    return (
      <div className="card h-full flex items-center justify-center min-h-[500px]">
        <div className="text-center text-gray-500">
          <i className="fas fa-file-alt text-6xl mb-4 text-gray-300"></i>
          <p className="text-lg">在这里预览您的AI生成的简历</p>
          <p className="text-sm">填写左侧表单并点击生成按钮开始</p>
        </div>
      </div>
    );
  }

  const currentSet = promptSets[currentPage];

  return (
    <div className="space-y-4">
      {/* 头部信息 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">提示词预览</h2>
          <p className="text-sm text-gray-600">
            第 {currentPage + 1} 套，共 {promptSets.length} 套
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="btn-primary bg-blue-600 hover:bg-blue-700"
          >
            <i className="fas fa-copy mr-2"></i>
            复制
          </button>
          <button
            onClick={handleDownload}
            className="btn-primary bg-green-600 hover:bg-green-700"
          >
            <i className="fas fa-download mr-2"></i>
            下载提示词
          </button>
        </div>
      </div>
      
      {/* 分页导航 - 顶部 */}
      {promptSets.length > 1 && (
        <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded border border-blue-300 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          
          <div className="flex space-x-1">
            {promptSets.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  index === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === promptSets.length - 1}
            className="px-3 py-1 rounded border border-blue-300 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}
      
      {/* 当前套数内容 */}
      <div className="card">
        <div className="mb-4 pb-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            第{currentSet.id}套：{currentSet.title}
          </h3>
        </div>
        
        <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-ul:text-gray-700 prose-ol:text-gray-700">
          <div className="bg-white p-6 rounded-lg border border-gray-200 overflow-auto max-h-[600px]">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">{children}</h3>,
                h4: ({children}) => <h4 className="text-base font-semibold text-gray-900 mb-2 mt-3">{children}</h4>,
                p: ({children}) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>,
                li: ({children}) => <li className="text-gray-700">{children}</li>,
                strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                code: ({children}) => <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                pre: ({children}) => <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm font-mono mb-4">{children}</pre>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-blue-200 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">{children}</blockquote>,
                hr: () => <hr className="border-gray-300 my-6" />,
                table: ({children}) => <table className="min-w-full border-collapse border border-gray-300 mb-4">{children}</table>,
                th: ({children}) => <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-900">{children}</th>,
                td: ({children}) => <td className="border border-gray-300 px-3 py-2 text-gray-700">{children}</td>,
              }}
            >
              {currentSet.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 分页导航 - 底部 */}
      {promptSets.length > 1 && (
        <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded border border-blue-300 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          
          <span className="text-sm text-gray-600">
            第 {currentPage + 1} 页，共 {promptSets.length} 页
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === promptSets.length - 1}
            className="px-3 py-1 rounded border border-blue-300 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
} 