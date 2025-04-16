<template>
  <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
  >
    <div v-if="isLogin">
      <el-form-item  label="Email" prop ="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item >

      <el-form-item label="Password" prop="pass" >
        <el-input v-model="ruleForm.pass" type="password" autocomplete="off" @blur="handleBlur()" @focus="handleFocus()" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" plain @click="submitLoginForm()">
          登陆
        </el-button>
        <el-button @click="resetForm()">清空</el-button>
      </el-form-item>
    </div>
    <div v-else>
      <el-form-item  label="Email" prop ="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item >

      <el-form-item label="Verification" >
        <el-input v-model="verifiCation" @blur="handleBlur()" @focus="handleFocus()">
          <template #append>
            <el-button @click="getVerification" :disabled="countdown>0">
              <el-text v-if="countdown <=0">获取验证码<el-icon><Message/></el-icon></el-text>
              <el-text v-else>未获取到？重新发送({{countdown}}s)<el-icon><Refresh /></el-icon></el-text>
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" plain @click="submitLoginVerificationForm()">
          登录
        </el-button>
        <el-button @click="resetForm()">
          重置
        </el-button>
      </el-form-item>
    </div>

    <el-form-item>
      <el-link v-if="isLogin" @click="isLogin = !isLogin">使用验证码登录😂</el-link>
      <el-link v-else @click="isLogin = !isLogin">使用密码登录😂</el-link>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {onUnmounted, reactive, ref} from 'vue'
import {ElNotification} from "element-plus";
import {useUserStore} from '@/stores/useUserStore'
import {Message, Refresh} from "@element-plus/icons-vue";
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()
axios.defaults.withCredentials = true;
const verifiCation = ref('')
const isLogin = ref(true)
const countdown = ref(0)
let timer = null

//提交验证码表单的逻辑函数
async function submitLoginVerificationForm(){
  fetch('http://localhost:5000/login', {
    method: 'POST',
    credentials: 'include', // 必须设置
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'loginVerification', userEmail: ruleForm.email, verification: verifiCation.value })
  })
    .then(response => response.json())
    .then(data =>{
      if (data.success === '500') {
        //当data.success为500时，说明登录成功，可以进行后续操作
        //获取user的信息，并设置到store中
        // 当前后端还没写data.user
        useUserStore().setUserInfo(data.user)
        ElNotification({
          title: 'Success',
          message: '登录成功，正在跳转中...',
          type: 'success',
        });
        setTimeout(() => {
          router.push({path:`/home/${data.user.UID}`})
        }, 1000);
      }
    })
}

//发送验证码的逻辑对应后端处理代码为：handle_verification
// 发送验证码的优化版本
async function getVerification() {
  if (countdown.value > 0) {
    ElNotification.warning({
      title: '提示',
      message: `请${countdown.value}秒后再试`
    });
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getVerification',
        userEmail: ruleForm.email
      })
    });

    const data = await response.json();
    if (data.success === "200") {
      startCountdown();
      ElNotification.success({
        title: '成功',
        message: '验证码发送成功，请注意查收！😀'
      });
    } else if (data.success === "500") {
      ElNotification.error({
        title: '错误',
        message: '邮箱不存在，请检查邮箱或前往注册呀！😂'
      });
    }
  } catch (error) {
    ElNotification.error({
      title: '错误',
      message: `发生错误：${error.message || '验证码发送失败，请稍后再试！'}`
    });
  }
}

// 倒计时逻辑封装
function startCountdown() {
  countdown.value = 30;
  timer = setInterval(() => {
    countdown.value = Math.max(0, countdown.value - 1);
    if (countdown.value === 0) {
      clearInterval(timer);
    }
  }, 1000);
}


//表单验证的逻辑
const ruleFormRef = ref(null);
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
const rules = reactive({
  email: [
    { required: true, trigger: 'blur', validator: validateEmail },
  ],
  pass: [
    { required: true, trigger: 'blur', validator: validatePass },
  ],
})
const ruleForm = reactive({
  pass: '',
  email:'',
})
const resetForm = () => {
  ruleForm.email = ''
  ruleForm.pass = ''
}

//处理小猫头鹰动画的逻辑
const emit = defineEmits(['focus', 'blur'])
const handleFocus = () => {
  emit('focus')
}
const handleBlur = () => {
  emit('blur')
}

onUnmounted(()=>{
  if(timer){
    clearInterval(timer)
  }
})
//处理登录的提交表单的逻辑
async function submitLoginForm()
{
  const encoder = new TextEncoder();
  const data = encoder.encode(ruleForm.pass);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashedPassword = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');

  fetch('http://localhost:5000/login', {
    method: 'POST',
    credentials: 'include', // 必须设置
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'login', userEmail: ruleForm.email, password: hashedPassword })
  })
      .then(response => response.json())
      .then(data => {
          if (data.success === "500") {
            //当data.success为500时，说明登录成功，可以进行后续操作
            //获取user的信息，并设置到store中
            useUserStore().setUserInfo(data.user)
            ElNotification({
              title: 'Success',
              message: '登录成功呀!😀',
              type: 'success',
            });
            setTimeout(() => {
              router.push({ name: 'home', params: { id: data.user.UID } })
            }, 1000);
          }else if (data.success === "200") {
            //当data.success为200时，说明邮箱不存在
            ElNotification({
              title: 'Error',
              message: '邮箱不存在，请检查邮箱或前往注册呀！😂',
              type: 'error',
            });
          }
          else if (data.success === "400") {
            //当data.success为400时，说明密码错误
            ElNotification({
              title: 'Error',
              message: '密码错误，请检查密码！😈',
              type: 'error',
            });
          }
          else {
            ElNotification({
              title: 'Error',
              message: '验证失败，请检查用户名和密码！',
              type: 'error',
            });
          }
      })
}
</script>
