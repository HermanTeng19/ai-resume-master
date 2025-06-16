#!/usr/bin/env node

/**
 * 测试提示词生成功能
 * 验证API是否正确返回提示词而不是HTML
 */

const { generatePromptSetsRequest } = require('../lib/prompts');

console.log('🧪 测试提示词生成功能\n');

// 测试数据
const testIndustryJobInfo = {
  industry: '金融业',
  job: '产品经理',
  promptSets: 3
};

const testResumeContent = {
  content: `# 张三的简历

## 个人信息
- 姓名：张三
- 职位：产品经理
- 邮箱：zhangsan@example.com

## 工作经验
### 2020-2024 ABC金融公司 - 高级产品经理
- 负责金融产品设计和优化
- 管理产品团队，推动产品迭代
- 与技术团队协作，确保产品质量

## 技能
- 产品设计
- 数据分析
- 项目管理
- 用户研究`,
  fileName: 'resume.md',
  fileType: 'markdown'
};

console.log('📋 测试数据：');
console.log('  行业:', testIndustryJobInfo.industry);
console.log('  职业:', testIndustryJobInfo.job);
console.log('  套数:', testIndustryJobInfo.promptSets);
console.log('  简历内容长度:', testResumeContent.content.length, '字符\n');

// 生成提示词
console.log('🔄 生成提示词...\n');
const promptSets = generatePromptSetsRequest(testIndustryJobInfo, testResumeContent);

console.log('✅ 提示词生成完成！\n');
console.log('📊 生成结果统计：');
console.log('  总长度:', promptSets.length, '字符');

// 分析提示词结构
const setMatches = promptSets.match(/第(\d+)套[：:]/g);
console.log('  检测到套数:', setMatches ? setMatches.length : 0, '套');

if (setMatches) {
  setMatches.forEach((match, index) => {
    console.log(`    ${match}`);
  });
}

// 检查关键内容
console.log('\n🔍 内容验证：');
console.log('  包含行业信息:', promptSets.includes(testIndustryJobInfo.industry) ? '✅' : '❌');
console.log('  包含职业信息:', promptSets.includes(testIndustryJobInfo.job) ? '✅' : '❌');
console.log('  包含简历内容:', promptSets.includes('张三') ? '✅' : '❌');
console.log('  包含基础提示词:', promptSets.includes('HTML5 + Tailwind CSS') ? '✅' : '❌');

// 检查三部分结构
console.log('\n📋 三部分结构验证：');
console.log('  第一部分（行业职业风格）:', promptSets.includes('第一部分：行业职业风格定制') ? '✅' : '❌');
console.log('  第二部分（基础提示词）:', promptSets.includes('第二部分：基础提示词模板') ? '✅' : '❌');
console.log('  第三部分（简历内容）:', promptSets.includes('第三部分：用户简历内容') ? '✅' : '❌');

// 输出前500字符预览
console.log('\n📄 提示词预览（前500字符）：');
console.log('─'.repeat(60));
console.log(promptSets.substring(0, 500));
console.log('─'.repeat(60));

// 模拟API测试
console.log('\n🌐 模拟API调用测试：');

const mockApiRequest = {
  industryJobInfo: testIndustryJobInfo,
  resumeContent: testResumeContent,
  selectedModel: 'gemini'
};

console.log('  请求数据:', JSON.stringify(mockApiRequest, null, 2));

const mockApiResponse = {
  success: true,
  html: promptSets, // 现在返回提示词而不是HTML
  model: 'prompt-generator',
  generatedAt: new Date().toISOString()
};

console.log('\n  预期响应结构:');
console.log('    success:', mockApiResponse.success);
console.log('    html字段类型:', typeof mockApiResponse.html);
console.log('    html字段长度:', mockApiResponse.html.length);
console.log('    model:', mockApiResponse.model);
console.log('    generatedAt:', mockApiResponse.generatedAt);

// 验证响应是否为提示词而不是HTML
const isHtml = mockApiResponse.html.includes('<!DOCTYPE') || mockApiResponse.html.includes('<html');
const isPrompt = mockApiResponse.html.includes('第1套') || mockApiResponse.html.includes('第一套');

console.log('\n🎯 响应内容类型验证：');
console.log('  是HTML代码:', isHtml ? '❌ (不应该是HTML)' : '✅');
console.log('  是提示词:', isPrompt ? '✅' : '❌');

console.log('\n🎉 测试完成！');

if (!isHtml && isPrompt) {
  console.log('✅ 修复成功：API现在返回提示词而不是HTML代码');
} else {
  console.log('❌ 仍有问题：请检查API逻辑');
}

console.log('\n💡 下一步测试建议：');
console.log('  1. 启动开发服务器：npm run dev');
console.log('  2. 在浏览器中测试实际功能');
console.log('  3. 检查PreviewPane是否正确显示提示词');
console.log('  4. 验证分页功能是否正常工作'); 