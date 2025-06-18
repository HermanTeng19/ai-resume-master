import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AIService } from '@/lib/ai-service';
import { generateAIRequest, assembleFinalPrompts } from '@/lib/prompts';
import { GenerateResumeRequest, GenerateResumeResponse } from '@/lib/types';

// Validation schemas
const IndustryJobInfoSchema = z.object({
  industry: z.string(),
  job: z.string(),
  promptSets: z.number().min(1).max(5, 'Prompt sets must be between 1 and 5'),
  customIndustry: z.string().optional(),
  customJob: z.string().optional(),
  isCustomIndustry: z.boolean().optional(),
  isCustomJob: z.boolean().optional(),
}).refine((data) => {
  // 验证行业信息
  const hasValidIndustry = data.isCustomIndustry 
    ? (data.customIndustry && data.customIndustry.trim().length > 0)
    : (data.industry && data.industry.trim().length > 0);
  
  // 验证职业信息
  const hasValidJob = data.isCustomJob
    ? (data.customJob && data.customJob.trim().length > 0)
    : (data.job && data.job.trim().length > 0);
  
  return hasValidIndustry && hasValidJob;
}, {
  message: 'Industry and job information are required (either selected or custom input)'
});

const ResumeContentSchema = z.object({
  content: z.string().min(1, 'Resume content is required'),
  fileName: z.string().optional(),
  fileType: z.enum(['text', 'markdown', 'pdf']).optional(),
});

const GenerateResumeRequestSchema = z.object({
  industryJobInfo: IndustryJobInfoSchema,
  resumeContent: ResumeContentSchema.optional(),
  selectedModel: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validationResult = GenerateResumeRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data: ' + validationResult.error.errors.map(e => e.message).join(', ')
      } as GenerateResumeResponse, { status: 400 });
    }

    const { industryJobInfo, resumeContent, selectedModel } = validationResult.data as GenerateResumeRequest;

    console.log('🚀 开始生成提示词套装');
    console.log('📋 行业职业信息:', {
      industry: industryJobInfo.industry,
      job: industryJobInfo.job,
      customIndustry: industryJobInfo.customIndustry,
      customJob: industryJobInfo.customJob,
      isCustomIndustry: industryJobInfo.isCustomIndustry,
      isCustomJob: industryJobInfo.isCustomJob,
      promptSets: industryJobInfo.promptSets
    });
    console.log('📄 简历内容:', resumeContent ? '已提供' : '未提供');
    console.log('🤖 选择模型:', selectedModel);

    // 第一步：生成发送给AI的请求（第一部分 + 第二部分）
    const aiRequest = generateAIRequest(industryJobInfo);
    
    console.log('📤 发送给AI的请求长度:', aiRequest.length, '字符');

    // 第二步：调用AI服务获取优化的提示词
    const aiResponse = await AIService.generateResume(aiRequest, selectedModel);

    if (!aiResponse.success) {
      console.error('❌ AI服务调用失败:', aiResponse.error);
      return NextResponse.json({
        success: false,
        error: `AI服务调用失败: ${aiResponse.error}`
      } as GenerateResumeResponse, { status: 500 });
    }

    console.log('📥 AI返回内容长度:', aiResponse.content?.length || 0, '字符');

    // 第三步：将AI返回的提示词与用户简历内容组装成最终提示词
    const finalPrompts = assembleFinalPrompts(aiResponse.content || '', resumeContent);
    
    console.log('✅ 最终提示词长度:', finalPrompts.length, '字符');

    // 验证最终提示词是否包含预期的套数
    const setMatches = finalPrompts.match(/第(\d+)套[：:]/g);
    const detectedSets = setMatches ? setMatches.length : 0;
    
    console.log('🔍 检测到提示词套数:', detectedSets, '/', industryJobInfo.promptSets);

    if (detectedSets === 0) {
      console.warn('⚠️ 未检测到标准格式的提示词套数');
    }

    return NextResponse.json({
      success: true,
      html: finalPrompts,
      model: aiResponse.model,
      generatedAt: new Date().toISOString(),
      metadata: {
        requestLength: aiRequest.length,
        aiResponseLength: aiResponse.content?.length || 0,
        finalLength: finalPrompts.length,
        detectedSets: detectedSets,
        expectedSets: industryJobInfo.promptSets,
        hasResumeContent: !!resumeContent
      }
    } as GenerateResumeResponse);

  } catch (error) {
    console.error('💥 提示词生成错误:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error. Please try again later.'
    } as GenerateResumeResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to generate prompt sets.'
  }, { status: 405 });
} 