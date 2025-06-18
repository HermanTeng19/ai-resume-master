# AI Prompt Generator - 智能提示词生成器

一个基于AI技术的行业专属提示词生成器，使用Next.js构建，集成Google Gemini和DeepSeek等先进AI模型，为不同行业和职业生成多套风格化的提示词套装。

## 🌟 特性

- **AI驱动**: 集成Google Gemini 2.0 Flash和Siliconflow DeepSeek V3 API
- **行业专属**: 支持6大行业，30+职业的专业提示词生成
- **🎯 自定义输入**: 支持用户自定义行业和职业，不再局限于预设选项
- **多套风格**: 可生成1-5套不同风格的提示词套装
- **分页预览**: 支持多套提示词分页显示，独立浏览每套内容
- **Markdown渲染**: 格式化显示提示词，支持标题、列表、代码等元素
- **模型选择**: 卡片化AI模型选择界面，支持动态切换
- **现代设计**: 使用Tailwind CSS构建美观响应式界面
- **实时预览**: 即时预览生成的提示词内容
- **智能组合**: 基于行业和职业特点智能生成定制化提示词
- **安全验证**: 使用Zod进行数据验证
- **AI模型显示**: 显示使用的AI模型和生成时间

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn 或 pnpm

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd ai-resume-generator
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **环境配置**
   
   复制环境变量示例文件：
   ```bash
   cp env.example .env.local
   ```
   
   在 `.env.local` 文件中配置API密钥：
   ```env
   # 选择以下其中一个AI服务
   
   # Google Gemini 2.0 Flash API
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   
   # 或者 Siliconflow DeepSeek V3 API
   SILICONFLOW_API_KEY=your_siliconflow_api_key_here
   
   # 设置默认使用的AI服务 (gemini 或 deepseek)
   AI_SERVICE=gemini
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

5. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🔧 API密钥获取

### Google Gemini API
1. 访问 [Google AI Studio](https://ai.google.dev/)
2. 创建新项目或选择现有项目
3. 启用Gemini API
4. 生成API密钥
5. 将密钥添加到 `.env.local` 文件中的 `GOOGLE_API_KEY`

### Siliconflow (DeepSeek V3)
1. 访问 [Siliconflow](https://cloud.siliconflow.cn/)
2. 注册账户并登录
3. 前往API密钥页面
4. 生成新的API密钥
5. 将密钥添加到 `.env.local` 文件中的 `SILICONFLOW_API_KEY`

## 📁 项目结构

```
ai-resume-generator/
├── app/                            # Next.js App Router
│   ├── api/                        # API routes
│   │   └── generate-resume/
│   │       └── route.ts            # 简历生成API
│   ├── globals.css                 # 全局样式
│   ├── layout.tsx                  # 根布局
│   └── page.tsx                    # 主页面
│
├── components/                     # React组件
│   ├── IndustryJobForm.tsx         # 行业职业表单（支持自定义输入）
│   ├── ModelSelector.tsx           # AI模型选择器
│   └── PreviewPane.tsx             # 预览面板
│
├── lib/                            # 工具库
│   ├── ai-service.ts               # AI服务集成
│   ├── industries.ts               # 行业职业配置
│   ├── models.ts                   # AI模型配置
│   ├── prompts.ts                  # 提示词管理（支持自定义输入）
│   └── types.ts                    # TypeScript类型定义
│
├── styles/                         # 样式文件
│   └── globals.css                 # Tailwind CSS配置
│
├── basePrompt.md                   # 基础提示词
├── ProjectOverview.md              # 项目概述
├── env.example                     # 环境变量示例
├── package.json                    # 项目依赖
└── README.md                       # 项目文档
```

## 🎯 使用方法

### 基础使用流程

1. **选择行业**: 
   - 从下拉列表中选择预设行业（金融业、科技行业、医疗健康等）
   - 🆕 **或选择"🎯 自定义行业"来输入您的专属行业**
   
2. **选择职业**: 
   - 根据所选行业，选择具体的职业角色
   - 🆕 **或选择"🎯 自定义职业"来输入您的专属职业**
   
3. **设置套数**: 选择要生成的提示词套数（1-5套）
4. **选择AI模型**: 在模型选择区域点击选择您偏好的AI模型
5. **生成提示词**: 点击"生成提示词套装"按钮
6. **预览结果**: 在右侧预览面板查看生成的提示词套装
7. **分页浏览**: 使用导航按钮在不同套数之间切换
8. **下载内容**: 点击"下载提示词"按钮保存所有套数

### 🎯 自定义输入功能

**自定义行业示例：**
- 新能源汽车
- 生物制药
- 区块链技术
- 量子计算
- 虚拟现实/增强现实
- 智能制造
- 绿色能源

**自定义职业示例：**
- AI产品经理
- 区块链开发工程师
- 新媒体运营专家
- 数字化转型顾问
- 智能硬件工程师
- 可持续发展专家
- 元宇宙设计师

**使用技巧：**
- 自定义输入时，系统会特别针对您的行业和职业特点生成更精准的提示词
- 输入框提供智能提示，帮助您更好地描述专业领域
- 支持中英文输入，系统会自动适配处理

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **Markdown渲染**: React Markdown + Remark GFM
- **AI集成**: Google Gemini 2.0 Flash API / Siliconflow DeepSeek V3 API
- **数据验证**: Zod
- **通知**: React Hot Toast
- **图标**: Font Awesome

## 🔒 安全特性

- 服务器端API密钥管理
- 输入数据验证和清理
- 安全的HTML预览（使用iframe沙箱）
- CORS保护
- 自定义输入内容过滤和验证

## 📝 开发说明

### 添加新的AI服务
1. 在 `lib/ai-service.ts` 中添加新的服务方法
2. 更新环境变量配置
3. 在API路由中添加服务选择逻辑

### 添加新的AI模型
1. 在 `lib/models.ts` 中添加新的模型配置
2. 在 `lib/ai-service.ts` 中添加对应的API调用方法
3. 更新环境变量配置

### 自定义提示词
编辑 `lib/prompts.ts` 文件中的 `BASE_PROMPT` 常量来修改AI生成简历的指令。

### 样式定制
修改 `styles/globals.css` 文件来自定义应用的样式主题。

### 🆕 自定义输入功能扩展
- 在 `lib/types.ts` 中的 `IndustryJobInfo` 接口包含了自定义字段
- `components/IndustryJobForm.tsx` 组件处理自定义输入的UI交互
- `lib/prompts.ts` 中的 `generateAIRequest` 函数支持自定义输入处理
- API验证模式已更新以支持自定义字段验证

## 🧪 测试

项目包含多个测试脚本来验证不同功能：

```bash
# 测试API连接
npm run test-api

# 测试行业职业功能
npm run test-industry

# 测试分页预览功能
npm run test-pagination

# 测试模型选择功能
npm run test-models

# 测试Markdown渲染功能
npm run test-markdown

# 测试Siliconflow API集成
npm run test-siliconflow

# 测试分页功能修复
npm run test-pagination-fix

# 测试DeepSeek提示词生成
npm run test-deepseek

# 🆕 测试自定义输入功能
npm run test-custom-input
```

### 测试说明
- **test-api**: 验证AI服务API连接是否正常
- **test-industry**: 测试行业职业提示词生成功能
- **test-pagination**: 验证分页预览功能的内容解析
- **test-models**: 测试不同AI模型的切换功能
- **test-markdown**: 验证Markdown渲染功能和格式化显示
- **test-siliconflow**: 测试Siliconflow API集成和DeepSeek V3模型
- **test-pagination-fix**: 测试分页解析功能的鲁棒性和各种格式支持
- **test-deepseek**: 测试DeepSeek模型的多套提示词生成功能
- **test-custom-input**: 测试自定义输入功能的鲁棒性和各种格式支持

## 🚀 部署

### Vercel部署
1. 推送代码到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署完成

### 其他平台
确保在部署平台配置正确的环境变量：
- `GOOGLE_API_KEY` 或 `SILICONFLOW_API_KEY`
- `AI_SERVICE`

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

## 📄 许可证

MIT License

## 📞 支持

如果您遇到任何问题，请：
1. 检查环境变量配置
2. 确认API密钥有效
3. 查看控制台错误信息
4. 提交Issue到项目仓库

---

**🎉 享受使用AI简历生成器创建专业简历的过程！** 