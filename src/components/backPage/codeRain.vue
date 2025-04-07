<template>
  <div ref="codeRain" id="code-rain"></div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {onBeforeRouteLeave} from "vue-router";

const config = {
  rainChars: "最喜欢哆啦A梦啦"
};

const codeRain = ref(null);

class RainDrop {
  constructor() {
    this.char = config.rainChars[Math.floor(Math.random() * config.rainChars.length)];
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * -20;
    this.speed = Math.random() + 1; // 调整速度范围
  }

  update() {
    this.y += this.speed;
    if (this.y > window.innerHeight) {
      this.y = -20;
      this.x = Math.random() * window.innerWidth;
      this.char = config.rainChars[Math.floor(Math.random() * config.rainChars.length)];
    }
  }

  draw() {
    const span = document.createElement('span');
    span.textContent = this.char;
    span.style.position = 'absolute';
    span.style.left = `${this.x}px`;
    span.style.top = `${this.y}px`;
    span.style.zIndex = '1'; // 设置较低的 z-index
    span.style.opacity = '0.7'; // 设置透明度
    codeRain.value.appendChild(span);
  }
}

const drops = [];
for (let i = 0; i < 100; i++) {
  drops.push(new RainDrop());
}

function animate() {
  requestAnimationFrame(animate);
  if (codeRain.value) {
    codeRain.value.innerHTML = ''; // 仅在 codeRain.value 存在时执行
  }
  drops.forEach(drop => {
    drop.update();
    drop.draw();
  });
}

onMounted(() => {
  if (codeRain.value) {
    animate(); // 只有在组件挂载后才开始动画
  }
});
onBeforeUnmount(() => {
  cancelAnimationFrame(animate);
  if (codeRain.value) {
    codeRain.value.innerHTML = ''; // 在组件卸载时清理
  }
});

onBeforeRouteLeave(() => {
  // 在路由切换之前停止动画
  cancelAnimationFrame(animate);
});
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#code-rain {
  position: absolute;
  width: 100%;
  height: 100%;
  color: #00fdf8;
  font-family: monospace;
  font-size: 18px;
  pointer-events: none; /* 使字符雨不阻止与其他元素的交互 */
}
</style>
