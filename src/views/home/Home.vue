<template>
  <div id="home">
    <el-container>
      <el-aside :class="[isExpand ? 'close' : 'open']">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#344a5f"
          text-color="#fff"
          :collapse="isExpand"
          :unique-opened="true"
          :default-active="$route.path"
          router>
          <template v-for="subitem in submenu">
            <el-submenu :index="subitem.path" v-if="!subitem.hidde" :key="subitem.id">
              <template #title>
                <i :class="subitem.icon"></i>
                <span>{{ subitem.mate.name }}</span>
              </template>
              <el-menu-item v-for="item in subitem.children" :key="item.id" :index="`${item.path}`">{{ item.mate.name }}</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div>
            <div>
              <i class="el-icon-menu" @click="handleCollapse"></i>
            </div>
            <div>
              <span>管理员</span>
            </div>
            <div>
              <i class="el-icon-switch-button" @click="handleExit"></i>
            </div>
          </div>
        </el-header>
        <el-main>
            <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { reactive, ref, onMounted, isRef, toRefs } from '@vue/composition-api'
export default {
  name: 'home',
  setup(props, context) {
    // 导航栏 展开 状态变量
    const isExpand = ref(false)
    // 导航栏菜单数据
    const submenu = reactive(context.root.$router.options.routes)
    // 导航栏展开事件
    const handleCollapse = () => {
      isExpand.value = !isExpand.value
    }
    // 退出事件
    const handleExit = () => {
      window.sessionStorage.clear()
      context.root.$router.push('/login')
    }
    return {
      isExpand,
      submenu,
      handleCollapse,
      handleExit
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-menu-vertical-demo
  transition all .01s
.el-aside
  height 100vh
  background-color #344a5f
  .el-menu
    border-right none
.el-main
  background-color rgba(0,0,0,.1)
  :nth-child(1)
    width 100%
    height 100%
    background-color white
.el-submenu .el-menu-item
  text-indent 8px
.el-header
  padding 0
  >div
    display flex
    height 100%
    text-align center
    div
      height 100%
      display flex
      align-items center
      justify-content center
    >:nth-child(1),>:nth-child(3)
      flex 1
      font-size 24px
      cursor pointer
    >:nth-child(2)
      flex 10
      justify-content flex-end
      span
        margin-right 20px
    >:last-child
      border-left 1px solid rgba(0,0,0,.2)
.close
  width 80px !important
.open
  width 200px !important
</style>
