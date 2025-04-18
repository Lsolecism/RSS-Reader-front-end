<script setup>
import {reactive} from "vue";
import {useUserStore} from "@/stores/useUserStore.js";
import {useCategoryStore} from "@/stores/useCategoryStore.js";
import {ElNotification} from "element-plus";

const dialogFormVisible = defineModel()
const formLabelWidth = '140px'
const form = reactive({
})
function logout(){
  dialogFormVisible.value = false
  try {
    fetch('http://localhost:5000/exit/save', {
      method: 'POST',
      credentials: 'include', // 必须设置
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({action:'logout',Email:localStorage.getItem('Email'),
        saveData:useCategoryStore().filterReadItems()})})
        .then(response => response.json())
        .then(data =>{
          console.log(data)
        })
  }
  catch (e) {
    ElNotification.error({
      title: '错误',
      message: '保存出现未知错误/(ㄒoㄒ)/~~'
    });
  }
  useUserStore().clearUserInfo()
  useCategoryStore().clearUserCategories()
  window.location.href = "/"
}
function aaa(){
  console.log(useCategoryStore().filterReadItems())
}
</script>

<template>
  <el-dialog v-model="dialogFormVisible" title="评分" width="500">
    <el-form :model="form">
      <el-form-item label="真的要走了吗qaq" :label-width="formLabelWidth" @click="aaa()">
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