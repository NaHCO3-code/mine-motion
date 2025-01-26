import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Mine Motion 2.0",
  description: "A simple and lightweight animation library.",
  outDir: './docs',
  base: '/mine-motion/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Guidence(specific for Arena Editor user)', link: '/markdown-examples' },
      //     { text: 'API Reference', link: '/api-examples' }
      //   ]
      // }
      {
        text: "教程 (Arena Editor)",
        items: [
          { text: "快速开始", link: "/tutorial/quick-start" }
        ]
      },
      {
        text: "API 参考",
        items: [
          { text: "Overview", link: "/api/overview" },
          { text: "Timeline API", link: "/api/timeline" },
          { text: "Data Driver", link: "/api/datadriver" },
          { text: "Reactive", link: "/api/reactive" },
          { text: "Types", link: "/api/types" },
          { text: "Handler", link: "/api/handler" },
          { text: "Plugin", link: "/api/plugin" },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/NaHCO3-code/mine-motion/' }
    ]
  }
})
