import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
    state: () => ({
        // 用户专属动态数据
        nextCategoryId: 3,
        userCategories: {
            // 新结构示例
            1: {
                id: 1,
                name: '美食',
                items: [
                    {
                        id: Date.now(), // 使用时间戳作为临时ID
                        title: "网红汉堡店",
                        description: "爆汁牛肉汉堡一绝！",
                        imageSrc: "/images/burger.jpg",
                        cardLink: "/food/1"
                    }
                ]
            },
            2: {
                id: 2,
                name: '购物',
                items: [
                    {
                        id: Date.now(), // 使用时间戳作为临时ID
                        title: "星巴克",
                        description: "星巴克，美妙又beans",
                        imageSrc: "/images/starbucks.jpg",
                        cardLink: "/food/3"
                    }
                ]
            }
        },
    }),
    actions: {
        // 创建分组
        createCategory(name) {
            const category = {
                id: this.nextCategoryId++,
                name,
                items: []
            };
            this.userCategories[category.id] = category
            return category.id;
        },

        // 删除分组
        removeCategory(categoryId) {
            delete this.userCategories[categoryId]
        },
        //添加内容
        addItem(categoryId, item) {
            this.userCategories[categoryId].items.push(item);
        },

        // 删除条目
        removeItem(categoryId, item) {
            if (!this.userCategories[categoryId]) return;

            // 使用ID匹配删除
            this.userCategories[categoryId].items =
                this.userCategories[categoryId].items.filter(
                    currentItem => currentItem.id !== item.id
                );

            if (this.userCategories[categoryId].items.length === 0)
            {
                delete this.userCategories[categoryId]
            }

        }
    },
    getters: {
        fullCategories(state) {
            return Object.values(state.userCategories)
        }
    }
})
// actions: {
//     // 初始化用户数据（从后端加载）
//     async initUserItems(userId) {
//         // const res = await fetch(`/api/user/${userId}/items`)
//         // this.userItems = await res.json()
//     },
//     // 添加条目
//     addItem(categoryId, item) {
//         console.log("addItem", categoryId, item)
//         console.log("this.userItems", this.userItems)
//         if (!this.userItems[categoryId]) {
//             this.userItems[categoryId] = []
//         }
//         this.userItems[categoryId].push(item)
//         // this.syncToBackend(userId)
//     },
//     // 删除条目
//     removeItem(categoryId, item) {
//         // 确保分类条目已初始化
//         if (!this.userItems[categoryId]) {
//             this.userItems[categoryId] = [];
//         }
//         console.log("removeItem", categoryId, item)
//         console.log("this.userItems", this.userItems)
//         // 通过 cardLink 匹配并过滤（避免变量名冲突）
//         this.userItems[categoryId] = this.userItems[categoryId].filter(
//             currentItem => currentItem.cardLink !== item.cardLink  // 保留不匹配的项，移除匹配项
//         );
//         console.log("this.userItems", this.userItems)
//         // this.syncToBackend(userId);  // 可选的后端同步
//     },
//     // 同步到后端
//     async syncToBackend(userId) {
//         try {
//             const response = await fetch(`/api/${userId}/items`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(this.userItems),
//             });
//
//             // 添加 data 的定义 ✅
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message || '同步失败');
//             return data;
//         } catch (err) {
//             console.error('同步错误:', err);
//             throw err; // 抛出错误供调用方处理
//         }
//     }
// },
// getters: {
//     // 组合静态数据 + 动态数据
//     fullCategories(state) {
//         return STATIC_CATEGORIES.map(category => ({
//             ...category,
//             items: state.userItems[category.id] || []
//         }))
//     }
// }