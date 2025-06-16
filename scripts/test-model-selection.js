#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

async function testModelSelection(modelId) {
  console.log(`🧪 Testing model selection: ${modelId}...`);
  
  const testData = {
    resumeData: {
      personalInfo: {
        name: '张三',
        title: '前端工程师',
        email: 'zhangsan@example.com',
        phone: '13800138000',
        location: '北京市',
        summary: '5年前端开发经验，精通React、Vue.js等现代前端框架。'
      },
      socialLinks: [],
      skills: [],
      experience: [],
      projects: [],
      education: [],
      languages: [],
      certifications: [],
      interests: []
    },
    selectedModel: modelId
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
      console.log(`✅ Model ${modelId} test successful!`);
      console.log(`Model used: ${data.model}`);
      console.log(`Generated at: ${data.generatedAt}`);
      console.log(`HTML length: ${data.html?.length || 0} characters`);
      return true;
    } else {
      console.log(`❌ Model ${modelId} test failed:`, data.error);
      return false;
    }
  } catch (error) {
    console.log(`❌ Request failed for ${modelId}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Model Selection Feature\n');
  
  const models = ['gemini', 'deepseek'];
  const results = {};
  
  for (const model of models) {
    results[model] = await testModelSelection(model);
    console.log(''); // Add spacing between tests
    
    // Wait a bit between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('📊 Test Summary:');
  for (const [model, success] of Object.entries(results)) {
    console.log(`${model}: ${success ? '✅ Working' : '❌ Failed'}`);
  }
  
  const allWorking = Object.values(results).every(result => result);
  
  if (allWorking) {
    console.log('\n🎉 All models are working! Model selection feature is ready.');
  } else {
    console.log('\n⚠️  Some models failed. Please check the error messages above.');
  }
}

main().catch(console.error); 