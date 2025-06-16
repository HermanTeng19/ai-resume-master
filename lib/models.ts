import { AIModel } from './types';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'gemini',
    name: 'Google Gemini 2.5 Flash Preview',
    description: '最新的Google AI模型，速度快，质量高，适合快速生成专业简历',
    icon: 'fas fa-bolt',
    provider: 'Google',
    speed: 'fast',
    quality: 'high'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek V3',
    description: '强大的开源模型，推理能力强，速度快，适合生成详细的提示词内容',
    icon: 'fas fa-brain',
    provider: 'Siliconflow',
    speed: 'fast',
    quality: 'high'
  }
];

export const getModelById = (id: string): AIModel | undefined => {
  return AVAILABLE_MODELS.find(model => model.id === id);
};

export const getDefaultModel = (): AIModel => {
  return AVAILABLE_MODELS[0]; // 默认使用Gemini
}; 