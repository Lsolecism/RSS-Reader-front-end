import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',   // 头像URL
        userId: '',   // 用户ID
        username: '陈仪瑜',  // 用户名
        rssSource: '' ,// rss源
        email:'',
        remarks:'',
        profile: '',
    }),
    actions: {
        setUserInfo(user) {
            this.avatar = user.avatar;
            this.userId = user.userId;
            this.username = user.username;
        },
        setRssSource(rss_source) {
            this.rssSource = rss_source;
        },
        updateUserInfo(user){
            this.avatar = user.avatar;
            this.username = user.username;
            this.email = user.email;
            this.remarks = user.remarks;
            this.profile = user.profile;
        }
    }
});
