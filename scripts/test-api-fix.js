#!/usr/bin/env node

/**
 * 测试API修复 - 验证返回提示词而不是HTML
 */

const http = require('http');

console.log('🧪 测试API修复功能\n');

// 测试数据
const testData = {
  industryJobInfo: {
    industry: '金融业',
    job: '产品经理',
    promptSets: 3
  },
  resumeContent: {
    content: `# 张三的简历

## 个人信息
- 姓名：张三
- 职位：产品经理
- 邮箱：zhangsan@example.com

## 工作经验
### 2020-2024 ABC金融公司 - 高级产品经理
- 负责金融产品设计和优化
- 管理产品团队，推动产品迭代`,
    fileName: 'resume.md',
    fileType: 'markdown'
  },
  selectedModel: 'gemini'
};

console.log('📋 测试数据准备完成');
console.log('  行业:', testData.industryJobInfo.industry);
console.log('  职业:', testData.industryJobInfo.job);
console.log('  套数:', testData.industryJobInfo.promptSets);

// 发送API请求
const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/generate-resume',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('\n🌐 发送API请求到 http://localhost:3000/api/generate-resume');

const req = http.request(options, (res) => {
  console.log(`📊 响应状态: ${res.statusCode}`);
  console.log(`📋 响应头:`, res.headers);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      console.log('\n✅ API响应解析成功');
      console.log('  success:', response.success);
      console.log('  model:', response.model);
      console.log('  generatedAt:', response.generatedAt);
      
      if (response.success && response.html) {
        const content = response.html;
        console.log('  内容长度:', content.length, '字符');
        
        // 检查内容类型
        const isHtml = content.includes('<!DOCTYPE') || content.includes('<html');
        const isPrompt = content.includes('第1套') || content.includes('第一套');
        
        console.log('\n🎯 内容类型验证：');
        console.log('  是HTML代码:', isHtml ? '❌ (不应该是HTML)' : '✅');
        console.log('  是提示词:', isPrompt ? '✅' : '❌');
        
        // 检查套数
        const setMatches = content.match(/第(\d+)套[：:]/g);
        console.log('  检测到套数:', setMatches ? setMatches.length : 0, '套');
        
        if (setMatches) {
          setMatches.forEach((match) => {
            console.log(`    ${match}`);
          });
        }
        
        // 显示前300字符预览
        console.log('\n📄 内容预览（前300字符）：');
        console.log('─'.repeat(50));
        console.log(content.substring(0, 300));
        console.log('─'.repeat(50));
        
        // 总结
        console.log('\n🎉 测试结果：');
        if (!isHtml && isPrompt && setMatches && setMatches.length === 3) {
          console.log('✅ 修复成功！API现在正确返回提示词');
          console.log('✅ 提示词套数正确');
          console.log('✅ 内容格式正确');
        } else {
          console.log('❌ 仍有问题需要修复');
          if (isHtml) console.log('  - 仍然返回HTML代码');
          if (!isPrompt) console.log('  - 不是提示词格式');
          if (!setMatches || setMatches.length !== 3) console.log('  - 套数不正确');
        }
        
      } else {
        console.log('❌ API响应失败:', response.error || '未知错误');
      }
      
    } catch (error) {
      console.error('❌ 解析响应失败:', error.message);
      console.log('原始响应:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 请求失败:', error.message);
  console.log('\n💡 请确保开发服务器正在运行：');
  console.log('  npm run dev');
});

req.write(postData);
req.end();

console.log('⏳ 等待API响应...'); 