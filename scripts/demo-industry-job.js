#!/usr/bin/env node

const { INDUSTRIES } = require('../lib/industries.ts');

console.log('🎯 AI提示词生成器 - 行业职业演示\n');

console.log('📋 支持的行业与职业：\n');

INDUSTRIES.forEach((industry, index) => {
  console.log(`${index + 1}. ${industry.name} 🏢`);
  industry.jobs.forEach((job, jobIndex) => {
    console.log(`   ${String.fromCharCode(97 + jobIndex)}. ${job.name} - ${job.description}`);
  });
  console.log('');
});

console.log('🎨 提示词风格套装：');
console.log('   • 现代简约风格 - 突出专业性');
console.log('   • 创意设计风格 - 展现创新能力');
console.log('   • 数据驱动风格 - 强调分析能力');
console.log('   • 企业商务风格 - 体现稳重可靠');
console.log('   • 科技未来风格 - 展现技术前沿\n');

console.log('🔧 使用示例：');
console.log('   行业：金融业');
console.log('   职业：数据工程师');
console.log('   套数：3套');
console.log('   模型：Google Gemini 2.0 Flash\n');

console.log('📤 生成提示词：');
console.log('   "这次聚焦金融业的数据工程师，将行业和职业组合信息');
console.log('   结合预设提示词 (base prompt)，再生成3套提示词，');
console.log('   展示不同风格的页面设计"\n');

console.log('🚀 启动应用：npm run dev');
console.log('🧪 运行测试：npm run test-industry');
console.log('📖 查看文档：README.md & INDUSTRY_FEATURES.md'); 