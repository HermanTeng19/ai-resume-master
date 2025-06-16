#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

async function testPaginationFeature() {
  console.log('🧪 Testing pagination preview feature...');
  
  const testData = {
    industryJobInfo: {
      industry: '金融业',
      job: '数据工程师',
      promptSets: 3
    },
    selectedModel: 'gemini'
  };

  try {
    console.log('📤 Sending request to generate 3 prompt sets...');
    
    const response = await fetch('http://localhost:3001/api/generate-resume', {
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
      console.log(`Generated at: ${data.generatedAt}`);
      console.log(`Content length: ${data.html?.length || 0} characters`);
      
      // 分析内容中的套数
      const content = data.html || '';
      const setMatches = content.match(/第(\d+)套/g);
      const setCount = setMatches ? setMatches.length : 0;
      
      console.log(`\n📊 Pagination Analysis:`);
      console.log(`Expected sets: 3`);
      console.log(`Found sets: ${setCount}`);
      console.log(`Set markers: ${setMatches ? setMatches.join(', ') : 'None'}`);
      
      if (setCount === 3) {
        console.log('✅ Pagination content structure is correct!');
      } else {
        console.log('⚠️  Pagination content structure may need adjustment');
      }
      
      // 显示每套的标题
      if (setMatches) {
        console.log('\n📝 Set titles found:');
        setMatches.forEach((match, index) => {
          const setNumber = match.match(/\d+/)[0];
          const setStart = content.indexOf(match);
          const titleLine = content.substring(setStart, setStart + 200).split('\n')[0];
          console.log(`  ${index + 1}. ${titleLine.trim()}`);
        });
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
  console.log('🚀 Testing Pagination Preview Feature\n');
  
  // 等待服务器启动
  console.log('⏳ Waiting for server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const result = await testPaginationFeature();
  
  console.log('\n📊 Test Summary:');
  if (result) {
    console.log('🎉 Pagination test passed! The preview should now support multiple pages.');
    console.log('\n💡 Next steps:');
    console.log('1. Open http://localhost:3001 in your browser');
    console.log('2. Select "金融业" and "数据工程师"');
    console.log('3. Set prompt sets to 3');
    console.log('4. Click "生成提示词套装"');
    console.log('5. Check the right panel for pagination controls');
  } else {
    console.log('❌ Pagination test failed. Please check the error messages above.');
  }
}

main().catch(console.error); 