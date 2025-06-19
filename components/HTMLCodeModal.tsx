'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">AI正在生成HTML代码...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-red-600">
                <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p className="text-lg font-medium mb-2">生成失败</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={handleRegenerateHTML}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  重试
                </button>
              </div>
            </div>
          ) : htmlCode ? (
            <div className="h-full flex">
              {/* 代码视图 */}
              {!isPreviewMode && (
                <div className="w-full h-full overflow-auto p-4">
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto h-full">
                    <code className="language-html">{htmlCode}</code>
                  </pre>
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
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <i className="fas fa-file-code text-6xl mb-4 text-gray-300"></i>
                <p className="text-lg">准备生成HTML代码</p>
                <p className="text-sm">正在初始化...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 