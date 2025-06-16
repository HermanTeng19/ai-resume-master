#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

async function testGeminiAPI() {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.log('❌ GOOGLE_API_KEY not found in environment variables');
    return false;
  }

  console.log('🧪 Testing Google Gemini 2.0 Flash API...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, please respond with "API connection successful!"'
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log(`❌ Gemini API Error: ${response.status} ${response.statusText}`);
      console.log('Error details:', errorData);
      return false;
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (content) {
      console.log('✅ Gemini 2.0 Flash API connection successful!');
      console.log('Response:', content.trim());
      return true;
    } else {
      console.log('❌ No content received from Gemini API');
      return false;
    }
  } catch (error) {
    console.log('❌ Gemini API connection failed:', error.message);
    return false;
  }
}

async function testDeepSeekAPI() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.log('❌ OPENROUTER_API_KEY not found in environment variables');
    return false;
  }

  console.log('🧪 Testing DeepSeek API via OpenRouter...');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Resume Generator Test'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: 'user',
            content: 'Hello, please respond with "API connection successful!"'
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log(`❌ DeepSeek API Error: ${response.status} ${response.statusText}`);
      console.log('Error details:', errorData);
      return false;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      console.log('✅ DeepSeek API connection successful!');
      console.log('Response:', content.trim());
      return true;
    } else {
      console.log('❌ No content received from DeepSeek API');
      return false;
    }
  } catch (error) {
    console.log('❌ DeepSeek API connection failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 AI Resume Generator - API Connection Test\n');
  
  const aiService = process.env.AI_SERVICE || 'gemini';
  console.log(`Current AI_SERVICE setting: ${aiService}\n`);
  
  let geminiSuccess = false;
  let deepseekSuccess = false;
  
  // Test Gemini API
  geminiSuccess = await testGeminiAPI();
  console.log('');
  
  // Test DeepSeek API
  deepseekSuccess = await testDeepSeekAPI();
  console.log('');
  
  // Summary
  console.log('📊 Test Summary:');
  console.log(`Gemini 2.0 Flash: ${geminiSuccess ? '✅ Working' : '❌ Failed'}`);
  console.log(`DeepSeek V3: ${deepseekSuccess ? '✅ Working' : '❌ Failed'}`);
  
  if (aiService === 'gemini' && !geminiSuccess) {
    console.log('\n⚠️  Warning: Current AI_SERVICE is set to "gemini" but Gemini API test failed');
  } else if (aiService === 'deepseek' && !deepseekSuccess) {
    console.log('\n⚠️  Warning: Current AI_SERVICE is set to "deepseek" but DeepSeek API test failed');
  }
  
  if (geminiSuccess || deepseekSuccess) {
    console.log('\n🎉 At least one API is working! You can start using the AI Resume Generator.');
  } else {
    console.log('\n❌ No APIs are working. Please check your API keys and try again.');
  }
}

main().catch(console.error);
