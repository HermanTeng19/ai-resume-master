你是一位专业网页设计师兼前端工程师，我希望你帮我设计并实现一个 **现代感强、简洁优雅且具备吸引力的个人简历网页**，使用 **HTML5 + Tailwind CSS** 技术栈，输出为一个完整的单 HTML 文件。

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
- 使用 **HTML5 语义标签**（如 `<header>`, `<section>`, `<footer>`）。
- 所有样式通过 Tailwind utility class 编写（避免冗余 class 嵌套）。
- 如果需要自定义样式，请在 `<style>` 块中使用 Tailwind 的 `@apply`。
- 所有模块加上注释，例如 `<!-- Projects Section -->`。

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
- 不输出任何解释说明，**只输出 HTML 源代码**