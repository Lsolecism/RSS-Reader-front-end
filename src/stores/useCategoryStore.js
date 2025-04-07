// stores/useCategoryStore.js
import { defineStore } from 'pinia'
import {markRaw} from "vue";
import {
    Burger,
    Camera,
    Coffee,
    Cpu,
    Film,
    Headset,
    Money, More, Reading,
    Ship,
    ShoppingBag,
    Soccer,
    VideoPlay
} from "@element-plus/icons-vue";

// 静态常量数据（所有用户共享）
export const STATIC_CATEGORIES = [
    { icon: markRaw(Burger), text: '美食', id: 1},
    { icon: markRaw(Coffee), text: '休闲', id: 2},
    { icon: markRaw(ShoppingBag), text: '购物', id: 3},
    { icon: markRaw(Soccer), text: '运动', id: 4},
    { icon: markRaw(Cpu), text: '科技', id: 5},
    { icon: markRaw(Money), text: '金融', id: 6},
    { icon: markRaw(Ship), text: '旅行', id: 7},
    { icon: markRaw(Camera), text: '照相', id: 8},
    { icon: markRaw(VideoPlay), text: '视频', id: 9},
    { icon: markRaw(Film), text: '电影', id: 10},
    { icon: markRaw(Headset), text: '音乐', id: 11},
    { icon: markRaw(Reading), text: '阅读', id: 12},
    { icon: markRaw(More), text: '其他', id: 13}
]

export const useCategoryStore = defineStore('category', {
    state: () => ({
        // 用户专属动态数据
        userItems: {
            1: [
                {
                    title: "网红汉堡店",
                    comments: "爆汁牛肉汉堡一绝！",
                    imageSrc: "/images/burger.jpg",
                    cardLink: "/food/1"
                },
                {
                    title: "深夜食堂居酒屋",
                    comments: "日式烧鸟深夜好去处",
                    imageSrc: "https://ipfs.crossbell.io/ipfs/QmTbb2WpmvvM9LYr2w4ibhqB5icWMSa4n9hFjXbgbaKBRb",
                    cardLink: "/food/2"
                }
            ],
            3: [
                {
                    title: "星巴克",
                    comments: "星巴克，美妙又beans",
                    imageSrc: "/images/starbucks.jpg",
                    cardLink: "/food/3"
                },
                {
                    title: "KFC",
                    comments: "KFC，美妙又beans",
                    imageSrc: "/images/kfc.jpg",
                    cardLink: "/food/4"
                }
            ],
        } // 结构：{ [categoryId]: Item[] }
    }),
    actions: {
        // 初始化用户数据（从后端加载）
        async initUserItems(userId) {
            // const res = await fetch(`/api/user/${userId}/items`)
            // this.userItems = await res.json()
        },
        // 添加条目
        addItem(categoryId, item) {
            console.log("addItem", categoryId, item)
            console.log("this.userItems", this.userItems)
            if (!this.userItems[categoryId]) {
                this.userItems[categoryId] = []
            }
            this.userItems[categoryId].push(item)
            // this.syncToBackend(userId)
        },
        // 删除条目
        removeItem(categoryId, item) {
            // 确保分类条目已初始化
            if (!this.userItems[categoryId]) {
                this.userItems[categoryId] = [];
            }
            console.log("removeItem", categoryId, item)
            console.log("this.userItems", this.userItems)
            // 通过 cardLink 匹配并过滤（避免变量名冲突）
            this.userItems[categoryId] = this.userItems[categoryId].filter(
                currentItem => currentItem.cardLink !== item.cardLink  // 保留不匹配的项，移除匹配项
            );
            console.log("this.userItems", this.userItems)
            // this.syncToBackend(userId);  // 可选的后端同步
        },
        // 同步到后端
        async syncToBackend(userId) {
            try {
                const response = await fetch(`/api/${userId}/items`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.userItems),
                });

                // 添加 data 的定义 ✅
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || '同步失败');
                return data;
            } catch (err) {
                console.error('同步错误:', err);
                throw err; // 抛出错误供调用方处理
            }
        }
    },
    getters: {
        // 组合静态数据 + 动态数据
        fullCategories(state) {
            return STATIC_CATEGORIES.map(category => ({
                ...category,
                items: state.userItems[category.id] || []
            }))
        }
    }
})