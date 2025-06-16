import { IndustryJobInfo, ResumeContent } from './types';

export const BASE_PROMPT = `你是一位专业网页设计师兼前端工程师，我希望你帮我设计并实现一个 **现代感强、简洁优雅且具备吸引力的个人简历网页**，使用 **HTML5 + Tailwind CSS** 技术栈，输出为一个完整的单 HTML 文件。

你的目标是生成一套精致、专业、视觉美观的单页简历网站模板，我计划将用户简历自动转化为这种网页格式。

---------------------------
🎯 设计目标与用户体验要求：
---------------------------
- 风格关键词：**优雅 / 现代 / 极简 / 专业 / 响应式 / 易读**
- 页面整体保持**简洁干净的排版**，**清晰的结构层次**，视觉焦点突出。
- 支持移动端和桌面端浏览，无需额外调整。
- 色彩搭配建议：使用温和的中性色（如深蓝、灰、白、米黄）+ 强调色（如浅蓝、绿色）构建视觉层级。
- 使用 Google Fonts 引入一款开源现代字体（如 Inter、Lato、Roboto、Nunito）。
- 图标请使用 Font Awesome 免费 CDN。

---------------------------
📄 页面结构建议：
---------------------------
请遵循如下模块顺序和结构：

1. **Header**（顶部）
   - 显示姓名、职业头衔
   - 一句话简介（例如：数据驱动决策者 / 专注商业智能）
   - 社交链接（GitHub、LinkedIn、邮箱图标等）
   - 小头像图（可放置占位图片链接）

2. **About Me**（自我介绍）
   - 一段 2~3 行的简要描述，展示个人特质与定位

3. **Skills Section**（技能）
   - 使用 badge 或 tag 风格展示技能标签（如：SQL、Power BI、Azure、Python）

4. **Experience**（工作经历）
   - 每段经历包含：公司名、职位、起止时间、项目/职责简述（最多 3~4 行）
   - 建议使用卡片布局或左时间轴 + 右内容布局

5. **Projects**（项目经历）
   - 每个项目包含：项目名称、项目描述、使用技术（如 JavaScript、D3.js、Azure）
   - 建议使用响应式卡片布局（2~3 列，移动端堆叠）

6. **Education**（教育背景）
   - 包含学校名称、学位、时间、主修课程或成绩（可选）

7. **Others**（可选模块）
   - 语言能力、证书、兴趣爱好、志愿者经历等

8. **Footer**
   - 联系方式与版权说明（如 © 2025 Your Name）

---------------------------
🛠️ 技术实现要求：
---------------------------
- 使用 **Tailwind CSS CDN 方式引入**，不使用 PostCSS 或构建工具。
- 使用 **HTML5 语义标签**（如 \`<header>\`, \`<section>\`, \`<footer>\`）。
- 所有样式通过 Tailwind utility class 编写（避免冗余 class 嵌套）。
- 如果需要自定义样式，请在 \`<style>\` 块中使用 Tailwind 的 \`@apply\`。
- 所有模块加上注释，例如 \`<!-- Projects Section -->\`。

---------------------------
📏 代码输出规范：
---------------------------
- 输出为**单文件 HTML**，用户可直接保存为 .html 并在浏览器中打开。
- **HTML代码不超过 1000 行**，**内联 Tailwind 样式不超过 800 行**（不含 Tailwind 引用）。
- 保持缩进清晰、注释完整。

---------------------------
💰 创意激励（模拟任务背景）：
---------------------------
你将获得一次展示设计实力的机会：如果你设计的页面既专业又吸引人，同时代码清晰易维护，你将获得一份 10 万美元的合约。

---------------------------
📦 输出格式要求：
---------------------------
- 一个完整的 HTML 文件（可复制粘贴）
- 不输出任何解释说明，**只输出 HTML 源代码**`;

/**
 * 生成发送给AI的请求内容（第一部分 + 第二部分）
 * 这个函数生成的内容将发送给AI模型进行优化
 */
export function generateAIRequest(industryJobInfo: IndustryJobInfo): string {
  const { industry, job, promptSets } = industryJobInfo;
  
  const styleTemplates = [
    {
      name: '现代简约专业风格',
      description: `针对${industry}${job}的现代简约设计，突出专业性和技术能力，使用干净的线条和精准的视觉层次。`
    },
    {
      name: '创意设计风格',
      description: `针对${industry}${job}的创意设计，展现创新思维和设计能力，使用动态元素和视觉亮点。`
    },
    {
      name: '数据驱动分析风格',
      description: `针对${industry}${job}的数据分析导向设计，强调逻辑思维和分析能力，使用图表元素和结构化布局。`
    },
    {
      name: '企业商务风格',
      description: `针对${industry}${job}的企业商务设计，体现稳重可靠和商业价值，使用正式的色彩和布局。`
    },
    {
      name: '科技未来风格',
      description: `针对${industry}${job}的科技前沿设计，展现技术创新和未来思维，使用科技感元素和前沿设计。`
    }
  ];

  let aiRequest = `请为${industry}行业的${job}职位生成${promptSets}套不同风格的简历页面设计提示词。

**重要要求：请为每套提示词生成针对该行业职业优化的专业提示词模板**

---------------------------
🎯 任务说明：
---------------------------
我需要你根据以下行业职业信息和基础模板，生成${promptSets}套针对性优化的提示词。每套提示词都应该：
1. 体现该行业的专业特点
2. 突出该职业的核心能力
3. 使用合适的设计风格和元素
4. 保持专业性和实用性

---------------------------
📋 目标信息：
---------------------------
**目标行业：** ${industry}
**目标职业：** ${job}
**需要套数：** ${promptSets}套

---------------------------
📄 基础提示词模板：
---------------------------
${BASE_PROMPT}

---------------------------
🎨 请生成以下风格的提示词：
---------------------------`;

  // 根据需要的套数生成对应的风格要求
  for (let i = 0; i < promptSets && i < styleTemplates.length; i++) {
    const style = styleTemplates[i];
    aiRequest += `

第${i + 1}套：${style.name}
风格特点：${style.description}
请基于上述基础模板，生成一个针对${industry}${job}的${style.name}提示词。`;
  }

  aiRequest += `

---------------------------
📦 输出要求：
---------------------------
请严格按照以下格式输出${promptSets}套提示词：

第1套：[风格名称]
[针对该行业职业优化的完整提示词内容]

---

第2套：[风格名称]
[针对该行业职业优化的完整提示词内容]

---

[继续其他套数...]

**注意：**
1. 每套提示词都应该是完整的、可直接使用的
2. 要体现该行业职业的专业特点
3. 不要包含具体的简历内容，因为用户会后续添加
4. 确保提示词清晰、专业、实用`;

  return aiRequest;
}

/**
 * 将AI返回的提示词与用户简历内容组装成最终提示词
 * @param aiResponse AI返回的优化提示词
 * @param resumeContent 用户的简历内容
 * @returns 最终的完整提示词
 */
export function assembleFinalPrompts(aiResponse: string, resumeContent?: ResumeContent): string {
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

/**
 * 旧的函数保持兼容性（已废弃，建议使用新的两步流程）
 * @deprecated 请使用 generateAIRequest 和 assembleFinalPrompts
 */
export function generatePromptSetsRequest(industryJobInfo: IndustryJobInfo, resumeContent?: ResumeContent): string {
  // 为了向后兼容，暂时保留这个函数
  // 但建议使用新的两步流程
  console.warn('generatePromptSetsRequest is deprecated. Use generateAIRequest and assembleFinalPrompts instead.');
  
  const aiRequest = generateAIRequest(industryJobInfo);
  // 这里应该调用AI，但为了兼容性，我们返回请求内容
  return aiRequest;
} 