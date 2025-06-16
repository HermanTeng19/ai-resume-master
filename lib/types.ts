export interface IndustryJobInfo {
  industry: string;
  job: string;
  promptSets: number;
}

// 保留原有接口以兼容现有代码
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  socialLinks: SocialLink[];
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  languages?: string[];
  certifications?: string[];
  interests?: string[];
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  provider: string;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'high' | 'medium' | 'low';
}

export interface ResumeContent {
  content: string;
  fileName?: string;
  fileType?: 'text' | 'markdown' | 'pdf';
}

export interface GenerateResumeRequest {
  industryJobInfo: IndustryJobInfo;
  resumeContent?: ResumeContent;
  selectedModel?: string;
}

export interface GenerateResumeResponse {
  success: boolean;
  html?: string;
  error?: string;
  model?: string; // AI模型信息
  generatedAt?: string; // 生成时间
  metadata?: {
    requestLength: number;
    aiResponseLength: number;
    finalLength: number;
    detectedSets: number;
    expectedSets: number;
    hasResumeContent: boolean;
  };
} 