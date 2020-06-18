import request from "../utils/request"
import { BASE_URL } from "./apiconf"

export function login(data) {
  return request({
    url: BASE_URL + 'login',
    method: 'post',
    data
  })
}
