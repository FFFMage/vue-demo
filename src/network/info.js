import { request } from './request'

// 获取信息列表
export function getList(params) {
  return request({
    method: 'post',
    url: '/news/getList/',
    data: params
  })
}

// 添加信息
export function addInfoList(params) {
  return request({
    method: 'post',
    url: '/news/add/',
    data: params
  })
}

// 删除信息
export function deleteInfoList(params) {
  return request({
    method: 'post',
    url: '/news/deleteInfo/',
    data: params
  })
}

// 修改信息
export function editInfoList(params) {
  return request({
    method: 'post',
    url: '/news/editInfo/',
    data: params
  })
}

// 添加一级分类 接口
export function addFirstCategory(params) {
  return request({
    method: 'post',
    url: '/news/addFirstCategory/',
    data: params
  })
}

// 添加子级分类 接口
export function addChildrenCategory(params) {
  return request({
    method: 'post',
    url: '/news/addChildrenCategory/',
    data: params
  })
}

// 获取所有分类 接口
export function getCateGory(params) {
  return request({
    method: 'post',
    url: '/news/getCategoryAll/',
    data: params
  })
}

// 删除分类
export function deleteCateGroy(params) {
  return request({
    method: 'post',
    url: '/news/deleteCategory/',
    data: params
  })
}

// 编辑分类
export function editCateGroy(params) {
  return request({
    method: 'post',
    url: '/news/editCategory/',
    data: params
  })
}
