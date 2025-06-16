#!/usr/bin/env node

import { generateAIRequest } from '../lib/prompts';

console.log('🧪 测试随机风格生成功能改进');
console.log('================================================');

const testCase = {
  industry: '科技行业',
  job: 'AI工程师',
  promptSets: 3
};

try {
  const prompt = generateAIRequest(testCase);
  
  console.log('✅ 新版本函数调用成功');
  console.log(`📝 生成的提示词长度: ${prompt.length} 字符`);
  
  // 检查关键改进点
  console.log('\n🔍 改进效果检查:');
  
  // 1. 检查是否移除了硬编码风格
  const hasOldStyle = prompt.includes('现代简约专业风格') || 
                     prompt.includes('创意设计风格') || 
                     prompt.includes('数据驱动分析风格');
  console.log(`❌ 移除硬编码风格: ${!hasOldStyle ? '✅ 成功' : '❌ 仍存在'}`);
  
  // 2. 检查是否包含创意性指导
  const hasCreativity = prompt.includes('创造性地设计') && 
                       prompt.includes('独特且富有创意');
  console.log(`✨ 包含创意性指导: ${hasCreativity ? '✅ 成功' : '❌ 缺失'}`);
  
  // 3. 检查是否有避免常见描述的要求
  const hasAvoidance = prompt.includes('避免使用') && 
                      prompt.includes('现代简约');
  console.log(`🚫 避免固定描述要求: ${hasAvoidance ? '✅ 成功' : '❌ 缺失'}`);
  
  // 4. 检查是否有行业职业融合
  const hasIndustryIntegration = prompt.includes('科技行业') && 
                                prompt.includes('AI工程师');
  console.log(`🏢 行业职业融合: ${hasIndustryIntegration ? '✅ 成功' : '❌ 缺失'}`);
  
  // 5. 检查设计维度指导
  const hasDesignDimensions = prompt.includes('视觉风格维度') && 
                             prompt.includes('交互体验维度');
  console.log(`🎨 设计维度指导: ${hasDesignDimensions ? '✅ 成功' : '❌ 缺失'}`);
  
  // 显示提示词片段
  console.log('\n📄 提示词关键片段:');
  const lines = prompt.split('\n');
  const creativityLine = lines.find(line => line.includes('创造性地设计'));
  if (creativityLine) {
    console.log(`   创意指导: ${creativityLine.trim()}`);
  }
  
  const avoidanceLine = lines.find(line => line.includes('避免使用'));
  if (avoidanceLine) {
    console.log(`   避免要求: ${avoidanceLine.trim()}`);
  }
  
  console.log('\n🎉 随机风格生成功能改进验证完成！');
  
  // 综合评估
  const improvements = [
    !hasOldStyle,
    hasCreativity, 
    hasAvoidance,
    hasIndustryIntegration,
    hasDesignDimensions
  ];
  
  const successCount = improvements.filter(Boolean).length;
  const successRate = (successCount / improvements.length) * 100;
  
  console.log(`\n📊 改进成功率: ${successRate.toFixed(0)}% (${successCount}/${improvements.length})`);
  
  if (successRate >= 80) {
    console.log('🎯 改进效果优秀！');
  } else if (successRate >= 60) {
    console.log('👍 改进效果良好！');
  } else {
    console.log('⚠️  改进效果需要优化！');
  }
  
} catch (error: any) {
  console.error('❌ 测试失败:', error.message);
} 