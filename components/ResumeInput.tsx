'use client';

import React, { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ResumeContent } from '@/lib/types';

interface ResumeInputProps {
  resumeContent: ResumeContent | null;
  onResumeChange: (content: ResumeContent | null) => void;
}

export default function ResumeInput({ resumeContent, onResumeChange }: ResumeInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 处理文本输入
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.trim()) {
      onResumeChange({
        content,
        fileType: 'text'
      });
    } else {
      onResumeChange(null);
    }
  };

  // 处理文件读取
  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let content = '';
      let fileType: 'text' | 'markdown' | 'pdf' = 'text';

      if (fileExtension === 'pdf') {
        content = await extractPDFText(file);
        fileType = 'pdf';
      } else if (fileExtension === 'md') {
        content = await readTextFile(file);
        fileType = 'markdown';
      } else if (fileExtension === 'txt') {
        content = await readTextFile(file);
        fileType = 'text';
      } else {
        throw new Error('不支持的文件格式。请上传 .txt、.md 或 .pdf 文件。');
      }

      if (content.trim()) {
        onResumeChange({
          content: content.trim(),
          fileName: file.name,
          fileType
        });
        
        // 更新textarea显示内容
        if (textareaRef.current) {
          textareaRef.current.value = content.trim();
        }
        
        toast.success(`文件 "${file.name}" 上传成功`);
      } else {
        throw new Error('文件内容为空或无法读取');
      }
    } catch (error) {
      console.error('文件处理错误:', error);
      toast.error(error instanceof Error ? error.message : '文件处理失败');
    } finally {
      setIsProcessing(false);
    }
  };

  // 读取文本文件
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file, 'UTF-8');
    });
  };

  // 提取PDF文本
  const extractPDFText = async (file: File): Promise<string> => {
    let pdfjsLib: any = null;
    
    try {
      // 动态导入pdfjs-dist
      pdfjsLib = await import('pdfjs-dist');
      
      // 设置worker路径 - 使用更稳定的CDN
      if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
      }

      const arrayBuffer = await file.arrayBuffer();
      
      // 创建PDF文档时添加错误处理
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        // 禁用一些可能导致问题的功能
        disableAutoFetch: true,
        disableStream: true,
        disableRange: true
      });
      
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      // 逐页提取文本
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str || '')
            .join(' ');
          fullText += pageText + '\n';
          
          // 清理页面资源
          page.cleanup();
        } catch (pageError) {
          console.warn(`页面 ${i} 处理失败:`, pageError);
          // 继续处理其他页面
        }
      }
      
      // 清理PDF资源
      pdf.destroy();
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF解析错误:', error);
      
      // 如果是Worker相关错误，提供更友好的错误信息
      if (error instanceof Error && error.message.includes('worker')) {
        throw new Error('PDF处理服务暂时不可用，请尝试将PDF转换为文本后重新上传');
      }
      
      throw new Error('PDF文件解析失败，请确保文件未损坏或尝试其他格式');
    }
  };

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // 处理拖拽
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  // 清除内容
  const handleClear = () => {
    onResumeChange(null);
    if (textareaRef.current) {
      textareaRef.current.value = '';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('简历内容已清除');
  };

  // 点击上传区域
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          <i className="fas fa-file-text mr-2 text-primary-600"></i>
          简历内容
        </h2>
        <p className="text-gray-600">
          请输入或上传您的简历内容，支持直接输入、粘贴文本或上传文件。
        </p>
      </div>

      {/* 文本输入区域 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          简历内容
        </label>
        <textarea
          ref={textareaRef}
          placeholder="请在此处输入或粘贴您的简历内容..."
          className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 resize-vertical"
          onChange={handleTextChange}
          disabled={isProcessing}
        />
      </div>

      {/* 文件上传区域 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          或上传文件
        </label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.pdf"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
              <p className="text-sm text-gray-600">正在处理文件...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
              <p className="text-sm text-gray-600 mb-1">
                点击选择文件或拖拽文件到此处
              </p>
              <p className="text-xs text-gray-500">
                支持 .txt、.md、.pdf 格式
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 当前文件信息 */}
      {resumeContent && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-600 mr-2"></i>
              <div>
                <p className="text-sm font-medium text-green-800">
                  {resumeContent.fileName ? `文件: ${resumeContent.fileName}` : '文本输入'}
                </p>
                <p className="text-xs text-green-600">
                  内容长度: {resumeContent.content.length} 字符
                  {resumeContent.fileType && ` | 类型: ${resumeContent.fileType}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="text-red-600 hover:text-red-800 text-sm"
              title="清除内容"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><i className="fas fa-info-circle mr-1"></i> 支持的格式：</p>
        <ul className="ml-4 space-y-1">
          <li>• <strong>.txt</strong> - 纯文本格式</li>
          <li>• <strong>.md</strong> - Markdown格式</li>
          <li>• <strong>.pdf</strong> - PDF文档（自动提取文本）</li>
        </ul>
        <p className="mt-2">
          <i className="fas fa-lightbulb mr-1"></i> 
          建议使用结构化的简历格式，包含个人信息、工作经历、技能等部分。
        </p>
      </div>
    </div>
  );
} 