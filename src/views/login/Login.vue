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
        <el-form-item label="验证码" prop="vaildate" class="whiteItem" >
          <el-row :gutter="20">
            <el-col :span="15">
              <el-input v-model.number="LoginRuleForm.vaildate"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="success">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="LoginSubmit('LoginFormRef')" class="LoginButton">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validateEmail, validatePsd, validateCode } from 'common/validate'
export default {
  name: 'login',
  data() {
    const repassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value !== this.LoginRuleForm.password) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      menuTab: [
        { text: '登录', current: true, type: 'login' },
        { text: '注册', current: false, type: 'register' }
      ],
      model: 'login',
      LoginRuleForm: {
        email: '',
        password: '',
        repassword: '',
        vaildate: ''
      },
      LoginRules: {
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
        vaildate: [
          {
            validator: validateCode,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 登录 注册 切换事件
    toggerMenu(item) {
      this.menuTab.forEach(elem => {
        elem.current = false
      })
      item.current = true
      this.model = item.type
      this.formRefresh('LoginFormRef')
    },
    // 表单刷新
    formRefresh(ref) {
      this.$refs[ref].resetFields()
    },
    // 表单提交
    LoginSubmit(ref) {
      this.$refs[ref].validate(valid => {
        if (valid) {
          alert('submit')
        } else {
          alert('error submit')
        }
      })
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
