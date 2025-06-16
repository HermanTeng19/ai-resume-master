#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

async function testFormSubmission() {
  console.log('🧪 Testing form data submission...');
  
  // Simulate the form data that would be sent from the frontend
  const testData = {
    resumeData: {
      personalInfo: {
        name: '张三',
        title: '前端工程师',
        email: 'zhangsan@example.com',
        phone: '13800138000',
        location: '北京市',
        summary: `# 张三 - 前端工程师

## 个人简介
5年前端开发经验，精通React、Vue.js等现代前端框架。

## 工作经历
### 高级前端工程师 | ABC科技公司 | 2022-至今
- 负责公司主要产品的前端架构设计和开发
- 使用React、TypeScript构建高性能Web应用
- 优化页面性能，提升用户体验

### 前端工程师 | XYZ互联网公司 | 2020-2022
- 参与多个项目的前端开发工作
- 使用Vue.js开发企业级管理系统
- 与后端团队协作，完成API对接

## 技能
- 前端框架：React、Vue.js、Angular
- 编程语言：JavaScript、TypeScript、HTML、CSS
- 工具：Webpack、Vite、Git、Docker

## 教育背景
### 计算机科学与技术学士 | 北京大学 | 2016-2020
- 主修课程：数据结构、算法、软件工程
- GPA: 3.8/4.0`
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
    stylePreferences: '现代简洁风格，使用蓝色作为主色调'
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
      console.log('✅ Form submission successful!');
      console.log(`Model used: ${data.model}`);
      console.log(`Generated at: ${data.generatedAt}`);
      console.log(`HTML length: ${data.html?.length || 0} characters`);
      return true;
    } else {
      console.log('❌ Form submission failed:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Form Data Submission\n');
  
  const success = await testFormSubmission();
  
  if (success) {
    console.log('\n🎉 Test passed! The form can now handle markdown resume data.');
  } else {
    console.log('\n❌ Test failed. Please check the error messages above.');
  }
}

main().catch(console.error); 