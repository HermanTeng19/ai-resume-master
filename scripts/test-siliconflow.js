#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

async function testSiliconflowAPI() {
  console.log('🧪 Testing Siliconflow DeepSeek V3 API integration...');
  
  const testData = {
    industryJobInfo: {
      industry: '科技行业',
      job: 'AI工程师',
      promptSets: 2
    },
    selectedModel: 'deepseek'
  };

  try {
    console.log('📤 Testing Siliconflow DeepSeek V3 API...');
    
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
      console.log('✅ Siliconflow API integration successful!');
      console.log(`Model used: ${data.model}`);
      console.log(`Content length: ${data.html?.length || 0} characters`);
      
      // 分析生成的内容
      const content = data.html || '';
      
      console.log('\n📊 Generated Content Analysis:');
      
      // 检查内容质量指标
      const qualityMetrics = {
        hasIndustryMention: content.includes('科技行业') || content.includes('AI工程师'),
        hasPromptSets: content.includes('第1套') && content.includes('第2套'),
        hasStructuredContent: content.includes('##') || content.includes('**'),
        contentLength: content.length,
        estimatedWords: content.split(/\s+/).length
      };
      
      console.log(`Industry/Job mentioned: ${qualityMetrics.hasIndustryMention ? '✅' : '❌'}`);
      console.log(`Multiple prompt sets: ${qualityMetrics.hasPromptSets ? '✅' : '❌'}`);
      console.log(`Structured content: ${qualityMetrics.hasStructuredContent ? '✅' : '❌'}`);
      console.log(`Content length: ${qualityMetrics.contentLength} characters`);
      console.log(`Estimated words: ${qualityMetrics.estimatedWords}`);
      
      // 显示内容样本
      console.log('\n📝 Content Sample (first 300 chars):');
      console.log('─'.repeat(60));
      console.log(content.substring(0, 300) + '...');
      console.log('─'.repeat(60));
      
      // 性能分析
      const responseTime = response.headers.get('x-response-time') || 'N/A';
      console.log(`\n⚡ Performance: Response time: ${responseTime}`);
      
      // 检查API提供商信息
      if (data.model && data.model.includes('Siliconflow')) {
        console.log('\n🎉 Successfully using Siliconflow as the API provider!');
        console.log('💡 This should be faster than the previous OpenRouter integration.');
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

async function testDirectSiliconflowAPI() {
  console.log('\n🔧 Testing direct Siliconflow API call...');
  
  const apiKey = process.env.SILICONFLOW_API_KEY;
  
  if (!apiKey) {
    console.log('❌ SILICONFLOW_API_KEY not found in environment variables');
    console.log('💡 Please set SILICONFLOW_API_KEY in your .env.local file');
    return false;
  }

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [
          {
            role: 'user',
            content: '请简单介绍一下DeepSeek V3模型的特点，用中文回答，不超过100字。'
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log(`❌ Direct API Error: ${response.status} ${response.statusText}`);
      console.log('Error details:', errorData);
      return false;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      console.log('✅ Direct Siliconflow API call successful!');
      console.log(`Model: ${data.model}`);
      console.log(`Usage: ${JSON.stringify(data.usage)}`);
      console.log('\n📝 Response:');
      console.log('─'.repeat(40));
      console.log(content);
      console.log('─'.repeat(40));
      return true;
    } else {
      console.log('❌ No content in direct API response');
      return false;
    }
  } catch (error) {
    console.log('❌ Direct API call failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Siliconflow DeepSeek V3 Integration\n');
  
  // 等待服务器启动
  console.log('⏳ Waiting for server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 测试直接API调用
  const directApiResult = await testDirectSiliconflowAPI();
  
  // 测试通过应用API调用
  const appApiResult = await testSiliconflowAPI();
  
  console.log('\n📊 Test Summary:');
  console.log(`Direct Siliconflow API: ${directApiResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`App API Integration: ${appApiResult ? '✅ PASS' : '❌ FAIL'}`);
  
  if (directApiResult && appApiResult) {
    console.log('\n🎉 Siliconflow integration completed successfully!');
    console.log('\n💡 Benefits of switching to Siliconflow:');
    console.log('• Faster response times compared to OpenRouter');
    console.log('• More stable API service');
    console.log('• Better pricing and free tier');
    console.log('• Direct access to DeepSeek V3 without intermediary');
    console.log('\n🔧 Next steps:');
    console.log('1. Update your .env.local with SILICONFLOW_API_KEY');
    console.log('2. Remove the old OPENROUTER_API_KEY if no longer needed');
    console.log('3. Test the application in browser to verify UI integration');
  } else {
    console.log('\n❌ Siliconflow integration test failed. Please check:');
    console.log('1. SILICONFLOW_API_KEY is correctly set in .env.local');
    console.log('2. API key has sufficient credits/quota');
    console.log('3. Network connectivity to api.siliconflow.cn');
    console.log('4. Server is running on http://localhost:3000');
  }
}

main().catch(console.error); 