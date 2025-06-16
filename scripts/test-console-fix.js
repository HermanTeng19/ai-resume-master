#!/usr/bin/env node

/**
 * 测试Console错误修复
 * 验证PDF处理和其他可能导致console错误的问题
 */

console.log('🧪 测试Console错误修复\n');

const fs = require('fs');
const path = require('path');

// 检查ResumeInput组件的PDF处理修复
console.log('📋 检查PDF处理修复：');

try {
  const resumeInputPath = path.join(__dirname, '../components/ResumeInput.tsx');
  const resumeInputContent = fs.readFileSync(resumeInputPath, 'utf8');
  
  // 检查修复项目
  const fixes = [
    {
      name: '使用更稳定的CDN',
      check: resumeInputContent.includes('https://unpkg.com/pdfjs-dist'),
      description: '使用unpkg.com替代cdnjs.cloudflare.com'
    },
    {
      name: '添加Worker检查',
      check: resumeInputContent.includes('!pdfjsLib.GlobalWorkerOptions.workerSrc'),
      description: '避免重复设置Worker路径'
    },
    {
      name: '禁用问题功能',
      check: resumeInputContent.includes('disableAutoFetch: true') && 
             resumeInputContent.includes('disableStream: true') && 
             resumeInputContent.includes('disableRange: true'),
      description: '禁用可能导致Worker问题的功能'
    },
    {
      name: '添加页面错误处理',
      check: resumeInputContent.includes('} catch (pageError) {'),
      description: '单页处理失败不影响其他页面'
    },
    {
      name: '添加资源清理',
      check: resumeInputContent.includes('page.cleanup()') && 
             resumeInputContent.includes('pdf.destroy()'),
      description: '正确清理PDF和页面资源'
    },
    {
      name: '改进错误信息',
      check: resumeInputContent.includes('PDF处理服务暂时不可用'),
      description: '为Worker错误提供友好的错误信息'
    }
  ];
  
  console.log('  PDF处理修复项目：');
  fixes.forEach(fix => {
    console.log(`    ${fix.name}: ${fix.check ? '✅' : '❌'}`);
    console.log(`      ${fix.description}`);
  });
  
  const allFixed = fixes.every(fix => fix.check);
  console.log(`\n  ✅ PDF处理修复状态: ${allFixed ? '全部完成' : '部分完成'}`);
  
} catch (error) {
  console.error('❌ 检查ResumeInput组件失败:', error.message);
}

console.log('\n🔍 检查其他可能的错误源：');

// 检查是否有其他可能导致console错误的代码
const filesToCheck = [
  'app/page.tsx',
  'components/PreviewPane.tsx',
  'components/ModelSelector.tsx',
  'app/api/generate-resume/route.ts'
];

filesToCheck.forEach(filePath => {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // 检查可能的问题模式
    const issues = [];
    
    if (content.includes('console.error') && !content.includes('catch')) {
      issues.push('未捕获的console.error');
    }
    
    if (content.includes('fetch(') && !content.includes('.catch(')) {
      issues.push('未处理的fetch错误');
    }
    
    if (content.includes('addEventListener') && !content.includes('removeEventListener')) {
      issues.push('可能的事件监听器泄漏');
    }
    
    console.log(`  ${filePath}: ${issues.length === 0 ? '✅ 无问题' : '⚠️ ' + issues.join(', ')}`);
    
  } catch (error) {
    console.log(`  ${filePath}: ❌ 无法检查`);
  }
});

console.log('\n🎯 Console错误修复总结：');
console.log('  主要问题: PDF.js Worker连接问题');
console.log('  修复方案:');
console.log('    1. 使用更稳定的CDN (unpkg.com)');
console.log('    2. 添加Worker状态检查');
console.log('    3. 禁用可能导致问题的PDF.js功能');
console.log('    4. 改进错误处理和资源清理');
console.log('    5. 提供更友好的错误信息');

console.log('\n💡 测试建议：');
console.log('  1. 重启开发服务器');
console.log('  2. 清除浏览器缓存');
console.log('  3. 测试不上传PDF文件的情况');
console.log('  4. 测试上传PDF文件的情况');
console.log('  5. 检查浏览器Console是否还有错误');

console.log('\n🔧 如果错误仍然存在：');
console.log('  1. 检查浏览器Network标签页');
console.log('  2. 查看具体的错误堆栈');
console.log('  3. 尝试禁用PDF上传功能');
console.log('  4. 检查Next.js开发服务器日志');

console.log('\n🎉 Console错误修复验证完成！'); 