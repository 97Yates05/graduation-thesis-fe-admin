import { defineConfig } from 'umi';

export default defineConfig({
  antd: {},
  extraPostCSSPlugins: [require('tailwindcss'), require('autoprefixer')],
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/industry-chain', component: '@/pages/industryChain/index' },
  ],
  fastRefresh: {},
  qiankun: {
    slave: {},
  },
});
