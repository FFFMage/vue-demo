<template>
  <el-dialog
    width="30%"
    :visible.sync="dialogVisible"
    title="新增"
    @close="handleClose"
    @open="handleOpen">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="类别：" prop="category">
        <el-select v-model="form.category" placeholder="请选择">
          <el-option  v-for="item in form.category_list" :key="item.id" :label="item.category_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" prop="title">
        <el-input v-model="form.title" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="概况：" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="8" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item class="dialog_button_input">
        <el-button class="dialog_button" @click="handleClose">取消</el-button>
        <el-button type="danger" class="dialog_button" @click="handleSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { reactive, ref, onMounted, watch } from '@vue/composition-api'
import { addInfoList, getList, editInfoList } from 'network/info'
export default {
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, context) {
    const form = reactive({
      category: '',
      title: '',
      content: '',
      categoryId: '',
      id: '',
      imgUrl: '',
      category_list: [],
      row_info: {}
    })
    const dialogType = ref('')
    const dialogVisible = ref(false)
    // 对话框关闭事件
    const handleClose = () => {
      // if (dialogType.value === 'add') {
      //   context.emit('update:flag', false)
      //   context.emit('updateView')
      //   context.refs.form.resetFields()
      // }
      // if (dialogType.value === 'edit') {
      //   context.emit('update:flag', false)
      //   context.emit('updateView')
      //   context.refs.form.resetFields()
      // }
      context.emit('update:flag', false)
      context.emit('updateView')
      context.refs.form.resetFields()
    }
    // 对话框打开事件
    const handleOpen = () => {
      form.category_list = props.category
      if (dialogType.value === 'add') {
        form.category = ''
        form.content = ''
        form.title = ''
      }
      if (dialogType.value === 'edit') {
        form.category = form.row_info.categoryId
        form.content = form.row_info.content
        form.title = form.row_info.title
        form.id = form.row_info.id
        form.categoryId = form.row_info.categoryId
      }
    }
    // 提交数据
    const handleSubmit = async () => {
      if (dialogType.value === 'add') {
        try {
          const res = await addInfoList({ ...form })
          if (res.resCode === 0) {
            context.root.$message.success(res.message)
            // context.refs.form.resetFields()
            handleClose()
          } else {
            context.root.$message.error(res.message)
          }
        } catch (error) {
          console.log(error)
        }
      }
      if (dialogType.value === 'edit') {
        try {
          const res = await editInfoList({ ...form })
          if (res.resCode === 0) {
            context.root.$message.success(res.message)
            // context.refs.form.resetFields()
            handleClose()
          } else {
            context.root.$message.error(res.message)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    watch(() => props.flag, (newValue, oldValue) => {
      dialogVisible.value = newValue
    })
    watch(() => props.type, (newValue, oldValue) => {
      dialogType.value = newValue
    })
    watch(() => props.row, (newValue, oldValue) => {
      form.row_info = newValue
    })
    return {
      // ref
      dialogType,
      dialogVisible,
      // reactive
      form,
      // methods
      handleClose,
      handleOpen,
      handleSubmit
    }
  }
}
</script>
<style lang="stylus">
.el-dialog__body
  padding-right 40px !important
.dialog_button_input
  display flex
  justify-content center
  .dialog_button
    width 150px
    margin 0 20px
</style>
