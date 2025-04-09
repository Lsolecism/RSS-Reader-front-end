<template>
  <el-card class="enhanced-card" @click="sendCardLink">
    <template #header>
      <div class="card-header">
        {{ title }}
        <div class="header-underline"></div>
      </div>
    </template>

    <div class="card-content">
      <div class="image-wrapper">
        <img
            :src="imageSrc"
            class="card-image"
            alt="内容预览图"
            @error="handleImageError"
        />
      </div>

      <div class="text-container">
        <span class="line-text">{{ description }}</span>
      </div>
    </div>

    <!-- 动态粒子背景 -->
    <div v-if="enableEffects" class="particles">
      <div v-for="(p, index) in particles" :key="index" class="particle"></div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {useUserStore} from "@/stores/useUserStore.js";
import router from "@/router/index.js";



function sendCardLink() {
  router.push({ path: '/show', query: { link: props.cardLink,userId:useUserStore().userId ,title: props.title } });
}

const props = defineProps({
  // 原有props保持不变
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageSrc: { type: String, required: true },
  cardLink: { type: String, required: true },
  // 新增效果开关
  enableEffects: { type: Boolean, default: true }
});

// 图片错误处理
const handleImageError = (e) => {
  e.target.src = 'https://picsum.photos/400/300';
  e.target.style.opacity = '0.8';
};

// 动态粒子
const particles = ref([]);
const initParticles = () => {
  particles.value = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.2
  }));
};

onMounted(() => {
  if(props.enableEffects) initParticles();
});
</script>

<style scoped>
.enhanced-card {
  --primary-color: #6c5ce7;
  --secondary-color: #a66efa;
  --text-color: #2c3e50;
  --bg-start: #f8f9fa;
  --bg-end: #e9ecef;

  width: 90%;
  max-width: 500px;
  min-height: 380px;
  margin: 1rem auto;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(145deg, var(--bg-start), var(--bg-end));
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.3);
}

.enhanced-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

/* 标题样式 */
.card-header {
  position: relative;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-color);
  padding: 0 0 1rem;
  letter-spacing: 0.05em;
}

.header-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transition: width 0.3s ease;
}

.enhanced-card:hover .header-underline {
  width: 100%;
}

/* 图片容器 */
.image-wrapper {
  position: relative;
  border-radius: 12px;
  height: 240px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  background: linear-gradient(45deg,
  rgba(255,255,255,0.1) 0%,
  rgba(255,255,255,0) 100%);
}

.card-image:hover {
  transform: scale(1.05);
}

/* 文本区域 */
.text-container {
  flex: 1;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

.line-text {
  font-size: clamp(1rem, 2vw, 1.4rem);
  line-height: 1.6;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  padding: 0.5rem 0;
}

.line-text::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transition: width 0.3s ease;
}

.enhanced-card:hover .line-text::after {
  width: 100%;
}

/* 动态粒子 */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(108,92,231,0.2);
  border-radius: 50%;
  animation: float 4s infinite;
  opacity: 0;
}

@keyframes float {
  0%, 100% {
    transform: translate(calc(var(--x) * 100%), calc(var(--y) * 100%));
    opacity: 0;
  }
  50% {
    opacity: 1;
    filter: blur(1px);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .enhanced-card {
    min-height: auto;
    padding: 1rem;
  }

  .card-content {
    flex-direction: column;
  }

  .image-wrapper {
    max-width: 100%;
    margin-bottom: 1.5rem;
  }

  .card-image {
    height: 200px;
  }
}

/* 材质纹理 */
.enhanced-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
      45deg,
      transparent 48%,
      rgba(255,255,255,0.1) 50%,
      transparent 52%
  );
  animation: shine 8s infinite linear;
  opacity: 0.3;
}

@keyframes shine {
  0% { transform: translate(-50%, -50%); }
  100% { transform: translate(0%, 0%); }
}
</style>
