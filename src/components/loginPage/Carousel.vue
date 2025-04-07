<template>
  <el-main>
    <el-carousel :interval="4000" type="card" height="400px" :autoplay = "false" arrow = "never">
      <el-carousel-item v-for="(image, index) in carouselItems" :key="index" @click="handleCarouselChange(index)">
        <div class="carousel-image-container" @click="handleImageClick(image.link)">
          <img :src="image.src" :alt="image.alt" class="carousel-image" />
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="content-area" v-if="currentContent">
      <h3>{{ currentContent.title }}</h3>
      <p>{{ currentContent.description }}</p>
    </div>
  </el-main>
</template>

<script setup>
import {ref} from "vue";
import { usePictureStore } from '@/stores/usePictureStore.js'

const carouselStore = usePictureStore()
const carouselItems = carouselStore.items;
const currentContent = ref(carouselItems[0].content);


function handleImageClick(link) {
  window.open(link, '_blank'); // 在新标签页中打开链接
}


function handleCarouselChange(index) {
  currentContent.value = carouselItems[index].content; // 更新当前内容
}
</script>

<style scoped>
/* 图片容器样式 */
.carousel-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 图片样式 */
.carousel-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover; /* 确保图片完整显示，不裁剪 */
}
</style>
