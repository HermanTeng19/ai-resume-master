'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import IndustryJobForm from '@/components/IndustryJobForm';
import ModelSelector from '@/components/ModelSelector';
import GenerateButton from '@/components/GenerateButton';
import PreviewPane from '@/components/PreviewPane';
import ResumeInput from '@/components/ResumeInput';
import { getDefaultModel } from '@/lib/models';
import { getIndustryById } from '@/lib/industries';
import { IndustryJobInfo, ResumeContent } from '@/lib/types';

export default function HomePage() {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState<{model?: string, generatedAt?: string} | null>(null);
  const [selectedModel, setSelectedModel] = useState(getDefaultModel().id);
  
  // 表单状态
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [promptSets, setPromptSets] = useState(3);
  const [resumeContent, setResumeContent] = useState<ResumeContent | null>(null);

  const handleGeneratePromptSets = async () => {
    if (!selectedIndustry || !selectedJob) {
      toast.error('请选择行业和职业');
      return;
    }

    const industry = getIndustryById(selectedIndustry);
    const job = industry?.jobs.find(j => j.id === selectedJob);

    if (!industry || !job) {
      toast.error('选择的行业或职业无效');
      return;
    }

    const industryJobInfo: IndustryJobInfo = {
      industry: industry.name,
      job: job.name,
      promptSets
    };
    setIsLoading(true);
    setGeneratedContent(null);
    setModelInfo(null);

    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industryJobInfo,
          resumeContent,
          selectedModel,
        }),
      }).catch(fetchError => {
        console.error('Network request failed:', fetchError);
        throw new Error('网络请求失败，请检查网络连接');
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json().catch(jsonError => {
        console.error('Failed to parse response JSON:', jsonError);
        throw new Error('服务器响应格式错误');
      });

      if (data.success) {
        setGeneratedContent(data.html);
        setModelInfo({
          model: data.model,
          generatedAt: data.generatedAt
        });
        toast.success(`提示词套装生成成功！由 ${data.model || 'AI'} 生成`);
      } else {
        toast.error(data.error || '生成失败，请重试。');
        console.error('Prompt sets generation failed:', data.error);
      }
    } catch (error) {
      console.error('Error generating prompt sets:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      toast.error(`生成失败：${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                <i className="fas fa-robot mr-2 text-primary-600"></i>
                AI提示词生成器
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              使用AI技术生成行业专属提示词套装
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="card">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  生成提示词套装
                </h2>
                <p className="text-gray-600">
                  选择目标行业和职业，AI将为您生成多套不同风格的提示词。
                </p>
              </div>
            </div>
            
            <IndustryJobForm 
              selectedIndustry={selectedIndustry}
              selectedJob={selectedJob}
              promptSets={promptSets}
              onIndustryChange={setSelectedIndustry}
              onJobChange={setSelectedJob}
              onPromptSetsChange={setPromptSets}
            />
            
            <ResumeInput
              resumeContent={resumeContent}
              onResumeChange={setResumeContent}
            />
            
            <ModelSelector
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
            
            <GenerateButton
              onGenerate={handleGeneratePromptSets}
              isLoading={isLoading}
              disabled={!selectedIndustry || !selectedJob}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <PreviewPane html={generatedContent} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p className="mb-2">
              <i className="fas fa-magic mr-1"></i>
              基于AI技术的智能提示词生成器
            </p>
            <p className="text-sm">
              支持Google Gemini和DeepSeek等先进AI模型，生成行业专属提示词套装
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 