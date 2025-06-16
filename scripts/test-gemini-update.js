#!/usr/bin/env node

/**
 * 测试Gemini模型更新
 * 验证模型名称和API端点是否正确更新
 */

console.log('🧪 测试Gemini模型更新\n');

// 模拟导入模型配置（由于ES模块问题，我们直接检查文件内容）
const fs = require('fs');
const path = require('path');

// 读取模型配置文件
const modelsPath = path.join(__dirname, '../lib/models.ts');
const aiServicePath = path.join(__dirname, '../lib/ai-service.ts');

console.log('📋 检查模型配置文件更新：');

try {
  const modelsContent = fs.readFileSync(modelsPath, 'utf8');
  
  // 检查模型名称更新
  const hasNewModelName = modelsContent.includes('Google Gemini 2.5 Flash Preview');
  const hasOldModelName = modelsContent.includes('Google Gemini 2.0 Flash');
  
  console.log('  lib/models.ts:');
  console.log('    包含新模型名称 (2.5 Flash Preview):', hasNewModelName ? '✅' : '❌');
  console.log('    不包含旧模型名称 (2.0 Flash):', !hasOldModelName ? '✅' : '❌');
  
  if (hasNewModelName && !hasOldModelName) {
    console.log('    ✅ models.ts 更新成功');
  } else {
    console.log('    ❌ models.ts 更新失败');
  }
  
} catch (error) {
  console.error('❌ 读取 models.ts 失败:', error.message);
}

console.log('\n📋 检查AI服务配置文件更新：');

try {
  const aiServiceContent = fs.readFileSync(aiServicePath, 'utf8');
  
  // 检查API端点更新
  const hasNewEndpoint = aiServiceContent.includes('gemini-2.5-flash-preview-05-20');
  const hasOldEndpoint = aiServiceContent.includes('gemini-2.0-flash-exp');
  
  // 检查返回的模型名称更新
  const hasNewReturnName = aiServiceContent.includes("model: 'Google Gemini 2.5 Flash Preview'");
  const hasOldReturnName = aiServiceContent.includes("model: 'Google Gemini 2.0 Flash'");
  
  console.log('  lib/ai-service.ts:');
  console.log('    包含新API端点 (gemini-2.5-flash-preview-05-20):', hasNewEndpoint ? '✅' : '❌');
  console.log('    不包含旧API端点 (gemini-2.0-flash-exp):', !hasOldEndpoint ? '✅' : '❌');
  console.log('    包含新返回模型名称:', hasNewReturnName ? '✅' : '❌');
  console.log('    不包含旧返回模型名称:', !hasOldReturnName ? '✅' : '❌');
  
  if (hasNewEndpoint && !hasOldEndpoint && hasNewReturnName && !hasOldReturnName) {
    console.log('    ✅ ai-service.ts 更新成功');
  } else {
    console.log('    ❌ ai-service.ts 更新失败');
  }
  
} catch (error) {
  console.error('❌ 读取 ai-service.ts 失败:', error.message);
}

console.log('\n🔍 验证完整的API URL：');

try {
  const aiServiceContent = fs.readFileSync(aiServicePath, 'utf8');
  const urlMatch = aiServiceContent.match(/GEMINI_URL = '([^']+)'/);
  
  if (urlMatch) {
    const fullUrl = urlMatch[1];
    console.log('  完整API URL:', fullUrl);
    
    const expectedUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';
    const isCorrect = fullUrl === expectedUrl;
    
    console.log('  URL正确性:', isCorrect ? '✅' : '❌');
    
    if (!isCorrect) {
      console.log('  期望URL:', expectedUrl);
      console.log('  实际URL:', fullUrl);
    }
  } else {
    console.log('  ❌ 未找到GEMINI_URL配置');
  }
  
} catch (error) {
  console.error('❌ 验证API URL失败:', error.message);
}

console.log('\n🎯 更新总结：');
console.log('  模型名称: Google Gemini 2.0 Flash → Google Gemini 2.5 Flash Preview');
console.log('  API端点: gemini-2.0-flash-exp → gemini-2.5-flash-preview-05-20');
console.log('  配置文件: lib/models.ts, lib/ai-service.ts');

console.log('\n💡 测试建议：');
console.log('  1. 重启开发服务器以应用更改');
console.log('  2. 在浏览器中检查模型选择器显示');
console.log('  3. 测试Gemini模型是否能正常工作');
console.log('  4. 检查API响应中的模型名称');

console.log('\n�� Gemini模型更新验证完成！'); 