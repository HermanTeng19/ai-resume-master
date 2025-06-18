'use client';

import React, { useState } from 'react';
import { INDUSTRIES, getIndustryById } from '@/lib/industries';
import { IndustryJobInfo } from '@/lib/types';

interface IndustryJobFormProps {
  selectedIndustry: string;
  selectedJob: string;
  promptSets: number;
  customIndustry?: string;
  customJob?: string;
  isCustomIndustry?: boolean;
  isCustomJob?: boolean;
  onIndustryChange: (industry: string) => void;
  onJobChange: (job: string) => void;
  onPromptSetsChange: (sets: number) => void;
  onCustomIndustryChange?: (customIndustry: string) => void;
  onCustomJobChange?: (customJob: string) => void;
  onCustomIndustryToggle?: (isCustom: boolean) => void;
  onCustomJobToggle?: (isCustom: boolean) => void;
}

export default function IndustryJobForm({ 
  selectedIndustry, 
  selectedJob, 
  promptSets,
  customIndustry = '',
  customJob = '',
  isCustomIndustry = false,
  isCustomJob = false,
  onIndustryChange,
  onJobChange,
  onPromptSetsChange,
  onCustomIndustryChange,
  onCustomJobChange,
  onCustomIndustryToggle,
  onCustomJobToggle
}: IndustryJobFormProps) {

  const handleIndustryChange = (industryId: string) => {
    if (industryId === 'custom') {
      onCustomIndustryToggle?.(true);
      onIndustryChange('');
    } else {
      onCustomIndustryToggle?.(false);
      onIndustryChange(industryId);
      onJobChange(''); // 重置职业选择
      onCustomJobToggle?.(false); // 重置自定义职业状态
    }
  };

  const handleJobChange = (jobId: string) => {
    if (jobId === 'custom') {
      onCustomJobToggle?.(true);
      onJobChange('');
    } else {
      onCustomJobToggle?.(false);
      onJobChange(jobId);
    }
  };

  const availableJobs = selectedIndustry ? getIndustryById(selectedIndustry)?.jobs || [] : [];
  
  // 获取显示用的行业和职业名称
  const getDisplayIndustryName = () => {
    if (isCustomIndustry) return customIndustry;
    return getIndustryById(selectedIndustry)?.name;
  };

  const getDisplayJobName = () => {
    if (isCustomJob) return customJob;
    return availableJobs.find(j => j.id === selectedJob)?.name;
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <i className="fas fa-briefcase mr-2 text-primary-600"></i>
          行业与职业信息
        </h2>
        
        <div className="space-y-4">
          {/* 行业选择 */}
          <div>
            <label className="form-label">目标行业 *</label>
            <select
              className="form-input"
              value={isCustomIndustry ? 'custom' : selectedIndustry}
              onChange={(e) => handleIndustryChange(e.target.value)}
              required
            >
              <option value="">请选择行业</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
              <option value="custom">🎯 自定义行业</option>
            </select>
            
            {/* 自定义行业输入框 */}
            {isCustomIndustry && (
              <div className="mt-3">
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入您的目标行业..."
                  value={customIndustry}
                  onChange={(e) => onCustomIndustryChange?.(e.target.value)}
                  required
                />
                <p className="text-sm text-blue-600 mt-1">
                  <i className="fas fa-lightbulb mr-1"></i>
                  例如：新能源汽车、生物制药、区块链技术等
                </p>
              </div>
            )}
          </div>

          {/* 职业选择 */}
          <div>
            <label className="form-label">目标职业 *</label>
            <select
              className="form-input"
              value={isCustomJob ? 'custom' : selectedJob}
              onChange={(e) => handleJobChange(e.target.value)}
              disabled={!selectedIndustry && !isCustomIndustry}
              required
            >
              <option value="">请选择职业</option>
              {!isCustomIndustry && availableJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.name}
                </option>
              ))}
              <option value="custom">🎯 自定义职业</option>
            </select>
            
            {/* 自定义职业输入框 */}
            {isCustomJob && (
              <div className="mt-3">
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入您的目标职业..."
                  value={customJob}
                  onChange={(e) => onCustomJobChange?.(e.target.value)}
                  required
                />
                <p className="text-sm text-blue-600 mt-1">
                  <i className="fas fa-lightbulb mr-1"></i>
                  例如：AI产品经理、区块链开发工程师、新媒体运营专家等
                </p>
              </div>
            )}
            
            {/* 显示职业描述（仅预设职业） */}
            {selectedJob && !isCustomJob && (
              <p className="text-sm text-gray-600 mt-2">
                <i className="fas fa-info-circle mr-1"></i>
                {availableJobs.find(j => j.id === selectedJob)?.description}
              </p>
            )}
          </div>

          {/* 提示词套数选择 */}
          <div>
            <label className="form-label">提示词套数 *</label>
            <select
              className="form-input"
              value={promptSets}
              onChange={(e) => onPromptSetsChange(Number(e.target.value))}
              required
            >
              <option value={1}>1套</option>
              <option value={2}>2套</option>
              <option value={3}>3套</option>
              <option value={4}>4套</option>
              <option value={5}>5套</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              选择要生成的不同风格提示词套数，每套都会有不同的设计风格
            </p>
          </div>
        </div>
      </div>

      {/* 预览信息 */}
      {((selectedIndustry || isCustomIndustry) && (selectedJob || isCustomJob)) && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">
            <i className="fas fa-eye mr-2"></i>
            生成预览
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>目标行业：</strong> 
              {getDisplayIndustryName()}
              {isCustomIndustry && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">自定义</span>}
            </p>
            <p>
              <strong>目标职业：</strong> 
              {getDisplayJobName()}
              {isCustomJob && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">自定义</span>}
            </p>
            <p><strong>生成套数：</strong> {promptSets}套不同风格的提示词</p>
          </div>
          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <p className="text-blue-700 text-sm">
              <i className="fas fa-magic mr-1"></i>
              将生成：聚焦<strong>{getDisplayIndustryName()}</strong>的<strong>{getDisplayJobName()}</strong>，
              结合预设提示词生成<strong>{promptSets}套</strong>不同风格的页面设计提示词
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 