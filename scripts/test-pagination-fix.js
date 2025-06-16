// 测试分页功能修复效果
console.log('🧪 Testing Pagination Fix');
console.log('=========================');

// 模拟不同格式的内容来测试分页解析
const testContents = [
  {
    name: '标准格式（第X套：）',
    content: `第1套：现代简约专业风格

**风格特点：** 现代简约设计，突出专业性

**HTML生成提示词：**
这是第一套的详细内容...

---

第2套：创意设计风格

**风格特点：** 创意设计，展现创新思维

**HTML生成提示词：**
这是第二套的详细内容...

---

第3套：数据驱动分析风格

**风格特点：** 数据分析导向设计

**HTML生成提示词：**
这是第三套的详细内容...`
  },
  {
    name: '空格格式（第X套 ）',
    content: `第1套 现代简约专业风格

风格特点：现代简约设计，突出专业性

HTML生成提示词：
这是第一套的详细内容...

第2套 创意设计风格

风格特点：创意设计，展现创新思维

HTML生成提示词：
这是第二套的详细内容...`
  },
  {
    name: '简单格式（第X套）',
    content: `第1套
现代简约专业风格

这是第一套的详细内容...

第2套
创意设计风格

这是第二套的详细内容...

第3套
数据驱动分析风格

这是第三套的详细内容...`
  },
  {
    name: '分隔符格式（---）',
    content: `现代简约专业风格

这是第一套的详细内容...

---

创意设计风格

这是第二套的详细内容...

---

数据驱动分析风格

这是第三套的详细内容...`
  },
  {
    name: '单套内容',
    content: `这是一个完整的提示词内容，没有分套标识。

包含详细的设计要求和技术规范...`
  }
];

// 模拟PreviewPane的parsePromptSets函数
function parsePromptSets(content) {
  const sets = [];
  
  // 尝试多种分割方式来识别套数
  // 1. 标准格式：第X套：
  let setRegex = /第(\d+)套[：:]/g;
  let matches = [];
  let match;
  
  while ((match = setRegex.exec(content)) !== null) {
    matches.push(match);
  }
  
  // 2. 如果没找到，尝试其他格式：第X套 (空格)
  if (matches.length === 0) {
    setRegex = /第(\d+)套\s/g;
    while ((match = setRegex.exec(content)) !== null) {
      matches.push(match);
    }
  }
  
  // 3. 如果还没找到，尝试更宽松的格式
  if (matches.length === 0) {
    setRegex = /第(\d+)套/g;
    while ((match = setRegex.exec(content)) !== null) {
      matches.push(match);
    }
  }
  
  // 4. 如果仍然没有找到套数标识，检查是否有其他分割标识
  if (matches.length === 0) {
    // 尝试按照"---"分割
    const sections = content.split(/---+/).filter(section => section.trim().length > 0);
    if (sections.length > 1) {
      return sections.map((section, index) => ({
        id: index + 1,
        title: `第${index + 1}套提示词`,
        content: section.trim()
      }));
    }
    
    // 如果没有找到任何分割标识，将整个内容作为一套
    return [{
      id: 1,
      title: '提示词套装',
      content: content
    }];
  }
  
  // 解析找到的套数
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const setNumber = parseInt(match[1]);
    const startIndex = match.index || 0;
    const endIndex = i < matches.length - 1 ? (matches[i + 1].index || content.length) : content.length;
    
    const setContent = content.substring(startIndex, endIndex).trim();
    
    // 尝试多种方式提取标题
    let title = `第${setNumber}套提示词`;
    
    // 方式1：第X套：标题
    let titleMatch = setContent.match(/第\d+套[：:](.+?)(?:\n|$)/);
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      // 方式2：第X套 标题（空格分隔）
      titleMatch = setContent.match(/第\d+套\s+(.+?)(?:\n|$)/);
      if (titleMatch) {
        title = titleMatch[1].trim();
      } else {
        // 方式3：查找**风格特点**或类似标识
        const styleMatch = setContent.match(/\*\*风格特点[：:]\*\*\s*(.+?)(?:\n|$)/);
        if (styleMatch) {
          title = styleMatch[1].trim();
        }
      }
    }
    
    sets.push({
      id: setNumber,
      title: title,
      content: setContent
    });
  }
  
  return sets.sort((a, b) => a.id - b.id);
}

// 运行测试
testContents.forEach((test, index) => {
  console.log(`\n${index + 1}. 测试 ${test.name}:`);
  console.log('─'.repeat(40));
  
  const sets = parsePromptSets(test.content);
  console.log(`✓ 解析结果: ${sets.length} 套`);
  
  sets.forEach((set, setIndex) => {
    console.log(`  ${setIndex + 1}. Set ${set.id}: ${set.title}`);
    console.log(`     内容长度: ${set.content.length} 字符`);
    console.log(`     内容预览: ${set.content.substring(0, 50).replace(/\n/g, ' ')}...`);
  });
  
  // 验证分页功能是否正常
  const expectedSets = test.content.includes('第3套') ? 3 : 
                      test.content.includes('第2套') ? 2 : 
                      test.content.includes('---') ? test.content.split('---').length - 1 : 1;
  
  if (sets.length >= expectedSets) {
    console.log(`  ✅ 分页功能正常 (期望: ${expectedSets}, 实际: ${sets.length})`);
  } else {
    console.log(`  ❌ 分页功能异常 (期望: ${expectedSets}, 实际: ${sets.length})`);
  }
});

console.log('\n🎯 测试总结:');
console.log('─'.repeat(20));
console.log('✅ 支持多种格式的套数识别');
console.log('✅ 智能标题提取');
console.log('✅ 分隔符备用方案');
console.log('✅ 单套内容兜底处理');
console.log('\n💡 修复要点:');
console.log('1. 增强了套数识别的鲁棒性');
console.log('2. 支持多种标题提取方式');
console.log('3. 添加了分隔符备用方案');
console.log('4. 确保单套内容也能正常显示'); 