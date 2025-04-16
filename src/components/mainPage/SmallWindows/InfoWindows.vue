<script setup>
import {ref, watch} from 'vue'
import { ElMessage } from 'element-plus'
import {Plus} from "@element-plus/icons-vue";
import {useUserStore} from "@/stores/useUserStore.js";

const userStore = useUserStore()
const dialogFormVisible = defineModel()

// 状态管理
const isEditing = ref(false)
const originalPhoto = ref(userStore.AvatarURL) // 保存原始头像的oid
const tempPhoto = ref(null) // 临时保存新上传的头像oid

const formData = ref({
  AvatarURL: originalPhoto,
  Name: userStore.Name,
  UID: userStore.UID,
  Email: userStore.Email,
  remarks: userStore.remarks,
  Profile: userStore.Profile
})

// 监听弹窗显示状态
watch(dialogFormVisible, (val) => {
  if (!val) {
    // 关闭弹窗时重置状态
    isEditing.value = false
    formData.value.AvatarURL = originalPhoto.value
    tempPhoto.value = null
  }
})

// 图片上传前校验
const beforeAvatarUpload = (file) => {
  const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB!')
  }
  return isImage && isLt5M
}

// 上传成功处理
const handleAvatarSuccess = async (response) => {
  console.log(response)
  if (response.success==='200') {
    tempPhoto.value = response.imageId
    formData.value.AvatarURL = tempPhoto.value // 预览新图片
    ElMessage.success('上传成功')
  } else {
    ElMessage.error( '上传失败')
  }
}

function handleEdit() {
  isEditing.value = true
}

// 保存处理
const handleSave = async () => {
  try {
    // 构造提交数据
    const payload = {
      AvatarURL: tempPhoto.value || originalPhoto.value,
      Name: formData.value.Name,
      Email: formData.value.Email,
      remarks: formData.value.remarks,
      Profile: formData.value.Profile
    }
    // 提交到后端
    const response = await fetch('http://localhost:5000/updateInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"newUserInfo":payload,"Email":userStore.Email})
    })
    const result = await response.json()
    if (result.success==='200') {
        // 更新本地存储
        userStore.updateUserInfo(payload)
        // 更新原始头像
        originalPhoto.value = payload.AvatarURL
        ElMessage.success('保存成功')
        dialogFormVisible.value = false
    } else {
      ElMessage.error(result.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error('网络请求失败')
  }
}

</script>

<template>
  <el-dialog v-model="dialogFormVisible" title="评分" width="500">
    <el-descriptions
        v-if="!isEditing"
        title="Width vertical list"
        direction="vertical"
        border
        style="margin-top: 20px"
    >
      <el-descriptions-item
          :rowspan="2"
          :width="140"
          label="Photo"
          align="center"
      >
        <el-image
            style="width: 100px; height: 100px"
            :src="`http://localhost:5000/image/${userStore.AvatarURL}`"
        />
      </el-descriptions-item>
      <el-descriptions-item label="Username">{{ formData.Name }}</el-descriptions-item>
      <el-descriptions-item label="UserID">{{ formData.UID }}</el-descriptions-item>
      <el-descriptions-item label="Email">{{ formData.Email }}</el-descriptions-item>
      <el-descriptions-item label="Remarks">
        <el-tag size="small">{{ formData.remarks }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Profile">{{ formData.Profile }}</el-descriptions-item>
    </el-descriptions>

<!--    表单如下    -->
    <el-form v-else :model="formData" label-width="100px" style="margin-top: 20px;">
      <el-form-item label="Photo">
        <el-upload
            class="avatar-uploader"
            action="http://localhost:5000/uploadImage"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <img v-if="formData.AvatarURL" :src="`http://localhost:5000/image/${formData.AvatarURL}`" class="avatar"  alt=""/>
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="Username">
        <el-input v-model="formData.Name" />
      </el-form-item>
      <el-form-item label="Telephone">
        <el-input v-model="formData.UID" />
      </el-form-item>
      <el-form-item label="Place">
        <el-input v-model="formData.Email" />
      </el-form-item>
      <el-form-item label="Remarks">
        <el-input v-model="formData.remarks" />
      </el-form-item>
      <el-form-item label="Address">
        <el-input v-model="formData.Profile" type="textarea" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="!isEditing" type="primary" @click="handleEdit">编辑</el-button>
        <el-button v-else type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
