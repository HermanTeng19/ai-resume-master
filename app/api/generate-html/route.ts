import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AIService } from '@/lib/ai-service';
import { GenerateHTMLRequest, GenerateHTMLResponse } from '@/lib/types';

// Validation schema
const GenerateHTMLRequestSchema = z.object({
  promptContent: z.string().min(1, 'Prompt content is required'),
  selectedModel: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request data
    const validationResult = GenerateHTMLRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data: ' + validationResult.error.errors.map(e => e.message).join(', ')
      } as GenerateHTMLResponse, { status: 400 });
    }

    const { promptContent, selectedModel } = validationResult.data;

    console.log('🚀 开始生成HTML代码');
    console.log('📋 提示词内容长度:', promptContent.length, '字符');
    console.log('🤖 选择模型:', selectedModel);

    // 构建生成HTML的提示词
    const htmlGenerationPrompt = `请基于以下提示词内容，生成一个完整的、美观的HTML简历页面。

要求：
1. 生成完整的HTML文档（包含<!DOCTYPE html>、<html>、<head>、<body>等标签）
2. 内置CSS样式，使用现代、简洁的设计风格
3. 响应式设计，适配移动端和桌面端
4. 使用合适的字体、颜色和布局
5. 包含所有必要的个人信息、技能、经验等部分
6. 代码要规范、整洁，易于阅读

提示词内容：
${promptContent}

请直接输出HTML代码，不要包含任何解释或markdown格式：`;

    // 调用AI服务生成HTML代码
    const aiResponse = await AIService.generateResume(htmlGenerationPrompt, selectedModel);

    if (!aiResponse.success) {
      console.error('❌ AI服务调用失败:', aiResponse.error);
      return NextResponse.json({
        success: false,
        error: `AI服务调用失败: ${aiResponse.error}`
      } as GenerateHTMLResponse, { status: 500 });
    }

    console.log('📥 AI返回内容长度:', aiResponse.content?.length || 0, '字符');

    // 清理AI返回的内容，确保是纯HTML代码
    let htmlCode = aiResponse.content || '';
    
    // 移除可能的markdown代码块标记
    htmlCode = htmlCode.replace(/^```html\s*/i, '').replace(/```\s*$/, '');
    htmlCode = htmlCode.replace(/^```\s*/i, '').replace(/```\s*$/, '');
    
    // 确保HTML代码是完整的
    if (!htmlCode.toLowerCase().includes('<!doctype html') && !htmlCode.toLowerCase().includes('<html')) {
      console.warn('⚠️ 生成的内容不是完整的HTML文档，尝试包装');
      htmlCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI生成简历</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .resume { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="resume">
        ${htmlCode}
    </div>
</body>
</html>`;
    }

    console.log('✅ HTML代码生成完成，长度:', htmlCode.length, '字符');

    return NextResponse.json({
      success: true,
      htmlCode: htmlCode.trim(),
      model: aiResponse.model,
      generatedAt: new Date().toISOString(),
    } as GenerateHTMLResponse);

  } catch (error) {
    console.error('💥 HTML代码生成错误:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error. Please try again later.'
    } as GenerateHTMLResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to generate HTML code.'
  }, { status: 405 });
} 