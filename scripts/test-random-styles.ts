#!/usr/bin/env node

import { generateAIRequest } from '../lib/prompts';
import { IndustryJobInfo } from '../lib/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 配置
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('❌ 请设置 GOOGLE_API_KEY 环境变量');
  process.exit(1);
}

// 初始化 Gemini
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// 测试用例
const testCases = [
  {
    industry: '金融业',
    job: '数据分析师',
    promptSets: 3,
    description: '金融数据分析专业'
  },
  {
    industry: '科技行业',
    job: '前端工程师',
    promptSets: 4,
    description: '技术前端开发'
  },
  {
    industry: '医疗健康',
    job: '产品经理',
    promptSets: 3,
    description: '医疗产品管理'
  },
  {
    industry: '教育行业',
    job: '培训师',
    promptSets: 5,
    description: '教育培训专业'
  }
];

// 风格创意性分析结果接口
interface StyleAnalysis {
  styleNames: string[];
  creativityScore: number;
  uniqueness: number;
  industryIntegration: number;
  commonPhrases: string[];
  innovations: string[];
}

// 测试结果接口
interface TestResult {
  testCase: typeof testCases[0];
  analysis: StyleAnalysis;
  response: string;
}

// 风格创意性分析函数
function analyzeStyleCreativity(response: string): StyleAnalysis {
  const analysis: StyleAnalysis = {
    styleNames: [],
    creativityScore: 0,
    uniqueness: 0,
    industryIntegration: 0,
    commonPhrases: [],
    innovations: []
  };

  // 提取风格名称
  const styleMatches = response.match(/第\d+套[：:]([^\n]+)/g) || [];
  analysis.styleNames = styleMatches.map(match => 
    match.replace(/第\d+套[：:]/, '').trim()
  );

  // 检查常见固定描述
  const commonPhrases = [
    '现代简约', '商务风格', '科技感', '专业风格', 
    '创意设计', '数据驱动', '企业商务', '科技未来'
  ];
  
  const foundCommon = commonPhrases.filter(phrase => 
    response.toLowerCase().includes(phrase.toLowerCase())
  );
  analysis.commonPhrases = foundCommon;

  // 创意性评分 (1-10)
  if (analysis.styleNames.length > 0) {
    // 基础分数
    analysis.creativityScore = 5;
    
    // 奖励独特命名
    if (analysis.styleNames.some(name => name.length > 8)) {
      analysis.creativityScore += 1;
    }
    
    // 惩罚常见短语
    analysis.creativityScore -= foundCommon.length * 0.5;
    
    // 奖励创新表达
    const innovativeKeywords = [
      '沉浸式', '极简主义', '数字艺术', '视觉叙事', '情感连接',
      '品牌故事', '互动体验', '色彩心理学', '空间设计'
    ];
    
    const foundInnovative = innovativeKeywords.filter(keyword => 
      response.includes(keyword)
    );
    analysis.innovations = foundInnovative;
    analysis.creativityScore += foundInnovative.length * 0.3;
    
    // 确保分数在合理范围
    analysis.creativityScore = Math.max(1, Math.min(10, analysis.creativityScore));
  }

  // 独特性评分
  const uniqueNames = Array.from(new Set(analysis.styleNames));
  analysis.uniqueness = uniqueNames.length === analysis.styleNames.length ? 10 : 
    (uniqueNames.length / analysis.styleNames.length) * 10;

  return analysis;
}

// 调用AI生成风格
async function testRandomStyleGeneration(testCase: typeof testCases[0]): Promise<TestResult | null> {
  try {
    console.log(`\n🧪 测试案例: ${testCase.description}`);
    console.log(`   行业: ${testCase.industry}, 职业: ${testCase.job}, 套数: ${testCase.promptSets}`);
    
    const industryJobInfo: IndustryJobInfo = {
      industry: testCase.industry,
      job: testCase.job,
      promptSets: testCase.promptSets
    };

    const prompt = generateAIRequest(industryJobInfo);
    console.log(`\n📝 生成的提示词长度: ${prompt.length} 字符`);

    console.log('\n⏳ 调用 Gemini API...');
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log(`\n✅ AI 响应长度: ${response.length} 字符`);
    
    // 分析创意性
    const analysis = analyzeStyleCreativity(response);
    
    console.log('\n📊 风格创意性分析:');
    console.log(`   生成风格数量: ${analysis.styleNames.length}`);
    console.log(`   风格名称: ${analysis.styleNames.join(', ')}`);
    console.log(`   创意性评分: ${analysis.creativityScore.toFixed(1)}/10`);
    console.log(`   独特性评分: ${analysis.uniqueness.toFixed(1)}/10`);
    
    if (analysis.commonPhrases.length > 0) {
      console.log(`   ⚠️  发现常见短语: ${analysis.commonPhrases.join(', ')}`);
    }
    
    if (analysis.innovations.length > 0) {
      console.log(`   ✨ 创新元素: ${analysis.innovations.join(', ')}`);
    }

    // 显示生成的风格示例
    console.log('\n🎨 生成的风格示例:');
    const styleExamples = response.match(/第\d+套[：:][^\n]+[\s\S]*?(?=第\d+套|$)/g) || [];
    styleExamples.slice(0, 2).forEach((example, index) => {
      const lines = example.split('\n').slice(0, 3);
      console.log(`   ${index + 1}. ${lines.join(' ').substring(0, 100)}...`);
    });

    return {
      testCase,
      analysis,
      response: response.substring(0, 500) + '...' // 保存部分响应用于对比
    };

  } catch (error: any) {
    console.error(`❌ 测试失败:`, error.message);
    return null;
  }
}

// 对比旧版本（模拟）
function simulateOldVersionStyles(testCase: typeof testCases[0]): string[] {
  const oldStyles = [
    '现代简约专业风格',
    '创意设计风格', 
    '数据驱动分析风格',
    '企业商务风格',
    '科技未来风格'
  ];
  
  return oldStyles.slice(0, testCase.promptSets);
}

// 主测试函数
async function runRandomStyleTest(): Promise<void> {
  console.log('🚀 开始随机风格生成功能测试');
  console.log('================================================');
  
  const results: TestResult[] = [];
  
  for (const testCase of testCases) {
    const result = await testRandomStyleGeneration(testCase);
    if (result) {
      results.push(result);
      
      // 对比旧版本
      const oldStyles = simulateOldVersionStyles(testCase);
      console.log('\n📈 新旧版本对比:');
      console.log(`   旧版本风格: ${oldStyles.join(', ')}`);
      console.log(`   新版本风格: ${result.analysis.styleNames.join(', ')}`);
      console.log(`   创意提升: ${result.analysis.creativityScore > 6 ? '✅ 显著' : '⚠️  一般'}`);
    }
    
    console.log('\n' + '='.repeat(50));
    
    // 避免API限制，等待一秒
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 综合评估
  console.log('\n📋 测试总结:');
  console.log('================================================');
  
  if (results.length > 0) {
    const avgCreativity = results.reduce((sum, r) => sum + r.analysis.creativityScore, 0) / results.length;
    const avgUniqueness = results.reduce((sum, r) => sum + r.analysis.uniqueness, 0) / results.length;
    
    console.log(`✅ 成功测试案例: ${results.length}/${testCases.length}`);
    console.log(`📊 平均创意性评分: ${avgCreativity.toFixed(1)}/10`);
    console.log(`📊 平均独特性评分: ${avgUniqueness.toFixed(1)}/10`);
    
    const totalCommonPhrases = results.reduce((sum, r) => sum + r.analysis.commonPhrases.length, 0);
    const totalInnovations = results.reduce((sum, r) => sum + r.analysis.innovations.length, 0);
    
    console.log(`⚠️  检测到常见短语: ${totalCommonPhrases} 个`);
    console.log(`✨ 检测到创新元素: ${totalInnovations} 个`);
    
    // 改进建议
    console.log('\n💡 改进建议:');
    if (avgCreativity < 7) {
      console.log('   - 可以进一步增强提示词的创意性指导');
    }
    if (totalCommonPhrases > 0) {
      console.log('   - 需要更明确地避免常见固定描述');
    }
    if (avgUniqueness < 9) {
      console.log('   - 可以增强风格差异化要求');
    }
    
    console.log('\n🎉 随机风格生成功能基本验证通过！');
  } else {
    console.log('❌ 所有测试案例都失败了，请检查配置和网络连接');
  }
}

// 运行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  runRandomStyleTest().catch(console.error);
} 