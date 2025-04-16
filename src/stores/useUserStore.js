import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        AvatarURL: '',   // 头像URL
        UID: '',   // 用户ID
        Name: '',  // 用户名
        RssSource: '' ,// rss源
        Email:localStorage.getItem('Email') ||'',
        remarks:'',
        Profile: '',
    }),
    actions: {
        setUserInfo(user) {
            this.AvatarURL = user.AvatarURL;
            this.UID = user.UID;
            this.Name = user.Name;
            this.RssSource = user.RssSource;
            this.Email = user.Email;
            localStorage.setItem('Email', user.Email);
            this.remarks = user.remarks;
            this.Profile = user.Profile;
        },
        // setRssSource(RssSource) {
        //     this.RssSource = RssSource;
        // },
        updateUserInfo(user){
            this.AvatarURL = user.AvatarURL;
            this.Name = user.Name;
            this.Email = user.Email;
            this.remarks = user.remarks;
            this.Profile = user.Profile;
        },
        clearUserInfo() {
            this.AvatarURL = '';
            this.UID = '';
            this.Name = '';
            this.RssSource = '';
            this.Email = '';
            this.remarks = '';
            this.Profile = '';
            localStorage.removeItem('Email');
        }
    }
});
