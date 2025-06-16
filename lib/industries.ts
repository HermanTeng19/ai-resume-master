export interface Industry {
  id: string;
  name: string;
  jobs: Job[];
}

export interface Job {
  id: string;
  name: string;
  description: string;
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'finance',
    name: '金融业',
    jobs: [
      { id: 'data-engineer', name: '数据工程师', description: '负责数据架构设计和数据处理' },
      { id: 'quantitative-analyst', name: '量化分析师', description: '进行金融数据分析和建模' },
      { id: 'risk-manager', name: '风险管理师', description: '评估和管理金融风险' },
      { id: 'financial-analyst', name: '金融分析师', description: '分析投资机会和财务状况' },
      { id: 'product-manager', name: '产品经理', description: '负责金融产品的设计和管理' }
    ]
  },
  {
    id: 'technology',
    name: '科技行业',
    jobs: [
      { id: 'software-engineer', name: '软件工程师', description: '开发和维护软件系统' },
      { id: 'data-scientist', name: '数据科学家', description: '从数据中提取洞察和价值' },
      { id: 'ai-engineer', name: 'AI工程师', description: '开发人工智能和机器学习系统' },
      { id: 'frontend-developer', name: '前端开发工程师', description: '开发用户界面和交互体验' },
      { id: 'backend-developer', name: '后端开发工程师', description: '开发服务器端逻辑和API' }
    ]
  },
  {
    id: 'healthcare',
    name: '医疗健康',
    jobs: [
      { id: 'medical-data-analyst', name: '医疗数据分析师', description: '分析医疗数据和健康趋势' },
      { id: 'health-informatics', name: '健康信息学专家', description: '管理和分析健康信息系统' },
      { id: 'clinical-researcher', name: '临床研究员', description: '进行医学研究和临床试验' },
      { id: 'biomedical-engineer', name: '生物医学工程师', description: '开发医疗设备和技术' },
      { id: 'health-product-manager', name: '健康产品经理', description: '管理医疗健康产品' }
    ]
  },
  {
    id: 'education',
    name: '教育行业',
    jobs: [
      { id: 'education-data-analyst', name: '教育数据分析师', description: '分析学习数据和教育效果' },
      { id: 'instructional-designer', name: '教学设计师', description: '设计和开发教学内容' },
      { id: 'edtech-developer', name: '教育技术开发者', description: '开发教育技术产品' },
      { id: 'curriculum-specialist', name: '课程专家', description: '设计和优化课程体系' },
      { id: 'learning-analyst', name: '学习分析师', description: '分析学习行为和效果' }
    ]
  },
  {
    id: 'ecommerce',
    name: '电商零售',
    jobs: [
      { id: 'ecommerce-analyst', name: '电商数据分析师', description: '分析用户行为和销售数据' },
      { id: 'growth-hacker', name: '增长黑客', description: '通过数据驱动用户增长' },
      { id: 'supply-chain-analyst', name: '供应链分析师', description: '优化供应链和物流' },
      { id: 'marketing-analyst', name: '营销分析师', description: '分析营销效果和ROI' },
      { id: 'user-experience-researcher', name: 'UX研究员', description: '研究用户体验和行为' }
    ]
  },
  {
    id: 'manufacturing',
    name: '制造业',
    jobs: [
      { id: 'industrial-engineer', name: '工业工程师', description: '优化生产流程和效率' },
      { id: 'quality-analyst', name: '质量分析师', description: '分析和改进产品质量' },
      { id: 'operations-researcher', name: '运营研究员', description: '优化运营决策和流程' },
      { id: 'process-engineer', name: '工艺工程师', description: '设计和改进生产工艺' },
      { id: 'maintenance-engineer', name: '维护工程师', description: '设备维护和故障分析' }
    ]
  }
];

export const getIndustryById = (id: string): Industry | undefined => {
  return INDUSTRIES.find(industry => industry.id === id);
};

export const getJobById = (industryId: string, jobId: string): Job | undefined => {
  const industry = getIndustryById(industryId);
  return industry?.jobs.find(job => job.id === jobId);
};

export const getAllJobs = (): Job[] => {
  return INDUSTRIES.flatMap(industry => industry.jobs);
}; 