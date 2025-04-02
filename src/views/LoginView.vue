<template>
  <div class="common-layout">
    <el-container>
      <el-header>小哆啦阅读器demo</el-header>
        <el-main>
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
          <Carousel />
          </div>
        </el-main>
      <el-footer>Footer</el-footer>
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
