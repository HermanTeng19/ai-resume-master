'use client';

import React, { useState } from 'react';
import { INDUSTRIES, getIndustryById } from '@/lib/industries';
import { IndustryJobInfo } from '@/lib/types';

interface IndustryJobFormProps {
  selectedIndustry: string;
  selectedJob: string;
  promptSets: number;
  onIndustryChange: (industry: string) => void;
  onJobChange: (job: string) => void;
  onPromptSetsChange: (sets: number) => void;
}

export default function IndustryJobForm({ 
  selectedIndustry, 
  selectedJob, 
  promptSets,
  onIndustryChange,
  onJobChange,
  onPromptSetsChange
}: IndustryJobFormProps) {

  const handleIndustryChange = (industryId: string) => {
    onIndustryChange(industryId);
    onJobChange(''); // 重置职业选择
  };

  const availableJobs = selectedIndustry ? getIndustryById(selectedIndustry)?.jobs || [] : [];

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
              value={selectedIndustry}
              onChange={(e) => handleIndustryChange(e.target.value)}
              required
            >
              <option value="">请选择行业</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.name}
                </option>
              ))}
            </select>
          </div>

          {/* 职业选择 */}
          <div>
            <label className="form-label">目标职业 *</label>
            <select
              className="form-input"
              value={selectedJob}
              onChange={(e) => onJobChange(e.target.value)}
              disabled={!selectedIndustry}
              required
            >
              <option value="">请选择职业</option>
              {availableJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.name}
                </option>
              ))}
            </select>
            {selectedJob && (
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
      {selectedIndustry && selectedJob && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">
            <i className="fas fa-eye mr-2"></i>
            生成预览
          </h3>
          <div className="space-y-2 text-sm">
            <p><strong>目标行业：</strong> {getIndustryById(selectedIndustry)?.name}</p>
            <p><strong>目标职业：</strong> {availableJobs.find(j => j.id === selectedJob)?.name}</p>
            <p><strong>生成套数：</strong> {promptSets}套不同风格的提示词</p>
          </div>
          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <p className="text-blue-700 text-sm">
              <i className="fas fa-magic mr-1"></i>
              将生成：聚焦<strong>{getIndustryById(selectedIndustry)?.name}</strong>的<strong>{availableJobs.find(j => j.id === selectedJob)?.name}</strong>，
              结合预设提示词生成<strong>{promptSets}套</strong>不同风格的页面设计提示词
            </p>
          </div>
        </div>
      )}


      </div>
    );
  } 