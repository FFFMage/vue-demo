import axios from 'axios'

export function request(config) {
  const BASEURL = process.env.Node_ENV === 'production' ? '' : '/api'
  const instance = axios.create({
    baseURL: BASEURL,
    timeout: 5000
  })

  instance.interceptors.request.use(config => {
    config.headers.Tokey = window.sessionStorage.getItem('token')
    config.headers.UserName = window.sessionStorage.getItem('username')
    return config
  }, err => {
    console.log(err)
  })

  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err)
  })

  return instance(config)
}
