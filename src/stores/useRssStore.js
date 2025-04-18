import { defineStore } from "pinia";

export const useRssStore = defineStore('Rss', {
    state: () => ({
        tableData: [],
        isLoading: false,  // 新增加载状态
        error: null        // 新增错误信息
    }),
    actions: {
        async initRSS() {
            this.isLoading = true;
            try {
                const response = await fetch('http://localhost:5000/RSS/Edit', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                const rawData = await response.json();

                // 转换逻辑保留在 Store
                this.tableData = rawData.map(item => ({
                    ...item,
                    State: item.State === "200" ? "正常" : "异常"
                }));

            } catch (error) {
                this.error = error;
                console.error("初始化失败:", error);
            } finally {
                this.isLoading = false;
            }
        }
    }
})
