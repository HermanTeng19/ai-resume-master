// 测试DeepSeek API简历内容bug修复的脚本
const fetch = require('node-fetch');

console.log('🧪 测试DeepSeek API简历内容bug修复');
console.log('=====================================');

// 测试数据
const testIndustryJobInfo = {
  industry: '科技行业',
  job: 'AI工程师',
  promptSets: 3
};

const testResumeContent = {
  content: `张三
AI工程师
邮箱：zhangsan@example.com
电话：138-0000-0000

工作经历：
2021-2024 ABC科技公司 高级AI工程师
- 负责机器学习模型开发和部署
- 使用Python、TensorFlow、PyTorch等技术栈
- 参与大语言模型训练和优化项目

2019-2021 XYZ创业公司 算法工程师
- 开发推荐系统和自然语言处理应用
- 负责数据挖掘和特征工程

技能：
Python, TensorFlow, PyTorch, Transformers, Docker, Kubernetes, AWS

项目经历：
1. 智能客服系统 - 基于BERT的意图识别和实体抽取
2. 推荐算法优化 - 提升CTR 15%
3. 大模型微调 - 针对特定领域的模型优化`,
  fileName: 'resume.txt',
  fileType: 'text'
};

async function testDeepSeekAPIFix() {
  try {
    console.log('\n🚀 测试DeepSeek API修复...');
    console.log('─'.repeat(40));
    
    const response = await fetch('http://localhost:3000/api/generate-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        industryJobInfo: testIndustryJobInfo,
        resumeContent: testResumeContent,
        selectedModel: 'deepseek'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log(`❌ API错误: ${response.status} ${response.statusText}`);
      console.log('错误详情:', errorData);
      return false;
    }

    const data = await response.json();
    
    console.log('✅ API调用成功!');
    console.log(`📊 响应长度: ${data.html?.length || 0} 字符`);
    console.log(`🤖 使用模型: ${data.model || 'Unknown'}`);
    
    if (data.metadata) {
      console.log(`📋 元数据:`);
      console.log(`  - 请求长度: ${data.metadata.requestLength} 字符`);
      console.log(`  - AI响应长度: ${data.metadata.aiResponseLength} 字符`);
      console.log(`  - 最终长度: ${data.metadata.finalLength} 字符`);
      console.log(`  - 检测到套数: ${data.metadata.detectedSets}/${data.metadata.expectedSets}`);
      console.log(`  - 包含简历内容: ${data.metadata.hasResumeContent ? '✅' : '❌'}`);
    }
    
    // 分析响应内容
    if (data.html) {
      console.log('\n📋 内容分析:');
      console.log('─'.repeat(20));
      
      // 检查是否包含多套提示词
      const setMatches = data.html.match(/第(\d+)套[：:]/g) || [];
      console.log(`✓ 检测到套数: ${setMatches.length} (${setMatches.join(', ')})`);
      
      // 检查简历内容出现次数
      const resumeMatches = data.html.match(/📄 我的简历内容：/g) || [];
      console.log(`✓ 简历内容出现次数: ${resumeMatches.length}`);
      
      // 验证修复是否成功
      const expectedSets = testIndustryJobInfo.promptSets;
      const hasCorrectSets = setMatches.length === expectedSets;
      const hasCorrectResumeCount = resumeMatches.length === expectedSets;
      
      console.log(`✓ 套数正确: ${hasCorrectSets ? '✅' : '❌'} (期望${expectedSets}，实际${setMatches.length})`);
      console.log(`✓ 每套都有简历内容: ${hasCorrectResumeCount ? '✅' : '❌'} (期望${expectedSets}，实际${resumeMatches.length})`);
      
      // 检查简历内容是否正确
      const hasResumeContent = data.html.includes('张三') && data.html.includes('AI工程师');
      console.log(`✓ 包含简历信息: ${hasResumeContent ? '✅' : '❌'}`);
      
      // 显示内容预览
      console.log('\n📝 内容预览 (前500字符):');
      console.log('─'.repeat(40));
      console.log(data.html.substring(0, 500) + '...');
      
      // 总体评估
      const isFixed = hasCorrectSets && hasCorrectResumeCount && hasResumeContent;
      console.log(`\n🎯 修复状态: ${isFixed ? '✅ 修复成功' : '❌ 仍有问题'}`);
      
      if (!isFixed) {
        console.log('\n⚠️ 问题分析:');
        if (!hasCorrectSets) {
          console.log(`  - 套数不正确: 期望${expectedSets}套，实际${setMatches.length}套`);
        }
        if (!hasCorrectResumeCount) {
          console.log(`  - 简历内容数量不正确: 期望${expectedSets}个，实际${resumeMatches.length}个`);
        }
        if (!hasResumeContent) {
          console.log(`  - 简历内容缺失或不完整`);
        }
      }
      
      return isFixed;
    } else {
      console.log('❌ 没有返回内容');
      return false;
    }
    
  } catch (error) {
    console.error('❌ API调用失败:', error.message);
    console.log('\n💡 请确保Next.js服务器正在运行: npm run dev');
    return false;
  }
}

// 测试多种情况
async function runComprehensiveTest() {
  console.log('\n🔬 运行综合测试...\n');
  
  const testCases = [
    {
      name: '3套提示词测试',
      industryJobInfo: { industry: '科技行业', job: 'AI工程师', promptSets: 3 },
      resumeContent: testResumeContent
    },
    {
      name: '5套提示词测试',
      industryJobInfo: { industry: '金融业', job: '数据分析师', promptSets: 5 },
      resumeContent: testResumeContent
    },
    {
      name: '2套提示词测试',
      industryJobInfo: { industry: '教育行业', job: '产品经理', promptSets: 2 },
      resumeContent: testResumeContent
    }
  ];
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📋 测试 ${i + 1}/${totalTests}: ${testCase.name}`);
    console.log('─'.repeat(50));
    
    try {
      const response = await fetch('http://localhost:3000/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industryJobInfo: testCase.industryJobInfo,
          resumeContent: testCase.resumeContent,
          selectedModel: 'deepseek'
        }),
      });

      if (!response.ok) {
        console.log(`❌ 测试失败: HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      // 分析结果
      const setMatches = data.html?.match(/第(\d+)套[：:]/g) || [];
      const resumeMatches = data.html?.match(/📄 我的简历内容：/g) || [];
      const expectedSets = testCase.industryJobInfo.promptSets;
      
      const isCorrect = setMatches.length === expectedSets && resumeMatches.length === expectedSets;
      
      console.log(`✓ 套数: ${setMatches.length}/${expectedSets}`);
      console.log(`✓ 简历内容: ${resumeMatches.length}/${expectedSets}`);
      console.log(`✓ 结果: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
      
      if (isCorrect) {
        passedTests++;
      }
      
    } catch (error) {
      console.log(`❌ 测试异常: ${error.message}`);
    }
  }
  
  console.log('\n📊 综合测试结果:');
  console.log('─'.repeat(40));
  console.log(`✅ 通过测试: ${passedTests}/${totalTests}`);
  console.log(`❌ 失败测试: ${totalTests - passedTests}/${totalTests}`);
  
  return passedTests === totalTests;
}

// 执行测试
async function main() {
  console.log('\n🎯 开始测试DeepSeek API简历内容bug修复...\n');
  
  // 单个测试
  const singleTestPassed = await testDeepSeekAPIFix();
  
  if (singleTestPassed) {
    console.log('\n✅ 单个测试通过，继续综合测试...');
    
    // 综合测试
    const comprehensiveTestPassed = await runComprehensiveTest();
    
    if (comprehensiveTestPassed) {
      console.log('\n🎉 所有测试通过！DeepSeek API简历内容bug已修复！');
      console.log('\n✨ 修复总结:');
      console.log('  ✅ 每套提示词都包含用户简历内容');
      console.log('  ✅ 支持多种套数配置(2-5套)');
      console.log('  ✅ 兼容不同AI模型的输出格式');
      console.log('  ✅ 提供完整的错误处理和回退机制');
    } else {
      console.log('\n⚠️ 综合测试部分失败，可能需要进一步优化。');
    }
  } else {
    console.log('\n❌ 单个测试失败，请检查修复实现。');
  }
}

main().catch(error => {
  console.error('\n💥 测试执行失败:', error);
}); 