import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('views/login/Login3.0')
const Home = () => import('views/home/Home')
const Console = () => import('views/home/Console')
const InfoList = () => import('views/home/childComps/info/InfoList')
const InfoCategroy = () => import('views/home/childComps/info/InfoCategroy')
const UserList = () => import('views/home/childComps/user/UserList')

const routes = [
  {
    path: '/',
    redirect: '/login',
    hidde: true
  },
  {
    path: '/login',
    component: Login,
    hidde: true,
    mate: {
      name: '登录'
    }
  },
  {
    path: '/home',
    component: Home,
    redirect: '/console',
    hidde: false,
    icon: 'iconfont iconkongzhitai',
    mate: {
      name: '控制台'
    },
    children: [
      {
        path: '/console',
        component: Console,
        mate: {
          name: '首页'
        }
      }
    ]
  },
  {
    path: '/info',
    hidde: false,
    component: Home,
    redirect: '/infolist',
    icon: 'iconfont iconbiaodan',
    mate: {
      name: '信息管理'
    },
    children: [
      {
        path: '/infolist',
        component: InfoList,
        mate: {
          name: '信息列表'
        }
      },
      {
        path: '/infocategroy',
        component: InfoCategroy,
        mate: {
          name: '信息分类'
        }
      }
    ]
  },
  {
    path: '/user',
    hidde: false,
    component: Home,
    redirect: '/userlist',
    icon: 'iconfont iconuser',
    mate: {
      name: '用户管理'
    },
    children: [
      {
        path: '/userlist',
        component: UserList,
        mate: {
          name: '用户列表'
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
