// 测试assembleFinalPrompts函数修复的脚本
// 由于这是TypeScript项目，我们需要直接实现测试逻辑

// 复制assembleFinalPrompts函数的实现用于测试
function assembleFinalPrompts(aiResponse, resumeContent) {
  if (!resumeContent || !resumeContent.content.trim()) {
    // 如果没有简历内容，在每套提示词后添加占位说明
    return aiResponse + `

---------------------------
📄 使用说明：
---------------------------
**第三步：添加您的简历内容**

请在使用上述任何一套提示词时，在提示词末尾添加您的具体简历内容：

\`\`\`
[选择上述任意一套提示词]

---------------------------
📄 我的简历内容：
---------------------------
[在此处粘贴您的简历内容]

**请基于上述简历内容生成对应的HTML简历网站，确保所有信息都能在网页中得到合适的展示。**
\`\`\``;
  }

  // 如果有简历内容，将其添加到每套提示词后面
  const resumeSection = `

---------------------------
📄 我的简历内容：
---------------------------
${resumeContent.content}

**请基于上述简历内容生成对应的HTML简历网站，确保所有信息都能在网页中得到合适的展示。**`;

  // 优先使用"第X套"标识符进行分割，这样更可靠
  const setRegex = /第(\d+)套[：:]/g;
  const matches = [];
  let match;
  while ((match = setRegex.exec(aiResponse)) !== null) {
    matches.push({
      index: match.index,
      setNumber: parseInt(match[1])
    });
  }

  if (matches.length > 0) {
    // 基于"第X套"标识符分割
    let result = '';
    for (let i = 0; i < matches.length; i++) {
      const startIndex = matches[i].index;
      const endIndex = i < matches.length - 1 ? matches[i + 1].index : aiResponse.length;
      
      const setContent = aiResponse.substring(startIndex, endIndex).trim();
      result += setContent + resumeSection;
      
      // 如果不是最后一套，添加分隔符
      if (i < matches.length - 1) {
        result += '\n\n---\n\n';
      }
    }
    
    return result;
  }

  // 如果没有找到"第X套"标识符，尝试使用分隔符分割
  const separators = aiResponse.match(/---+/g);
  if (separators && separators.length > 0) {
    const sections = aiResponse.split(/---+/);
    let result = '';
    const nonEmptySections = sections.filter(s => s.trim());
    
    for (let i = 0; i < nonEmptySections.length; i++) {
      const section = nonEmptySections[i].trim();
      result += section + resumeSection;
      
      // 如果不是最后一个部分，添加分隔符
      if (i < nonEmptySections.length - 1) {
        result += '\n\n---\n\n';
      }
    }
    
    return result;
  }

  // 如果既没有套数标识符也没有分隔符，直接添加简历内容
  return aiResponse + resumeSection;
}

console.log('🧪 测试assembleFinalPrompts函数修复');
console.log('=====================================');

// 模拟简历内容
const mockResumeContent = {
  content: `张三
软件工程师
邮箱：zhangsan@example.com
电话：138-0000-0000

工作经历：
2020-2023 ABC科技公司 高级软件工程师
- 负责前端开发和架构设计
- 使用React、TypeScript等技术栈

技能：
JavaScript, TypeScript, React, Node.js, Python`
};

// 测试用例1：DeepSeek格式的AI响应（有"第X套"标识符）
const deepseekResponse = `请为科技行业软件工程师生成3套不同风格的简历页面设计提示词。

第1套：现代简约专业风格
你是一位专业网页设计师兼前端工程师，我希望你帮我设计并实现一个现代感强、简洁优雅的个人简历网页...
[完整的第1套提示词内容]

---

第2套：创意设计风格
你是一位专业网页设计师兼前端工程师，我希望你帮我设计并实现一个富有创意、视觉冲击力强的个人简历网页...
[完整的第2套提示词内容]

---

第3套：数据驱动分析风格
你是一位专业网页设计师兼前端工程师，我希望你帮我设计并实现一个数据导向、逻辑清晰的个人简历网页...
[完整的第3套提示词内容]`;

// 测试用例2：只有分隔符的AI响应
const separatorOnlyResponse = `这是第一套提示词的内容...
[完整的提示词内容]

---

这是第二套提示词的内容...
[完整的提示词内容]

---

这是第三套提示词的内容...
[完整的提示词内容]`;

// 测试用例3：没有分隔符的单套响应
const singleSetResponse = `这是一套完整的提示词内容，没有分隔符...
[完整的提示词内容]`;

// 测试用例4：格式不规范的响应（模拟DeepSeek可能的输出）
const irregularResponse = `第1套：现代简约风格
[内容...]

第2套：创意设计风格  
[内容...]

第3套：数据分析风格
[内容...]`;

function testAssemblyFunction(testName, aiResponse, resumeContent) {
  console.log(`\n📋 测试：${testName}`);
  console.log('─'.repeat(40));
  
  try {
    const result = assembleFinalPrompts(aiResponse, resumeContent);
    
    // 分析结果
    const setMatches = result.match(/第(\d+)套[：:]/g) || [];
    const resumeMatches = result.match(/📄 我的简历内容：/g) || [];
    
    console.log(`✓ 检测到套数：${setMatches.length} (${setMatches.join(', ')})`);
    console.log(`✓ 简历内容出现次数：${resumeMatches.length}`);
    
    // 验证每套都有简历内容
    let expectedSets;
    if (resumeContent && resumeContent.content.trim()) {
      // 如果有简历内容，期望每套都有简历内容
      if (setMatches.length > 0) {
        // 有"第X套"标识符，按套数计算
        expectedSets = setMatches.length;
      } else {
        // 没有"第X套"标识符，检查是否有分隔符
        const separators = aiResponse.match(/---+/g);
        if (separators && separators.length > 0) {
          // 有分隔符，按分隔符分割的非空部分计算
          const sections = aiResponse.split(/---+/);
          expectedSets = sections.filter(s => s.trim()).length;
        } else {
          // 既没有套数标识符也没有分隔符，默认为1套
          expectedSets = 1;
        }
      }
    } else {
      // 如果没有简历内容，期望只有1个使用说明
      expectedSets = 1;
    }
    const hasCorrectResumeCount = resumeMatches.length === expectedSets;
    
    console.log(`✓ 每套都有简历内容：${hasCorrectResumeCount ? '✅ 是' : '❌ 否'}`);
    
    if (!hasCorrectResumeCount) {
      console.log(`❌ 错误：期望${expectedSets}个简历内容，实际${resumeMatches.length}个`);
    }
    
    // 显示结果长度
    console.log(`✓ 最终结果长度：${result.length} 字符`);
    
    return hasCorrectResumeCount;
    
  } catch (error) {
    console.log(`❌ 测试失败：${error.message}`);
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('\n🚀 开始运行所有测试...\n');
  
  const tests = [
    ['DeepSeek格式（有第X套标识符）', deepseekResponse, mockResumeContent],
    ['只有分隔符格式', separatorOnlyResponse, mockResumeContent],
    ['单套无分隔符格式', singleSetResponse, mockResumeContent],
    ['不规范格式', irregularResponse, mockResumeContent],
    ['无简历内容测试', deepseekResponse, null]
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const [testName, aiResponse, resumeContent] of tests) {
    const passed = testAssemblyFunction(testName, aiResponse, resumeContent);
    if (passed) {
      passedTests++;
    }
  }
  
  console.log('\n📊 测试结果汇总：');
  console.log('─'.repeat(40));
  console.log(`✅ 通过测试：${passedTests}/${totalTests}`);
  console.log(`❌ 失败测试：${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 所有测试通过！assembleFinalPrompts函数修复成功！');
    return true;
  } else {
    console.log('\n⚠️ 部分测试失败，需要进一步调试。');
    return false;
  }
}

// 执行测试
runAllTests().then(success => {
  if (success) {
    console.log('\n✨ 修复验证完成！现在可以测试实际的API调用。');
    console.log('\n🔧 建议测试步骤：');
    console.log('  1. 启动开发服务器：npm run dev');
    console.log('  2. 上传简历内容');
    console.log('  3. 选择DeepSeek V3模型');
    console.log('  4. 生成多套提示词（建议测试3-5套）');
    console.log('  5. 检查每套提示词是否都包含简历内容');
  } else {
    console.log('\n❌ 修复验证失败，需要进一步调试。');
  }
}).catch(error => {
  console.error('\n💥 测试执行失败：', error);
}); 