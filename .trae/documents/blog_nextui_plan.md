# 博客前端开发计划 (NextJS + Zustand)

## 1. 现状分析 (Current State Analysis)
- **后端接口**: 基于 Go 的 Gin 框架，路由组包括 `/api/article/posts`, `/api/article/post` 等 RESTful 接口。
- **真实API响应**: `{ "code": 233200, "data": [{ "id": 304, "name": "...", "title": "...", "date": "...", "abstract": "...", "tags": "...", "lock": 0 }], "len": 310, "msg": "ok" }`
- **前端环境**: `d:\code\go\src\BlogNext\nextui` 目录目前仅包含首屏背景图 `assets/bg.jpeg`，尚未初始化 NextJS 项目。
- **设计规范要求** (基于 UI/UX Pro Max 规范):
  - **全暗黑主题 (Dark Theme Only)**: 严格遵循暗黑设计语言，底色使用深色系（如 `slate-950` 或纯黑），全面禁用亮色组件。
  - **高斯模糊 (Glassmorphism)**: 所有的页面交互元素、卡片、按钮等均采用磨砂玻璃背景（半透明深色 + `backdrop-blur`）。
  - **动态光效 (Dynamic Lighting)**: 交互元素融入动态光晕效果（如呼吸灯、Hover光边等）。
  - **首屏视觉**: 顶部展示完整背景图 (`bg.jpeg`)，包含 Slogan "Enjoy your life"。
  - **交互特效**: 页面向下滚动时，背景图需具备平滑的动态淡出 (Fade-out) 与视差效果。

## 2. 拟定更改与开发步骤 (Proposed Changes & Implementation Steps)

### 步骤 1: 初始化 NextJS 项目
- **操作**: 在 `d:\code\go\src\BlogNext\nextui` 下使用 `create-next-app` 初始化项目，配置 TypeScript, ESLint, Tailwind CSS，使用 App Router。
- **依赖安装**: 
  - `zustand` (轻量级状态管理)
  - `framer-motion` (实现滚动淡出、视差和高级动态光效)
  - `lucide-react` (SVG图标)
  - `clsx`, `tailwind-merge` (样式合并工具)

### 步骤 2: 建立全局 UI/UX 规范与上下文 (UI/UX Context & System)
- **全局样式 (`app/globals.css`)**: 
  - 设定 `body` 背景为极暗色，前景色为高对比度文字。
  - 注入 Glassmorphism 和动态光效相关的自定义 CSS 变量和动画 keyframes。
- **Tailwind 配置 (`tailwind.config.ts`)**: 
  - 扩展颜色面板、模糊度 (blur) 以及光晕发光效果 (box-shadow/drop-shadow)。
- **状态管理 (`store/useBlogStore.ts`)**: 
  - 使用 `zustand` 创建 Store，管理文章列表、分页、加载状态和过滤条件。

### 步骤 3: 开发核心组件 (Core Components)
- **`HeroSection` 组件**:
  - 采用 `next/image` 或 CSS Background 引入 `bg.jpeg`，确保覆盖首屏。
  - 居中展示发光 Slogan: "Enjoy your life"。
  - 结合 `framer-motion` 的 `useScroll` 和 `useTransform` 钩子，将滚动距离映射到 `opacity` 和 `y` 轴位移，实现优雅的滚动淡出。
- **`GlassCard` & `GlassButton` 组件**:
  - **GlassCard**: 用于文章列表项，背景 `bg-white/5` 配合 `backdrop-blur-lg`，加入细腻的 1px 半透明边框。
  - **GlassButton**: 悬浮时触发动态光效（利用渐变伪元素实现光斑移动或呼吸效果）。
- **`Navbar` 组件**:
  - 顶部导航栏，采用固定定位。页面滚动时从透明平滑过渡到高斯模糊背景。

### 步骤 4: 页面开发与接口对接 (Pages & Data Fetching)
- **API 代理配置 (`next.config.js`)**: 
  - 配置 `rewrites`，将前端 `/api/:path*` 代理到 `https://blog.renj.io/api/:path*`，解决跨域问题并获取真实数据。
- **首页 (`app/page.tsx`)**:
  - 顶部挂载 `HeroSection`。
  - 主体区域渲染文章列表（使用 `GlassCard`），展示标题、日期、摘要和标签。
  - 通过 `fetch` 或 `zustand` 异步 Action 获取文章列表数据。

## 3. 假设与决策 (Assumptions & Decisions)
- **接口联调**: 假定直接调用用户提供的真实 API (`blog.renj.io`)，本地开发通过 Next.js 的 `rewrites` 代理以避免 CORS 限制。
- **主题模式**: 遵循要求强制全局暗黑模式，无需设计和实现亮色切换逻辑。
- **背景图位置**: 图片位于 `assets/bg.jpeg`，初始化后会将其移入 Next.js 规范的 `public` 目录下以便正确引用。

## 4. 验证步骤 (Verification Steps)
- 运行 `npm run dev`，确保前端服务无报错启动。
- 视觉验证首屏背景图是否完整覆盖，且包含 Slogan；向下滚动时是否顺滑淡出。
- 确认文章列表数据被正确拉取并渲染，整体界面完全遵循暗黑、高斯模糊和动态光效的规范。
- 确认所有按钮、卡片的 Hover 效果是否具备光效。