<template>
  <div id="info_list">
    <!-- 菜单栏 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-row :gutter="8">
        <el-col :span="3">
          <el-form-item label="分类 :">
            <el-select v-model="infoTypes_value" placeholder="请选择" style="width:120px">
              <el-option
                v-for="item in options.infoTypes"
                :key="item.id"
                :label="item.category_name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" style="text-align:center">
          <el-form-item label="日期 :">
            <!-- value-format属性令得到的值按照自定义的规则显示 -->
            <el-date-picker
              v-model="date_value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy年-MM月-dd日"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="关键字 :">
            <el-select v-model="keyWord_value" placeholder="请选择" style="width:120px">
              <el-option
                v-for="item in options.keyWord"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-input v-model="select_input" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="danger" style="width:100px" @click="search">搜索</el-button>
        </el-col>
        <el-col :span="5" style="text-align:right">
          <el-button type="danger" style="width:100px" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 内容表格 -->
    <el-table
      :data="options.tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="45">
      </el-table-column>
      <el-table-column
        prop="title"
        align="center"
        label="标题"
        width="830">
      </el-table-column>
      <el-table-column
        prop="categoryId"
        align="center"
        label="类型"
        width="130"
        :formatter="Category_format">
      </el-table-column>
      <el-table-column
        prop="createDate"
        align="center"
        label="日期"
        width="237"
        :formatter="Date_format">
      </el-table-column>
      <el-table-column
        prop="admin"
        align="center"
        label="管理员"
        width="115">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template #default="scope">
          <el-button type="success" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" @click="handleDel(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-row class="pagination_section">
      <el-col :span="6">
        <el-button @click="batchDel(options.del_data)">批量删除</el-button>
      </el-col>
      <el-col :span="18">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="options.pageNumber"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="options.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="options.total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增菜单按钮 弹出框 -->
    <DialogInfo :flag.sync="dialog_Info" :category="options.infoTypes" @updateView="A_getList" :type="dialog_type" :row="options.row_info"></DialogInfo>
  </div>
</template>

<script>
import { reactive, ref, onMounted, isRef, toRefs, watch } from '@vue/composition-api'
import { formatDate } from 'common/validate'
import { getList, deleteInfoList } from 'network/info'
import { common } from 'network/common'
import DialogInfo from 'components/context/dialog/info'
export default {
  name: 'info_list',
  components: { DialogInfo },
  setup(props, context) {
    const { category, getInfoCategory } = common()
    const options = reactive({
      infoTypes: [],
      keyWord: [
        {
          value: 'id',
          label: 'ID'
        },
        {
          value: 'title',
          label: '标题'
        }
      ],
      tableData: [],
      total: 0,
      del_data: [],
      row_info: {}
    })
    // 搜索数据
    const search_data = {
      categoryId: 0,
      startTiem: '',
      endTime: '',
      title: '',
      id: 0,
      pageNumber: 1,
      pageSize: 10
    }
    const infoTypes_value = ref('')
    const keyWord_value = ref('')
    const date_value = ref('')
    const select_input = ref('')
    const dialog_type = ref('')
    const dialog_Info = ref(false)
    // 请求信息列表
    const A_getList = async () => {
      try {
        const res = await getList(search_data)
        options.tableData = res.data.data
        options.total = res.data.total
      } catch (error) {
        console.log(error)
      }
    }
    // 搜索按钮 事件
    const search = () => {
      search_data.categoryId = infoTypes_value.value
      if (date_value.value) {
        search_data.startTiem = date_value.value[0]
        search_data.endTime = date_value.value[1]
      }
      if (keyWord_value.value === 'id') {
        search_data.id = select_input.value
        search_data.title = ''
      }
      if (keyWord_value.value === 'title') {
        search_data.id = 0
        search_data.title = select_input.value
      }
      A_getList()
    }
    // 新增按钮 事件
    const handleAdd = () => {
      dialog_type.value = 'add'
      dialog_Info.value = true
    }
    // 时间格式化
    const Date_format = (row) => {
      return formatDate(new Date(row.createDate * 1000), 'yyyy-MM-dd hh:mm:ss')
    }
    // 分类格式化
    const Category_format = (row) => {
      // console.log(row)
      const currId = row.categoryId
      const currItem = options.infoTypes.findIndex(item => item.id === currId)
      const currName = options.infoTypes[currItem].category_name
      // const item = options.infoTypes.filter(item => item.id === row.categoryId)[0]
      return currName
    }
    // 一页显示几项 事件
    const handleSizeChange = (val) => {
      search_data.pageSize = val
      A_getList()
    }
    // 换页 事件
    const handleCurrentChange = (val) => {
      search_data.pageNumber = val
      A_getList()
    }
    // 编辑 事件
    const handleEdit = (val) => {
      options.row_info = val.row
      console.log(val.row, options.row_info)
      dialog_type.value = 'edit'
      dialog_Info.value = true
    }
    // 删除按钮 事件
    const handleDel = (val) => {
      context.root.confirm({
        content: '确认删除当前信息，确认将无法恢复！！',
        tip: '警告',
        type: 'warning',
        ThenFn: handleDelInfoList,
        val: {
          id: [val.row.id]
        }
      })
    }
    // 删除 事件
    const handleDelInfoList = (val) => {
      deleteInfoList(val).then(res => {
        A_getList()
      }).catch(error => {
        context.root.$message.error('删除失败!')
        console.log(error)
      })
    }
    // 表格选框点击事件
    const handleSelectionChange = (val) => {
      options.del_data = val.map(item => item.id)
    }
    // 批量删除按钮 事件
    const batchDel = (val) => {
      context.root.confirm({
        content: '确认删除当前信息，确认将无法恢复！！',
        tip: '警告',
        type: 'warning',
        ThenFn: handleDelInfoList,
        val: {
          id: val
        }
      })
    }
    // 监听 获取分类 数据
    watch(() => category.item, (newValue, oldValue) => {
      options.infoTypes = newValue
    })
    // 组件挂载
    onMounted(() => {
      A_getList()
      getInfoCategory()
    })
    return {
      // reactive
      options,
      // ref
      dialog_type,
      dialog_Info,
      infoTypes_value,
      keyWord_value,
      date_value,
      select_input,
      // methods
      A_getList,
      search,
      handleAdd,
      Date_format,
      Category_format,
      handleSizeChange,
      handleCurrentChange,
      handleEdit,
      handleDel,
      handleSelectionChange,
      batchDel
    }
  }
}
</script>

<style lang="stylus" scoped>
.pagination_section
  .el-button
    margin-top 25px
.el-pagination
  margin-top 25px
  text-align right
</style>
