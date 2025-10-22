import { AIModel } from './types';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'gemini',
    name: 'Google Gemini 2.5 Flash',
    description: 'Google最新的Gemini 2.5 Flash模型，速度快，质量高，适合快速生成专业简历',
    icon: 'fas fa-bolt',
    provider: 'Google',
    speed: 'fast',
    quality: 'high'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek V3.1',
    description: 'DeepSeek V3.1 付费模型，具有强大的推理能力和高质量输出，适合生成专业的提示词内容',
    icon: 'fas fa-brain',
    provider: 'OpenRouter',
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