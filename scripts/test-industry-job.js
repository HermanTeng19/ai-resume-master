#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

async function testIndustryJobGeneration() {
  console.log('🧪 Testing industry job prompt generation...');
  
  const testData = {
    industryJobInfo: {
      industry: '金融业',
      job: '数据工程师',
      promptSets: 3
    },
    selectedModel: 'gemini'
  };

  try {
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
      console.log('✅ Industry job prompt generation successful!');
      console.log(`Model used: ${data.model}`);
      console.log(`Generated at: ${data.generatedAt}`);
      console.log(`Content length: ${data.html?.length || 0} characters`);
      
      // 显示生成内容的前500个字符作为预览
      if (data.html) {
        console.log('\n📝 Generated content preview:');
        console.log('─'.repeat(50));
        console.log(data.html.substring(0, 500) + '...');
        console.log('─'.repeat(50));
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

async function testDifferentIndustries() {
  console.log('🧪 Testing different industry-job combinations...');
  
  const testCases = [
    { industry: '科技行业', job: 'AI工程师', promptSets: 2 },
    { industry: '医疗健康', job: '医疗数据分析师', promptSets: 1 },
    { industry: '教育行业', job: '教育数据分析师', promptSets: 2 }
  ];

  const results = {};
  
  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.industry} - ${testCase.job} (${testCase.promptSets}套)`);
    
    const testData = {
      industryJobInfo: testCase,
      selectedModel: 'gemini'
    };

    try {
      const response = await fetch('http://localhost:3000/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      const key = `${testCase.industry}-${testCase.job}`;
      results[key] = data.success;
      
      if (data.success) {
        console.log(`✅ Success - Content length: ${data.html?.length || 0} characters`);
      } else {
        console.log(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      results[`${testCase.industry}-${testCase.job}`] = false;
    }
    
    // 等待一下避免请求过快
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}

async function main() {
  console.log('🚀 Testing Industry Job Prompt Generation Feature\n');
  
  // 基础功能测试
  const basicTest = await testIndustryJobGeneration();
  console.log('\n');
  
  // 多种组合测试
  const multipleTests = await testDifferentIndustries();
  
  console.log('\n📊 Test Summary:');
  console.log(`Basic test: ${basicTest ? '✅ Passed' : '❌ Failed'}`);
  
  console.log('\nMultiple combinations:');
  for (const [combination, success] of Object.entries(multipleTests)) {
    console.log(`${combination}: ${success ? '✅ Passed' : '❌ Failed'}`);
  }
  
  const allPassed = basicTest && Object.values(multipleTests).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Industry job prompt generation is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the error messages above.');
  }
}

main().catch(console.error); 