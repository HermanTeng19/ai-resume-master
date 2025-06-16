#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

async function testMarkdownRendering() {
  console.log('🧪 Testing Markdown rendering in preview...');
  
  const testData = {
    industryJobInfo: {
      industry: '金融业',
      job: '数据工程师',
      promptSets: 2
    },
    selectedModel: 'gemini'
  };

  try {
    console.log('📤 Generating prompt sets with Markdown content...');
    
    const response = await fetch('http://localhost:3000/api/generate-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log(`❌ API Error: ${response.status} ${response.statusText}`);
      console.log('Error details:', errorData);
      return false;
    }

    const data = await response.json();

    if (data.success) {
      console.log('✅ Prompt sets generation successful!');
      console.log(`Model used: ${data.model}`);
      console.log(`Content length: ${data.html?.length || 0} characters`);
      
      // 分析Markdown内容
      const content = data.html || '';
      
      console.log('\n📊 Markdown Content Analysis:');
      
      // 检查Markdown元素
      const markdownElements = {
        headers: (content.match(/^#+\s/gm) || []).length,
        boldText: (content.match(/\*\*[^*]+\*\*/g) || []).length,
        italicText: (content.match(/\*[^*]+\*/g) || []).length,
        lists: (content.match(/^[\s]*[-*+]\s/gm) || []).length,
        codeBlocks: (content.match(/```[\s\S]*?```/g) || []).length,
        inlineCode: (content.match(/`[^`]+`/g) || []).length,
      };
      
      console.log(`Headers found: ${markdownElements.headers}`);
      console.log(`Bold text: ${markdownElements.boldText}`);
      console.log(`Italic text: ${markdownElements.italicText}`);
      console.log(`List items: ${markdownElements.lists}`);
      console.log(`Code blocks: ${markdownElements.codeBlocks}`);
      console.log(`Inline code: ${markdownElements.inlineCode}`);
      
      // 显示内容样本
      console.log('\n📝 Content Sample (first 500 chars):');
      console.log('─'.repeat(60));
      console.log(content.substring(0, 500) + '...');
      console.log('─'.repeat(60));
      
      // 检查是否包含Markdown格式
      const hasMarkdownFormatting = 
        markdownElements.headers > 0 || 
        markdownElements.boldText > 0 || 
        markdownElements.lists > 0;
      
      if (hasMarkdownFormatting) {
        console.log('\n✅ Content contains Markdown formatting - ready for rendering!');
        console.log('💡 The preview component will now render this as formatted HTML instead of raw text.');
      } else {
        console.log('\n⚠️  Content appears to be plain text - Markdown rendering may not show significant differences.');
      }
      
      return true;
    } else {
      console.log('❌ Generation failed:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Markdown Rendering Feature\n');
  
  // 等待服务器启动
  console.log('⏳ Waiting for server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const result = await testMarkdownRendering();
  
  console.log('\n📊 Test Summary:');
  if (result) {
    console.log('🎉 Markdown rendering test completed successfully!');
    console.log('\n💡 Next steps to verify the rendering:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Select "金融业" and "数据工程师"');
    console.log('3. Set prompt sets to 2');
    console.log('4. Click "生成提示词套装"');
    console.log('5. Check the right panel - content should be rendered as formatted HTML');
    console.log('6. Look for:');
    console.log('   - Headers with proper typography');
    console.log('   - Bold and italic text formatting');
    console.log('   - Properly formatted lists');
    console.log('   - Styled code blocks and inline code');
    console.log('   - Clean, readable layout instead of raw Markdown');
  } else {
    console.log('❌ Markdown rendering test failed. Please check the error messages above.');
  }
}

main().catch(console.error); 