<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from "@/router/index.js";
import {useUserStore} from "@/stores/useUserStore.js";
const route = useRoute();

const Link = route.query.Link;
const RssId = route.query.RssId;
const HtmlContent = ref('');

// 从路由参数获取内容或调用API
onMounted(async () => {
  await fetch("http://localhost:5000/rss/article", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'getArticle', Link: Link ,RssId:RssId})
  }).then(response => response.json())
    .then(data => {
      if (data.success === "500"){
        HtmlContent.value = `<h1>${data["Article"]["Title"]}</h1>`
            +`<div style="font-size: 12px">by:${data["Article"]["Author"]}——published:${data["Article"]["Published"]}</div>
              <div style="font-size: 15px">${data["Article"]["Description"]}</div>
              <a style="font-size: 10px" href="${data["Article"]["Link"]}" target="_blank">原文链接</a>`
            +data["Article"].Content.Value;
      }
    })
});

const handleGoBack = () => {
  router.push({path:`/home/${useUserStore().UID}`})
};
</script>

<template>
  <div class="show-container">
    <el-button
        type="primary"
        class="back-btn"
        @click="handleGoBack"
    >
      ← 返回
    </el-button>
    <div
        class="content-wrapper"
        v-html="HtmlContent"
    ></div>
  </div>
</template>

<style scoped>
/* 添加全局样式（因为 v-html 内容不受 scoped 限制） */
.show-container :deep(.content-wrapper) {
  max-width: 1200px;
  margin: 0 auto;
  line-height: 1.8;
  font-size: 16px;
  color: #2c3e50;
}

.show-container :deep(h1) {
  font-size: 40px;
  margin: 30px 0 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #6c5ce7;
}
/* 标题美化 */
.show-container :deep(h2) {
  font-size: 35px;
  margin: 30px 0 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #6c5ce7;
}

.show-container :deep(h3) {
  font-size: 20px;
  margin: 25px 0 12px;
  color: #4a4a4a;
}

/* 图片美化 */
.show-container :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin: 15px auto;
  display: block;
}

/* 段落美化 */
.show-container :deep(p) {
  margin: 12px 0;
  font-size: 20px;
  text-align: justify;
}

/* 链接美化 */
.show-container :deep(a) {
  color: #6c5ce7;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.3s;
}

.show-container :deep(a:hover) {
  color: #a66efa;
  border-bottom-color: currentColor;
}

/* 列表美化 */
.show-container :deep(ul) {
  padding-left: 2em;
  margin: 15px 0;
}

.show-container :deep(li) {
  margin: 8px 0;
  position: relative;
}

.show-container :deep(li::before) {
  content: "•";
  color: #a66efa;
  position: absolute;
  left: -1em;
}

/* 代码块美化（如果包含代码） */
.show-container :deep(pre) {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 15px 0;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .show-container :deep(.content-wrapper) {
    padding: 15px;
    font-size: 14px;
  }

  .show-container :deep(h2) {
    font-size: 20px;
  }

  .show-container :deep(h3) {
    font-size: 18px;
  }
}


.back-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 1000;
}

.content-wrapper {
  margin-top: 50px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: white;
}
</style>
