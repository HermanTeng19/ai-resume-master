
# **项目概述 (Project Overview)**

本项目是一个专业的AI简历生成器Web应用。其核心功能是根据事先定义的 (pre-defined) 简历提示词再结合用户的职业和行业信息，系统将这些信息整合成一个结构化的提示词（Prompt），发送给大型语言模型（LLM），最终生成一份可以直接预览和使用的简历HTML代码。项目将采用Next.js作为全栈框架，结合React和Tailwind CSS构建现代化用户界面，并集成外部AI服务API。预先定义的基础提示词在项目的根目录 `basePrompt.md`文件中。

## **后端功能 (Backend Features - Implemented with Next.js API Routes)**

**AI提示词工程 (AI Prompt Engineering)**

* 动态生成提示词：后端API会接收前端发送的用户数据（如工作经历、技能、教育背景）和风格偏好。
* 系统级指令：内置一套核心的、结构化的系统指令（System Prompt），用于指导AI模型如何生成符合规范的HTML和CSS代码。
* 组合与格式化：将用户数据与系统指令智能地组合成一个最终发送给AI模型的、完整且高效的提示词。

**AI模型集成 (LLM API Integration)**

* 集成外部AI服务：通过API调用一个大型语言模型（如Google Gemini或DeepSeek）来处理生成的提示词。
* 安全认证：使用环境变量（`.env.local`）安全地管理和加载AI服务的API密钥。

**数据验证与安全 (Data Validation and Security)**

* 输入数据验证：在API端点使用`Zod`等库对从前端接收的数据进行严格的类型和格式校验，确保数据安全。
* CORS策略：Next.js内置了合理的CORS处理，确保前端可以安全地与API路由通信。

**API端点 (API Endpoints)**

* 核心生成接口：一个主要的RESTful API端点（例如 `POST /api/generate-resume`），用于处理所有简历生成请求。
* 错误处理：为API请求提供健壮的错误处理逻辑，向前台返回清晰的错误信息。

## **前端功能 (Frontend Features)**

**用户输入界面 (User Input Interface)**

* 结构化表单：提供一个清晰、分区的表单，让用户可以方便地输入个人信息、联系方式、教育背景、工作经历、技能等。
* 风格定制：包含一个专门的文本区域，供用户输入自定义的“外观提示词”，如“科技感、暗色主题、双栏布局”等。
* 交互式组件：使用Ant Design或类似组件库（如Shadcn/ui）构建表单、按钮和加载指示器，提升用户体验。

**简历预览 (Resume Preview)**

* 实时HTML渲染：提供一个专门的预览面板，用于实时显示后端AI生成的简历HTML代码。
* 安全沙箱预览：使用`<iframe>`的`srcDoc`属性来安全地渲染HTML内容，防止潜在的脚本注入风险。

**状态管理 (State Management)**

* React Hooks：主要使用React的`useState`和`useContext` API来管理表单数据、加载状态、错误信息以及最终生成的简历HTML。
* 全局上下文：通过Context API提供一个全局状态，用于管理AI生成的内容和应用的加载状态。

**用户体验与通知 (UX & Notifications)**

* 响应式UI：使用Tailwind CSS构建一个完全响应式的界面，确保在桌面和移动设备上都有良好的用户体验。
* 加载与反馈：在API请求期间，提供明确的加载指示器（如按钮禁用、加载动画）。
* 消息提醒：使用`react-hot-toast`或类似库，在操作成功（如“简历生成成功！”）或失败时向用户显示非侵入式的通知。

**路由与导航 (Routing and Navigation)**

* 基于文件的路由：利用Next.js的App Router进行页面管理，结构清晰。主要页面为应用主页(`/`)。

## **项目文件夹结构 (Proposed Folder Structure)**

```
ai-resume-generator/
├── app/                            # Next.js App Router
│   ├── api/                        # API routes
│   │   └── generate-resume/
│   │       └── route.ts            # The core backend logic
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page component
│
├── components/                     # Reusable React components
│   ├── ResumeForm.tsx              # The main input form
│   ├── PreviewPane.tsx             # The iframe-based preview area
│   └── ui/                         # UI primitives (e.g., from Shadcn/ui)
│
├── lib/                            # Helper functions & services
│   ├── ai-service.ts               # Logic for calling the LLM API
│   └── prompts.ts                  # Base system prompts
│
├── public/                         # Static assets (images, fonts)
├── styles/                         # Global styles
│   └── globals.css                 # Tailwind base styles
│
├── .env.local                      # Environment variables (API keys)
├── next.config.mjs                 # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Project dependencies
```

## **推荐使用的资源 (Resources to use)**

_框架与工具_

* Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)
* React: [https://react.dev/](https://react.dev/)
* Vite (Next.js使用SWC，但Vite文档对现代前端构建很有帮助): [https://vitejs.dev/guide/](https://vitejs.dev/guide/)
* Tailwind CSS: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

_AI与数据处理_

* Google AI for Developers (Gemini): [https://ai.google.dev/](https://ai.google.dev/)
* OpenRouter DeepSeek V3: [https://openrouter.ai/deepseek/deepseek-chat-v3-0324:free/api](https://openrouter.ai/deepseek/deepseek-chat-v3-0324:free/api)
* Zod (for data validation): [https://zod.dev/](https://zod.dev/)

_前端UI与库_

* Ant Design: [https://ant.design/docs/react/introduce](https://ant.design/docs/react/introduce)
* Shadcn/ui (另一种流行的UI组件方法): [https://ui.shadcn.com/](https://ui.shadcn.com/)
* React Hot Toast (for notifications): [https://react-hot-toast.com/](https://react-hot-toast.com/)