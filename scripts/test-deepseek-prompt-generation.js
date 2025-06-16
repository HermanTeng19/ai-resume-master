// 测试DeepSeek模型生成多套提示词的功能
const fetch = require('node-fetch');

// 测试数据
const testIndustryJobInfo = {
  industry: '金融业',
  job: '数据工程师',
  promptSets: 3
};

console.log('🧪 Testing DeepSeek Prompt Generation');
console.log('=====================================');

// 模拟API调用测试
async function testAPICall() {
  try {
    console.log('\n🚀 Testing API Call...');
    console.log('─'.repeat(20));
    
    const response = await fetch('http://localhost:3000/api/generate-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        industryJobInfo: testIndustryJobInfo,
        model: 'deepseek-v3'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ API call successful!');
    console.log(`📊 Response length: ${data.html?.length || 0} characters`);
    
    // 分析响应内容
    if (data.html) {
      console.log('\n📋 Content Analysis:');
      console.log('─'.repeat(20));
      
      // 检查是否包含多套提示词
      const setMatches = data.html.match(/第(\d+)套/g) || [];
      console.log(`✓ Found sets: ${setMatches.length} (${setMatches.join(', ')})`);
      
      // 检查内容结构
      const hasHTML = data.html.includes('<!DOCTYPE html>') || data.html.includes('<html');
      const hasMarkdown = data.html.includes('#') || data.html.includes('**');
      
      console.log(`✓ Contains HTML: ${hasHTML ? '✅' : '❌'}`);
      console.log(`✓ Contains Markdown: ${hasMarkdown ? '✅' : '❌'}`);
      
      // 显示内容预览
      console.log('\n📝 Content Preview (first 500 chars):');
      console.log('─'.repeat(40));
      console.log(data.html.substring(0, 500) + '...');
      
      // 如果只有一套，分析原因
      if (setMatches.length <= 1) {
        console.log('\n⚠️  ISSUE DETECTED: Only one set generated!');
        console.log('Possible reasons:');
        console.log('1. Model not following the multi-set instruction');
        console.log('2. Prompt not clear enough about generating multiple sets');
        console.log('3. Model response truncated');
      } else {
        console.log('\n✅ Multiple sets detected! Pagination should work.');
      }
      
      // 测试分页解析功能
      testPaginationParsing(data.html);
    }
    
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    console.log('\n💡 Make sure the Next.js server is running: npm run dev');
  }
}

// 测试分页解析功能
function testPaginationParsing(content) {
  console.log('\n🔧 Testing Pagination Parsing:');
  console.log('─'.repeat(30));
  
  // 模拟PreviewPane的parsePromptSets函数
  const parsePromptSets = (content) => {
    const sets = [];
    
    const setRegex = /第(\d+)套[：:]/g;
    const matches = [];
    let match;
    while ((match = setRegex.exec(content)) !== null) {
      matches.push(match);
    }
    
    if (matches.length === 0) {
      return [{
        id: 1,
        title: '提示词套装',
        content: content
      }];
    }
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const setNumber = parseInt(match[1]);
      const startIndex = match.index || 0;
      const endIndex = i < matches.length - 1 ? (matches[i + 1].index || content.length) : content.length;
      
      const setContent = content.substring(startIndex, endIndex).trim();
      const titleMatch = setContent.match(/第\d+套[：:](.+?)(?:\n|$)/);
      const title = titleMatch ? titleMatch[1].trim() : `第${setNumber}套提示词`;
      
      sets.push({
        id: setNumber,
        title: title,
        content: setContent
      });
    }
    
    return sets.sort((a, b) => a.id - b.id);
  };
  
  const sets = parsePromptSets(content);
  console.log(`✓ Parsed sets: ${sets.length}`);
  sets.forEach((set, index) => {
    console.log(`  ${index + 1}. Set ${set.id}: ${set.title}`);
    console.log(`     Content length: ${set.content.length} chars`);
  });
  
  return sets;
}

// 运行测试
console.log('\n🎯 Starting comprehensive test...');
testAPICall().then(() => {
  console.log('\n✅ Test completed!');
}).catch(error => {
  console.error('\n❌ Test failed:', error);
}); 