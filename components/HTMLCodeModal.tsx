'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface HTMLCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptContent: string;
  selectedModel: string;
}

export default function HTMLCodeModal({ isOpen, onClose, promptContent, selectedModel }: HTMLCodeModalProps) {
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && promptContent) {
      generateHTMLCode();
    }
    // 重置状态
    if (isOpen) {
      setIsPreviewMode(false);
      setError('');
    }
  }, [isOpen, promptContent]);

  const generateHTMLCode = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptContent,
          selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setHtmlCode(data.htmlCode);
        toast.success('HTML代码生成成功！');
      } else {
        setError(data.error || 'HTML代码生成失败');
        toast.error(data.error || 'HTML代码生成失败');
      }
    } catch (error) {
      console.error('Error generating HTML code:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setError(`生成失败：${errorMessage}`);
      toast.error(`生成失败：${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!htmlCode) return;
    
    try {
      await navigator.clipboard.writeText(htmlCode);
      toast.success('HTML代码已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      toast.error('复制失败，请手动选择文本复制');
    }
  };

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleRegenerateHTML = () => {
    generateHTMLCode();
  };

  const handleDownloadHTML = () => {
    if (!htmlCode) return;
    
    try {
      const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-generated-resume.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('HTML文件已下载到本地');
    } catch (error) {
      console.error('下载失败:', error);
      toast.error('下载失败，请重试');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <i className="fas fa-code mr-2 text-primary-600"></i>
            <h2 className="text-xl font-semibold text-gray-900">HTML代码生成器</h2>
          </div>
          <div className="flex items-center space-x-2">
            {htmlCode && (
              <>
                <button
                  onClick={handlePreviewToggle}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isPreviewMode 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <i className={`fas ${isPreviewMode ? 'fa-code' : 'fa-eye'} mr-1`}></i>
                  {isPreviewMode ? '代码' : '预览'}
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-copy mr-1"></i>
                  复制
                </button>
                <button
                  onClick={handleDownloadHTML}
                  className="px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  <i className="fas fa-download mr-1"></i>
                  下载
                </button>
                <button
                  onClick={handleRegenerateHTML}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-redo'} mr-1`}></i>
                  重新生成
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden">
                     {isLoading ? (
             <div className="h-full flex items-center justify-center bg-gray-900">
               <div className="text-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                 <p className="text-gray-300">AI正在生成HTML代码...</p>
                 <p className="text-gray-500 text-sm mt-2">正在调用 {selectedModel === 'gemini' ? 'Google Gemini' : 'DeepSeek'} 模型...</p>
               </div>
             </div>
                     ) : error ? (
             <div className="h-full flex items-center justify-center bg-gray-900">
               <div className="text-center">
                 <i className="fas fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
                 <p className="text-lg font-medium mb-2 text-red-300">生成失败</p>
                 <p className="text-sm text-gray-400 mb-4">{error}</p>
                 <button
                   onClick={handleRegenerateHTML}
                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                 >
                   <i className="fas fa-redo mr-2"></i>
                   重试
                 </button>
               </div>
             </div>
          ) : htmlCode ? (
            <div className="h-full flex">
              {/* 代码视图 */}
              {!isPreviewMode && (
                <div className="w-full h-full overflow-auto">
                  <SyntaxHighlighter
                    language="html"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      height: '100%',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      borderRadius: '0',
                      background: '#1e1e1e',
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                    wrapLongLines={true}
                    lineNumberStyle={{
                      minWidth: '3em',
                      paddingRight: '1em',
                      color: '#858585',
                      backgroundColor: '#1e1e1e',
                    }}
                  >
                    {htmlCode}
                  </SyntaxHighlighter>
                </div>
              )}
              
              {/* 预览视图 */}
              {isPreviewMode && (
                <div className="w-full h-full overflow-auto bg-white">
                  <iframe
                    srcDoc={htmlCode}
                    className="w-full h-full border-0"
                    title="HTML Preview"
                    sandbox="allow-scripts allow-forms allow-same-origin"
                  />
                </div>
              )}
            </div>
                     ) : (
             <div className="h-full flex items-center justify-center bg-gray-900">
               <div className="text-center">
                 <i className="fas fa-file-code text-6xl mb-4 text-gray-600"></i>
                 <p className="text-lg text-gray-300">准备生成HTML代码</p>
                 <p className="text-sm text-gray-500">正在初始化...</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
} 