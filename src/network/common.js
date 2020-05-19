import { getCateGory } from './info'
import { reactive } from '@vue/composition-api'
export function common() {
  const category = reactive({
    item: []
  })
  const getInfoCategory = (params) => {
    getCateGory(params).then(res => {
      category.item = res.data
      // console.log(res)
    }).catch(error => {
      console.log(error)
    })
  }
  return {
    category,
    getInfoCategory
  }
}
