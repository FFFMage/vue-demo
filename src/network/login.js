import { request } from './request'

export function GetCode(params) {
  return request({
    method: 'post',
    url: '/getSms/',
    data: params
  })
}

export function Register(params) {
  return request({
    method: 'post',
    url: '/register/',
    data: params
  })
}

export function Login(params) {
  return request({
    method: 'post',
    url: '/login/',
    data: params
  })
}
