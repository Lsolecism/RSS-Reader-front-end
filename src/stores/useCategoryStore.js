import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
    state: () => ({
        // 用户专属动态数据
        NextCategoryId: 1,
        HasLoaded: false,
        UserCategories: {
        },
    }),
    actions: {
        // 创建分组
        createCategory(name, rss_url) {
            const category = {
                Id: this.NextCategoryId++,
                Name:String(name),
                RssUrl: rss_url,
                Items: []
            };
            this.UserCategories[category.Id] = category
            return category.Id;
        },

        // 删除分组
        removeCategory(categoryId) {
            delete this.UserCategories[categoryId]
        },
        //添加内容
        addItem(categoryId, item) {
            this.UserCategories[categoryId].Items.push(item);
        },

        // 删除条目
        removeItem(categoryId, item) {
            if (!this.UserCategories[categoryId]) return;

            // 使用ID匹配删除
            this.UserCategories[categoryId].Items =
                this.UserCategories[categoryId].Items.filter(
                    currentItem => currentItem.id !== item.id
                );

            if (this.UserCategories[categoryId].Items.length === 0)
            {
                delete this.UserCategories[categoryId]
            }

        },
        setArticleIsReaded(link, IsReaded) {
            console.log('setArticleIsReaded')
            Object.keys(this.UserCategories).forEach(categoryId => {
                const category = this.UserCategories[categoryId];
                category.Items.forEach((item, index) => {
                    if (item.Link === link) {
                        // 使用 Vue.set 确保响应式更新
                        this.$patch(() => {
                            category.Items[index].IsReaded = IsReaded;
                        });
                    }
                });
            });
        },
        // getArticleIsReaded(link) {
        //     for (const category of Object.values(this.userCategories)) {
        //         const targetItem = category.items.find(item => item.cardLink === link);
        //         if (targetItem) return targetItem.isReaded;
        //     }
        //     return false;
        // },
        setLoadedStatus(status){
            this.HasLoaded = status
        }

    },
    getters: {
        fullCategories(state) {
            return Object.values(state.UserCategories)
        }
    }
})