<script setup>
import {reactive} from "vue";
import {useUserStore} from "@/stores/useUserStore.js";

const dialogFormVisible = defineModel()
const formLabelWidth = '140px'
const form = reactive({
})
function logout() {
  dialogFormVisible.value = false
  useUserStore().clearUserInfo()
  window.location.href = "/"

}
</script>

<template>
  <el-dialog v-model="dialogFormVisible" title="评分" width="500">
    <el-form :model="form">
      <el-form-item label="真的要走了吗qaq" :label-width="formLabelWidth">
        <el-button  type="primary" plain @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" plain @click="logout" style="color: darkred">
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>

</style>