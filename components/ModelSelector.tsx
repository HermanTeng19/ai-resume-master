'use client';

import React from 'react';
import { AIModel } from '@/lib/types';
import { AVAILABLE_MODELS } from '@/lib/models';

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

export default function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'slow': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-purple-600 bg-purple-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <i className="fas fa-robot mr-2 text-primary-600"></i>
        AI模型选择
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_MODELS.map((model: AIModel) => (
          <div
            key={model.id}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
              selectedModel === model.id
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => onModelSelect(model.id)}
          >
            {/* 选中状态指示器 */}
            {selectedModel === model.id && (
              <div className="absolute top-2 right-2">
                <i className="fas fa-check-circle text-primary-500 text-lg"></i>
              </div>
            )}

            {/* 模型图标和名称 */}
            <div className="flex items-start mb-3">
              <div className="flex-shrink-0 mr-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedModel === model.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <i className={model.icon}></i>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{model.name}</h3>
                <p className="text-sm text-gray-500">{model.provider}</p>
              </div>
            </div>

            {/* 模型描述 */}
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
              {model.description}
            </p>

            {/* 性能标签 */}
            <div className="flex gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSpeedColor(model.speed)}`}>
                <i className="fas fa-tachometer-alt mr-1"></i>
                速度: {model.speed === 'fast' ? '快' : model.speed === 'medium' ? '中' : '慢'}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(model.quality)}`}>
                <i className="fas fa-star mr-1"></i>
                质量: {model.quality === 'high' ? '高' : model.quality === 'medium' ? '中' : '低'}
              </span>
            </div>

            {/* 推荐标签 */}
            {model.id === 'gemini' && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-700 bg-green-100">
                  <i className="fas fa-thumbs-up mr-1"></i>
                  推荐
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 提示信息 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <i className="fas fa-info-circle text-blue-500 mt-0.5 mr-2"></i>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">选择提示：</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Google Gemini 2.0 Flash</strong>：响应速度快，适合快速生成简历</li>
              <li><strong>DeepSeek V3</strong>：推理能力强，适合生成详细内容</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 