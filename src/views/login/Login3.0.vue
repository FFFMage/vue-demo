<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li v-for="item in menuTab" :key="item.id" :class="{'current' : item.current}" @click="toggerMenu(item)">{{ item.text }}</li>
      </ul>
      <el-form status-icon :model="LoginRuleForm" :rules="LoginRules" ref="LoginFormRef" label-position="top">
        <el-form-item label="邮箱" prop="email" class="whiteItem">
          <el-input v-model="LoginRuleForm.email" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="whiteItem">
          <el-input type="password" v-model="LoginRuleForm.password" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword" class="whiteItem" v-if="model === 'register'">
          <el-input type="password" v-model="LoginRuleForm.repassword" ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="validate" class="whiteItem" >
          <el-row>
            <el-col :span="15">
              <el-input v-model="LoginRuleForm.validate"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="success" @click="getCodeButton()" :disabled="validateCode_Data.status" style="width:100%;margin-left:13px">{{ validateCode_Data.text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="LoginSubmit('LoginFormRef')" class="LoginButton" :disabled="loginButtonStatus">{{ model === 'login' ? '登录' : '注册' }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validateEmail, validatePsd } from 'common/validate'
import { reactive, ref, onMounted, isRef, toRefs } from '@vue/composition-api'
import { GetCode, Register, Login } from 'network/login'
export default {
  name: 'login',
  /*
    vue 3.0 语法 (测试版本)
   */
  /*
    vue 3.0 中 data函数 生命周期钩子 ... 全都在setup函数中
    声明变量如果是 引用数据类型 则需使用reactive函数封装
                  基本数据类型 则需使用ref函数封装
      在setup中取值时不用this引用 可直接引用变量名 但基本数据类型需调用变量的value属性才可得到值
      许多this下的$emit,$refs 已被替换为context.emit .refs等等
    在setup函数中 methods已被取消 所有函数直接以let xx = () => {}声明即可
    isRef函数判断变量是否为ref对象 toRefs函数可将reactive对象转换为ref对象
   */
  setup(props, context) {
    // 验证码校验规则
    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    // 重复密码验证规则
    const repassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value !== LoginRuleForm.password) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    // 登录 注册 数据
    const menuTab = reactive(
      [
        { text: '登录', current: true, type: 'login' },
        { text: '注册', current: false, type: 'register' }
      ]
    )
    // 判断登录注册页面变量
    const model = ref('login')
    console.log(isRef(model))
    // 登录表单数据
    const LoginRuleForm = reactive(
      {
        email: '1274840883@qq.com',
        password: '',
        repassword: '',
        validate: ''
      }
    )
    // 登录表单验证
    const LoginRules = reactive(
      {
        email: [
          {
            validator: validateEmail,
            trigger: 'blur'
          }
        ],
        password: [
          {
            validator: validatePsd,
            trigger: 'blur'
          }
        ],
        repassword: [
          {
            validator: repassword,
            trigger: 'blur'
          }
        ],
        validate: [
          {
            validator: validateCode,
            trigger: 'blur'
          }
        ]
      }
    )
    // 验证码数据对象
    const validateCode_Data = reactive({
      status: false,
      text: '获取验证码'
    })
    // 登录 注册 按钮状态
    const loginButtonStatus = ref(true)
    // 定时器变量
    let time = ref(null)
    // 更新按钮状态事件
    const updateButtonStatus = (parmas = { status: false, text: '获取验证码' }) => {
      validateCode_Data.status = parmas.status
      validateCode_Data.text = parmas.text
    }
    // 登录 注册 切换事件
    const toggerMenu = (item) => {
      menuTab.forEach(elem => {
        elem.current = false
      })
      item.current = true
      model.value = item.type
      formRefresh('LoginFormRef')
      updateButtonStatus()
      clearInterval(time)
    }
    // 表单刷新
    const formRefresh = (ref) => {
      context.refs[ref].resetFields()
    }
    // 表单提交
    const LoginSubmit = (ref) => {
      context.refs[ref].validate(valid => {
        if (valid) {
          model.value === 'login' ? A_Login() : A_Register()
          toggerMenu(menuTab[0])
        } else {
          alert('error submit')
        }
      })
    }
    // 获取验证码按钮
    const getCodeButton = () => {
      if (!LoginRuleForm.email) {
        context.root.$message.error('请输入邮箱！')
        return
      }
      // 验证码 延迟 倒计时
      setTimeout(() => {
        A_GetCode()
        updateButtonStatus({ status: true, text: '已发送' })
        context.root.$message.success('验证码已发送')
        loginButtonStatus.value = false
        let count = 60
        time = setInterval(() => {
          count--
          if (count === 0) {
            clearInterval(time)
            updateButtonStatus({ status: false, text: '重新获取' })
            return
          }
          validateCode_Data.text = `请等候${count}秒`
        }, 1000)
      }, 0)
    }
    // 验证码请求
    const A_GetCode = async () => {
      try {
        const res = await GetCode({ username: LoginRuleForm.email })
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
    // 注册请求
    const A_Register = async () => {
      try {
        const data = {
          username: LoginRuleForm.email,
          password: LoginRuleForm.password,
          code: LoginRuleForm.validate,
          module: 'register'
        }
        const res = await Register(data)
        console.log(res)
        context.root.$message.success(`${res.message}`)
      } catch (error) {
        console.log(error)
      }
    }
    // 登录请求
    const A_Login = async () => {
      try {
        const data = {
          username: LoginRuleForm.email,
          password: LoginRuleForm.password,
          code: LoginRuleForm.validate
        }
        const res = await Login(data)
        console.log(res)
        context.root.$message.success(`${res.message}`)
        if (res.resCode === 0) {
          window.sessionStorage.setItem('token', res.data.token)
          context.root.$router.push('/home')
        } else {
          context.root.$message.error(`${res.message}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
    // 生命周期新写法 挂载完成后
    onMounted(() => {

    })
    // 所有变量将return抛出
    return {
      menuTab,
      model,
      LoginRuleForm,
      LoginRules,
      validateCode_Data,
      loginButtonStatus,
      time,
      toggerMenu,
      formRefresh,
      LoginSubmit,
      getCodeButton
    }
  }
}
</script>

<style lang="stylus" scoped>
#login
  height 100vh
  background-color #344a5f
.login-wrap
  width 330px
  margin 0 auto
  .menu-tab
    display flex
    text-align center
    justify-content center
    li
      width 88px
      line-height 36px
      font-size 14px
      color #fff
      border-radius 2px
      cursor pointer
.current
  background-color rgba(0, 0, 0, .1)
.whiteItem >>> .el-form-item__label
  color white
.LoginButton
  margin-top 13px
  width 100%
</style>
