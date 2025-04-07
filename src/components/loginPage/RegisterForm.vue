<template>
  <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      label-width="auto"
      :rules="rules"
      class="demo-ruleForm"
  >
    <el-form-item label="Email" prop="email">
      <el-input v-model="ruleForm.email" />
    </el-form-item >
    <el-form-item label="Name" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="Password" prop="pass">
      <el-input
          v-model="ruleForm.pass"
          type="password"
          autocomplete="off"
          @blur="handleBlur"
          @focus="handleFocus"/>
    </el-form-item>
    <el-form-item label="Confirm" prop="confirm">
      <el-input
          v-model="ruleForm.checkPass"
          type="password"
          autocomplete="off"
          required
          @blur="handleBlur"
          @focus="handleFocus"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitRegisterForm()">
        Submit
      </el-button>
      <el-button @click="resetForm()">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import { ElNotification} from "element-plus";
import {useUserStore} from '@/stores/useUserStore'
import {useRouter} from "vue-router";

const ruleFormRef = ref(null)
const validateEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please input email'))
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
    callback(new Error('Invalid email format'))
  } else {
    callback()
  }
}
const validatePass = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Please input password'))
  } else if (value.length < 6) {
    callback(new Error('Password must be at least 6 characters'))
  } else {
    callback()
  }
}
const validateConfirm = (rule,value,callback)=>{
  if (ruleForm.checkPass !== ruleForm.pass) {
    console.log("zheshi valueya")
    console.log(ruleForm.pass,"dwqfc")
    callback(new Error('两次输入的密码不一致呀！😔'))
  } else {
    callback()
  }
}
const rules = reactive({
  email: [
    { required: true, trigger: 'blur', validator: validateEmail },
  ],
  pass: [
    { required: true, trigger: 'blur', validator: validatePass },
  ],
  confirm: [
    { required: true, trigger: 'blur', validator: validateConfirm },
  ],
  name: [
    { required: true, trigger: 'blur', message: '请输入你的昵称哦😀' },
  ],
})
const ruleForm = reactive({
  pass: '',
  checkPass: '',
  email:'',
  name:''
})
const resetForm = () => {
  ruleForm.pass = ''
  ruleForm.checkPass = ''
  ruleForm.email = ''
  ruleForm.name = ''
}

//处理注册的表单
async function submitRegisterForm()  {
  const encoder = new TextEncoder();
  const data = encoder.encode(ruleForm.pass);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'register', userEmail: ruleForm.email, password: hashedPassword, username:ruleForm.name })
  })
      .then(response => response.json())
      .then(data => {
          if (data.success ==="500") {
            //返回默认的设置
            useUserStore().setUserInfo({avatar: data.avatar, userId: data.userId, username:ruleForm.name})
            useUserStore().setRssSource('')
            ElNotification({
              title: 'Success',
              message: '注册成功!😀',
              type: 'success',
            });
            setTimeout(() => {
              const router =  useRouter()
              router.push({path:`/home/${data.user.userId}`})
            }, 1000);
          } else if (data.success === "200") {
            ElNotification({
              title: 'Error',
              message: '注册失败，邮箱重复😔',
              type: 'error',
            });
          }
      })
}

//处理小鹦鹉的动画逻辑
const emit = defineEmits(['focus','blur'])
const handleFocus = () => {
  emit('focus')
}
const handleBlur = () => {
  emit('blur')
}
</script>
