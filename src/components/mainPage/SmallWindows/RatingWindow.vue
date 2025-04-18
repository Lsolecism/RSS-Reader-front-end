<script setup>
import {reactive, ref} from "vue";
import {ElNotification} from "element-plus";
import {useUserStore} from "@/stores/useUserStore.js";
const dialogFormVisible = defineModel()
const form = reactive({
  rating_value:'',
  feedback:''
})
const rating_value = ref(0)
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])

function submitForm() {
  dialogFormVisible.value = false
  console.log(rating_value.value)
  console.log(form.feedback)
  console.log(useUserStore().Email)
  fetch('http://localhost:5000/RSS/Rate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'rating', rating_value: rating_value.value, feedback: form.feedback,Email:useUserStore().Email })
  })
      .then(response => response.json())
      .then(data => {
        if (data.success==='200') {
          ElNotification({
            title: 'Success',
            message: '评分成功!',
            type: 'success',
          });
          rating_value.value = 0
          form.feedback = ''
        } else {
          ElNotification({
            title: 'Error',
            message: '出现未知错误'
        })
      }
    })
}
</script>

<template>
  <el-dialog v-model="dialogFormVisible" title="评分" style="width: 500px;">
    <el-form :model="form" >
      <el-form-item>
        <el-input
            v-model="form.feedback"
            type="textarea"
            :rows="6"
            placeholder="请输入意见反馈"
        ></el-input>
      </el-form-item>
      <el-form-item label="请给更多的✨小星星✨支持呀！" >
        <el-rate
            v-model="rating_value"
            :colors="colors"
            allow-half
            :texts="['太差了', '差', '一般', '好', '太棒了']"
            show-text
            clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false" >取消</el-button>
        <el-button type="primary" plain @click="submitForm" >
           确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
