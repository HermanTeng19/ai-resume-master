#!/usr/bin/env node

/**
 * 测试新的提示词生成逻辑
 * 验证三步流程：AI请求生成 -> AI调用 -> 最终组装
 */

const http = require('http');

console.log('🧪 测试新的提示词生成逻辑\n');

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
- 电话：138-0000-0000

## 工作经验
### 2020-2024 ABC金融公司 - 高级产品经理
- 负责金融产品设计和优化，提升用户体验
- 管理产品团队，推动产品迭代和功能开发
- 与技术团队协作，确保产品质量和交付时间
- 分析市场需求，制定产品策略和发展规划

### 2018-2020 XYZ科技公司 - 产品经理
- 参与移动应用产品设计和开发
- 负责用户需求调研和产品原型设计
- 协调跨部门合作，推进项目进度

## 技能
- 产品设计和用户体验
- 数据分析和市场调研
- 项目管理和团队协作
- 原型设计工具（Figma、Sketch）

## 教育背景
### 2014-2018 北京大学 - 工商管理学士
- 主修课程：市场营销、管理学、经济学
- GPA: 3.8/4.0`,
    fileName: 'resume.md',
    fileType: 'markdown'
  },
  selectedModel: 'gemini'
};

console.log('📋 测试数据准备：');
console.log('  行业:', testData.industryJobInfo.industry);
console.log('  职业:', testData.industryJobInfo.job);
console.log('  套数:', testData.industryJobInfo.promptSets);
console.log('  简历长度:', testData.resumeContent.content.length, '字符');
console.log('  选择模型:', testData.selectedModel);

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

console.log('\n🌐 发送API请求...');
console.log('📤 请求URL: http://localhost:3000/api/generate-resume');

const req = http.request(options, (res) => {
  console.log(`📊 响应状态: ${res.statusCode}`);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      console.log('\n✅ API响应解析成功');
      console.log('📋 基本信息:');
      console.log('  success:', response.success);
      console.log('  model:', response.model);
      console.log('  generatedAt:', response.generatedAt);
      
      if (response.metadata) {
        console.log('\n📊 处理统计:');
        console.log('  AI请求长度:', response.metadata.requestLength, '字符');
        console.log('  AI响应长度:', response.metadata.aiResponseLength, '字符');
        console.log('  最终长度:', response.metadata.finalLength, '字符');
        console.log('  检测套数:', response.metadata.detectedSets);
        console.log('  期望套数:', response.metadata.expectedSets);
        console.log('  包含简历:', response.metadata.hasResumeContent ? '是' : '否');
      }
      
      if (response.success && response.html) {
        const content = response.html;
        
        console.log('\n🎯 内容验证:');
        
        // 检查是否包含AI优化的内容
        const hasOptimizedContent = (
          content.includes('金融业产品经理') || 
          content.includes('量身定制') ||
          content.includes('金融行业') ||
          content.includes('专业') ||
          content.includes('深海军蓝') ||
          content.includes('炭灰色') ||
          content.includes('信任') ||
          content.includes('严谨')
        );
        console.log('  包含行业职业优化:', hasOptimizedContent ? '✅' : '❌');
        
        // 检查是否包含用户简历
        const hasUserResume = content.includes('张三') && content.includes('ABC金融公司');
        console.log('  包含用户简历:', hasUserResume ? '✅' : '❌');
        
        // 检查套数
        const setMatches = content.match(/第(\d+)套[：:]/g);
        const detectedSets = setMatches ? setMatches.length : 0;
        console.log('  提示词套数:', detectedSets, '/', testData.industryJobInfo.promptSets);
        
        // 检查每套提示词是否完整
        if (setMatches) {
          console.log('\n📝 套数详情:');
          setMatches.forEach((match, index) => {
            console.log(`    ${match}`);
          });
        }
        
        // 显示第一套提示词的前500字符
        console.log('\n📄 第一套提示词预览（前500字符）:');
        console.log('─'.repeat(60));
        const firstSetStart = content.indexOf('第1套');
        const firstSetEnd = content.indexOf('第2套');
        const firstSet = firstSetEnd > 0 ? content.substring(firstSetStart, firstSetEnd) : content.substring(firstSetStart, firstSetStart + 500);
        console.log(firstSet.substring(0, 500));
        console.log('─'.repeat(60));
        
        // 验证逻辑正确性
        console.log('\n🎉 新逻辑验证结果:');
        const logicChecks = [
          {
            name: 'AI优化内容',
            check: hasOptimizedContent,
            description: '提示词包含针对行业职业的优化内容'
          },
          {
            name: '简历内容集成',
            check: hasUserResume,
            description: '最终提示词包含用户的具体简历内容'
          },
          {
            name: '套数正确',
            check: detectedSets === testData.industryJobInfo.promptSets,
            description: '生成的套数符合用户要求'
          },
          {
            name: '内容完整',
            check: content.length > 1000,
            description: '提示词内容充实完整'
          }
        ];
        
        logicChecks.forEach(check => {
          console.log(`  ${check.check ? '✅' : '❌'} ${check.name}: ${check.description}`);
        });
        
        const allPassed = logicChecks.every(check => check.check);
        console.log(`\n🎯 总体评估: ${allPassed ? '✅ 新逻辑工作正常' : '❌ 需要进一步调试'}`);
        
      } else {
        console.log('❌ API响应失败:', response.error || '未知错误');
      }
      
    } catch (error) {
      console.error('❌ 解析响应失败:', error.message);
      console.log('原始响应长度:', data.length);
      console.log('响应开头:', data.substring(0, 200));
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 请求失败:', error.message);
  console.log('\n💡 请确保:');
  console.log('  1. 开发服务器正在运行 (npm run dev)');
  console.log('  2. API密钥已正确配置');
  console.log('  3. 网络连接正常');
});

req.write(postData);
req.end();

console.log('⏳ 等待API响应（可能需要几秒钟调用AI服务）...'); 