<template>
  <div class="common-layout">
    <el-container>
      <el-header class="app-header">
        <div class="header-content">
          <div class="logo-image">
            <img src="@/assets/doraemon.png" alt="logo" class="logo-img">
          </div>
          <h1 class="logo-text">
            <i class="fas fa-book-reader"></i> <!-- Font Awesome 图标 -->
            小哆啦阅读器
          </h1>
          <div class="demo-tag">DEMO</div>
        </div>
      </el-header>

      <el-container>
<!--        <code-rain style="margin-top: 20px"/>-->
        <el-container class="main-container">

          <el-main class="container-item">
            <div>介绍</div>
          </el-main>

          <el-main class="container-item">
            <div>不知道放什么</div>
          </el-main>

          <el-main class="container-item" style="margin-top: 20px;z-index: 2">
            <div class="justify-center">
              <div class="login-wrapper">
                <!-- Owl 组件 -->
                <Owl :close-eyes="isFocus" class="owl-container"/>
                <!-- 登录表单容器 -->
                <div class="login-container">
                  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="Login" name="first">
                      <login-form @focus="handleFocus" @blur="handleBlur" />
                    </el-tab-pane>
                    <el-tab-pane label="Register" name="second">
                      <register-form @focus="handleFocus" @blur="handleBlur" />
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>

      <el-main>
        <el-text class="rss-title" style="margin-top: 20px">RSS相关</el-text>
        <Carousel  style="margin-top: 20px;"/>
      </el-main>

      <el-footer  style="text-align: center">
        <p>&copy; 2025 小哆啦阅读器. All rights reserved.</p>
        <p>联系我们: 1738978509@qq.com</p>
        <p>隐私政策 | 使用条款</p>
      </el-footer>

    </el-container>
  </div>

  <el-backtop :right="100" :bottom="100" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import LoginForm from "@/components/loginPage/LoginForm.vue";
import RegisterForm from "@/components/loginPage/RegisterForm.vue";
import Owl from "@/components/loginPage/Owl.vue";
import Carousel from "@/components/loginPage/Carousel.vue";
import codeRain from "@/components/backPage/codeRain.vue";

const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const handleFocus = () => {
  isFocus.value = true
}
const handleBlur = () => {
  isFocus.value = false
}
const isFocus = ref(false)
</script>

<style scoped>

/* 在 LoginView.vue 的 style 部分添加 */
.app-header {
  background: #ffffff; /* 设置背景为白色 */
  height: 80px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}
.rss-title {
  font-size: 1.8rem; /* 增大字体大小 */
  color: #333; /* 设置文字颜色 */
  font-weight: bold; /* 加粗字体 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* 添加轻微阴影 */
  margin-bottom: 10px; /* 增加底部间距 */
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 30px; /* 增加左右内边距 */
}

.logo-image {
  height: 82px;
  width: 82px;
  margin-right: 15px;
  transition: transform 0.3s ease;
}


.logo-img {
  height: 100%;
  width: 100%;
  object-fit: contain;

}

.logo-text {
  color: #2c3e50; /* 深蓝色文字 */
  font-size: 2rem;
  font-family: 'Alibaba PuHuiTi', sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 轻微阴影提升对比度 */
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.logo-text:hover {
  transform: scale(1.02);
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
}

.demo-tag {
  background: rgba(255, 255, 255, 0.8);
  color: #1E90FF; /* 道奇蓝文字 */
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  border: 1px solid #87CEEB;
}

@media (max-width: 768px) {
  .logo-image {
    height: 50px;
    width: 50px;
    margin-right: 10px;
  }

  .logo-text {
    font-size: 1.5rem;
  }

  .demo-tag {
    display: none; /* 小屏隐藏 DEMO 标签 */
  }
}

/* 外层容器使用 flex 布局 */
.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
}

/* Owl 组件的样式 */
.owl-container {
  margin-bottom: 0; /* Owl 和 el-tabs 之间的间距 */
}

/* 登录容器的样式 */
.login-container {
  max-width: 600px;
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* 鼠标悬停时的阴影效果 */
.login-container:hover {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.2);
}

/* Element Plus 的 tabs 样式 */
.demo-tabs {
  width: 100%;
}

</style>
