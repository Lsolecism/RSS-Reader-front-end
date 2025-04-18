import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import {useRssStore} from "@/stores/useRssStore.js";
import {useCategoryStore} from "@/stores/useCategoryStore.js";

const pinia = createPinia()
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(pinia)
const rssStore = useRssStore();
rssStore.initRSS().then(); // 不阻塞应用启动
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// 主应用入口添加监听
const syncBeforeUnload = () => {
    if (localStorage.getItem('Email')) {
        const data = {
            action: 'logout',
            Email: localStorage.getItem('Email'),
            saveData: useCategoryStore().filterReadItems()
        };

        // 使用 Beacon 发送数据
        const success = navigator.sendBeacon(
            'http://localhost:5000/exit/save/Beacon',
            new Blob([JSON.stringify(data)], { type: 'application/json' })
        );
        // 失败回退
        if (!success) {
            localStorage.setItem('pendingSaveData', JSON.stringify(data));
        }
    }
};
// 推荐使用 visibilitychange 替代 beforeunload
window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        syncBeforeUnload();
    }
});
// 兼容性回退
window.addEventListener('pagehide', syncBeforeUnload);
window.addEventListener('freeze', syncBeforeUnload);


