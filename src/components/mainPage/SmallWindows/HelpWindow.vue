<template>
  <el-dialog v-model="dialogFormVisible" title="帮助与资源" width="500" class="help-dialog">
    <el-row :gutter="20">
      <el-col :span="24" v-for="(link, index) in links" :key="index">
        <el-link
            :href="link.url"
            target="_blank"
            class="help-link"
        >
          {{ link.text }}
        </el-link>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup>
const dialogFormVisible = defineModel();
const links = [
  { text: 'RSSHub文档', url: 'https://docs.rsshub.app/zh/guide/' },
  { text: 'RSS使用技巧', url: 'https://diygod.cc/ohmyrss' },
  { text: 'RSS生态', url: 'https://docs.rsshub.app/zh/ecosystem' },
  { text: 'RSSHub源码', url: 'https://github.com/DIYgod/RSSHub' },
  { text: '小哆啦阅读器源码', url: 'https://github.com/Lsolecism/RSS-Reader-front-end' },
];
</script>

<style scoped>
.help-dialog {
  background-color: #f9f9f9; /* 背景色 */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.help-link {
  display: block;
  font-size: 16px;
  color: #409EFF;
  transition: color 0.3s, text-decoration 0.3s;
  padding: 10px; /* 链接内边距 */
  border: 1px solid transparent; /* 边框 */
  border-radius: 4px; /* 圆角 */
}

.help-link:hover {
  color: #66b1ff;
  text-decoration: underline;
  background-color: rgba(64, 158, 255, 0.1); /* 悬停时背景色 */
  border: 1px solid #66b1ff; /* 悬停时边框颜色 */
}
</style>
