<template>
  <img ref="preview" src="" alt="图片预览">
  <input ref="imageInput" type="file" accept="image/*">
  <button @click="uploadImage">上传图片</button>
</template>

<script setup>
import { ref } from 'vue'

// 创建模板引用
const preview = ref(null)
const imageInput = ref(null)

async function uploadImage() {
  // 验证文件选择
  if (!imageInput.value?.files?.[0]) {
    console.error('请选择文件')
    return
  }

  const file = imageInput.value.files[0]
  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (response.ok) {
      // 更新图片预览（推荐使用 URL.createObjectURL 实现本地预览）
      // preview.value.src = URL.createObjectURL(file)
      // 如果需要显示服务器返回的图片
      console.log('上传成功:', data.imageId)
      preview.value.src = `http://localhost:5000/image/${data.imageId}`
    } else {
      console.error('上传失败:', data.error)
    }
  } catch (error) {
    console.error('上传错误:', error)
  } finally {
    // 可选：清空文件选择
    imageInput.value.value = ''
  }
}
</script>
