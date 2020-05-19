import { MessageBox } from 'element-ui'
export default {
  install (Vue, options) {
    Vue.prototype.confirm = (parmas) => {
      MessageBox.confirm(parmas.content, parmas.tip || '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: parmas.type || 'warning'
      }).then(() => {
        parmas.ThenFn && parmas.ThenFn(parmas.val)
        Vue.prototype.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        Vue.prototype.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
