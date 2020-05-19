<template>
  <div id="info_categroy">
    <el-row>
      <el-button type="danger" @click="addFirst">添加一级分类</el-button>
    </el-row>
    <el-row :gutter="40">
      <!-- 左侧为 树形新闻列表 -->
      <el-col :span="10">
        <el-tree
          :data="treeList.data"
          :node-key="treeList.data.id"
          :indent="8"
          :default-expand-all="true"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }" @mouseenter="handleMouseenter(node)"
            @mouseleave="handleMouseleave(node)">
            <span>{{ node.data.category_name }}</span>
            <span v-show="node.data.is_show">
              <el-button
                type="text"
                size="mini"
                @click="edit(node, data)"
                >
                编辑
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="append(data)">
                添加子级
              </el-button>
              <el-button
                type="text"
                size="mini"
                round
                @click="remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <!-- 右侧为 添加标签输入框  -->
      <el-col :span="14">
        <el-form
          ref="addCategroyFormRef"
          :model="addCategroyForm"
          label-width="110px">
          <el-form-item label="一级分类编辑" />
          <el-form-item label="一级分类名称:"   prop="fist_name" v-if="fist_name_input">
            <el-input v-model="addCategroyForm.fist_name" :disabled="fist_name_disabled"></el-input>
          </el-form-item>
          <el-form-item label="二级分类名称:" prop="second_name" v-if="second_name_input">
            <el-input v-model="addCategroyForm.second_name" :disabled="second_name_disabled"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="handleSubmit(submit_params.data)" :loading="submit_flag" :disabled="submit_disabled">确认</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive, ref, onMounted, isRef, toRefs, watch } from '@vue/composition-api'
import { addFirstCategory, deleteCateGroy, editCateGroy, addChildrenCategory } from 'network/info'
import { common } from 'network/common'
export default {
  name: 'info_categroy',
  setup(props, context) {
    const { getInfoCategory, category } = common()
    // 树形列表 数据
    const treeList = reactive({
      data: []
    })
    // 分类框 数据
    const addCategroyForm = reactive({
      fist_name: '',
      second_name: ''
    })
    // 编辑分类框 按钮事件参数
    const submit_params = reactive({
      data: {}
    })
    // 树形列表 按钮状态值
    const is_show = ref(false)
    // 添加一级分类框 状态值
    const fist_name_input = ref(true)
    // 添加二级分类框 状态值
    const second_name_input = ref(true)
    // 添加分类按钮 加载状态
    const submit_flag = ref(false)
    // 添加分类框 禁用状态
    const fist_name_disabled = ref(true)
    const second_name_disabled = ref(true)
    const submit_disabled = ref(true)
    // 树形列表编辑事件
    const edit = (node, data) => {
      second_name_input.value = false
      fist_name_disabled.value = false
      submit_disabled.value = false
      // 修改编辑分类框 按钮类型
      submit_params.data = { type: 'editCateGroy', node, data }
      addCategroyForm.fist_name = data.category_name
    }
    // 树形列表添加事件
    const append = (data) => {
      fist_name_disabled.value = true
      second_name_disabled.value = false
      submit_disabled.value = false
      addCategroyForm.fist_name = data.category_name
      // 修改添加子类分类框 按钮类型
      submit_params.data = { type: 'addChildrenCateGroy', data }
      console.log(data)
      // const newChild = { id: id++, label: 'testtest', children: [] }
    }
    // 树形列表删除按钮事件
    const remove = (node, data) => {
      context.root.confirm({
        content: '确认删除当前信息，确认将无法恢复！！',
        tip: '警告',
        type: 'error',
        ThenFn: removeTreeNode,
        val: {
          node,
          data
        }
      })
    }
    // 树形列表删除事件
    const removeTreeNode = ({ node, data }) => {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      deleteCateGroy({ categoryId: data.id }).catch((err) => {
        console.log(err)
      })
      children.splice(index, 1)
    }
    // 树形列表 鼠标移入 显示按钮事件
    const handleMouseenter = (node) => {
      if (!node.data.is_show) {
        // console.log(node)
        context.root.$set(node.data, 'is_show', false)
      }
      node.data.is_show = true
    }
    // 树形列表 鼠标移出 隐藏按钮事件
    const handleMouseleave = (node) => {
      node.data.is_show = false
    }
    // 编辑分类框按钮不同类型事件
    const handleSubmit = (params) => {
      submit_flag.value = true
      if (params.type === 'addCateGroy') {
        handleAddFirstCategory()
      }
      if (params.type === 'editCateGroy') {
        handleEditCateGroy(params.node, params.data)
      }
      if (params.type === 'addChildrenCateGroy') {
        handleAddChildrenCateGroy(params.data)
      }
      if (params.type === '') {
        context.root.$message({
          type: 'error',
          message: '请先选择类型!'
        })
        submit_flag.value = false
      }
    }
    // 添加一级分类事件
    const handleAddFirstCategory = () => {
      submit_flag.value = false
      addFirstCategory({ categoryName: addCategroyForm.fist_name }).then((res) => {
        if (res.resCode === 0) {
          context.root.$message({
            message: res.message,
            type: 'success'
          })
          // 添加数据后刷新视图
          // 第一种
          // getInfoCateGory()
          // 第二种
          treeList.data.push(res.data)
        }
      }).catch((err) => {
        console.log(err)
      })
      restForm('addCategroyFormRef')
    }
    // 修改分类 事件
    const handleEditCateGroy = (node, data) => {
      submit_flag.value = false
      editCateGroy({ id: data.id, categoryName: addCategroyForm.fist_name }).then((res) => {
        data.category_name = addCategroyForm.fist_name
        context.root.$message({
          type: 'success',
          message: '修改成功！'
        })
      }).catch((err) => {
        context.root.$message({
          type: 'error',
          message: '修改失败！'
        })
        console.log(err)
      })
      submit_params.data = { type: '' }
      restForm('addCategroyFormRef')
    }
    // 添加子级分类 事件
    const handleAddChildrenCateGroy = (data) => {
      submit_flag.value = false
      addChildrenCategory({ categoryName: addCategroyForm.second_name, parentId: data.id }).then(res => {
        if (res.resCode === 0) {
          if (!data.children) {
            context.root.$set(data, 'children', [])
          }
          data.children.push(res.data)
          context.root.$message.success(res.message)
        } else {
          context.root.$message.error(res.message)
        }
        restForm('addCategroyFormRef')
      })
    }
    // 添加一级分类 状态改变事件
    const addFirst = () => {
      second_name_input.value = false
      fist_name_disabled.value = false
      submit_disabled.value = false
      // 修改编辑分类框 按钮类型
      submit_params.data = { type: 'addCateGroy' }
    }
    // 表单重置事件
    const restForm = (formname) => {
      /**
       * 坑！！！！！！！！！！！！！！！！！！
       *  注意使用resetFields方法重置表单的前提
       *  必须为表单中每一个el-form-item添加prop属性
       *  prop属性的值为绑定数据字段名一致 才能使用此方法
       */
      context.refs[formname].resetFields()
    }
    // 监听 获取分类的数据
    watch(() => category.item, (newVal, oldVal) => {
      treeList.data = newVal
    })
    // 组件挂载
    onMounted(() => {
      getInfoCategory()
    })
    return {
      // reactive
      treeList,
      addCategroyForm,
      submit_params,
      // ref
      is_show,
      fist_name_input,
      second_name_input,
      submit_flag,
      fist_name_disabled,
      second_name_disabled,
      submit_disabled,
      // methods
      edit,
      append,
      remove,
      handleMouseenter,
      handleMouseleave,
      handleSubmit,
      addFirst
    }
  }
}
</script>

<style lang="stylus" scoped>
#info_categroy
  .el-row:nth-child(1)
    border-bottom 1px solid rgba(0,0,0,.3)
.el-row
  padding 25px 0
.el-form
  .el-form-item
    text-indent 5px
  .el-form-item:nth-child(1)
    font-weight bold
    font-size 24px
    background-color rgba(0,0,0,.1)
  .el-input
    max-width 300px
.custom-tree-node
  display flex
  flex 1
  align-items center
  justify-content space-between
  font-size 16px
  // padding-right 50px
  // margin-right 50px
  >>> .is-round
    padding 0 10px 0 0
</style>
