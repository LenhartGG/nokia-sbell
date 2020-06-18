import request from "../utils/request"
import { BASE_URL } from "./apiconf"
import {getCookie} from "../common/tools";

export function operationConfirm(neGrpMap, operationData){
  return request({
    url: BASE_URL + 'operation/confirm',
    method: 'post',
    data: {
      "neGroupMap": neGrpMap,
      "operationData": operationData
    }
  })
}

export function getOperationRecords(){
  return request({
    url: BASE_URL + 'operation/records',
    method: 'get',
    params: {}
  })
}

export function getLogByOperatonId(operationId) {
  return request({
    url: BASE_URL + "operation/getlog",
    method: 'get',
    params: {operationId}
  })
}

export function getNeChecklistCli(currentPage, pageSize) {
  return request({
    url: BASE_URL + 'operation/get/nechecklistcli',
    method: 'get',
    params: {currentPage, pageSize}
  })
}

export function updateNeChecklistCli(neCheckListCli) {
  return request({
    url: BASE_URL + 'operation/update/nechecklistcli',
    method: 'post',
    data: neCheckListCli
  })
}

export function deleteNeChecklistCli(id) {
  return request({
    url: BASE_URL + 'operation/delete/nechecklistcli',
    method: 'post',
    data: {
      "id": id
    }
  })
}

export function addNeChecklistCli(neCheckListCli) {
  return request({
    url: BASE_URL + 'operation/put/nechecklistcli',
    method: 'post',
    data: neCheckListCli
  })
}

export function getTestSetCfg(currentPage, pageSize) {
  return request({
    url: BASE_URL + 'operation/get/testsetcfg',
    method: 'get',
    params: {currentPage, pageSize}
  })
}

export function addTestSetCfg(testSetCfg){
  return request({
    url: BASE_URL + 'operation/put/testsetcfg',
    method: 'post',
    data: testSetCfg
  })
}

export function updateTestSetCfg(testSetCfg) {
  return request({
    url: BASE_URL + 'operation/update/testsetcfg',
    method: 'post',
    data: testSetCfg
  })
}

export function deleteTestSetCfg(id) {
  return request({
    url: BASE_URL + 'operation/delete/testsetcfg',
    method: 'post',
    data: {
      "id": id
    }
  })
}

/* NECfg Start */
export function getTestSetCfgList() {
  return request({
    url: BASE_URL + 'operation/get/testsetcfglist',
    method: 'get'
  })
}
export function getNeCfg(currentPage, pageSize) {
  return request({
    url: BASE_URL + 'operation/get/necfg',
    method: 'get',
    params: {currentPage, pageSize}
  })
}

export function updateNeCfg(neCfg) {
  return request({
    url: BASE_URL + 'operation/update/necfg',
    method: 'post',
    data: neCfg
  })
}

export function deleteNeCfg(id) {
  return request({
    url: BASE_URL + 'operation/delete/necfg',
    method: 'post',
    data: {
      "id": id
    }
  })
}

export function addNeCfg(neconfig) {
  return request({
    url: BASE_URL + 'operation/put/necfg',
    method: 'post',
    data: neconfig
  })
}
/* NECfg End*/


export function getUserAllNeCfgs(){
  return request({
    url: BASE_URL + 'operation/get/userallnecfgs',
    method: 'get'
  })
}

export function addNeGroup(NeGroupData){
  return request({
    url: BASE_URL + 'operation/put/negroup',
    method: 'post',
    data: NeGroupData
  })
}

export function renameNeGroup(neGroupId, neGroupName){
  return request({
    url: BASE_URL + 'operation/update/negroupname',
    method: 'post',
    data: {
      id: neGroupId,
      name: neGroupName
    }
  })
}

export function deleteNeGroup(neGroupId) {
  return request({
    url: BASE_URL + 'operation/delete/negroup',
    method: 'post',
    data: {
      id: neGroupId,
    }
  })
}

export function addNeIntoGroup(groupId, neId) {
  return request({
    url: BASE_URL + 'operation/put/neintogroup',
    method: 'post',
    data: {
      groupId: groupId,
      neId: neId
    }
  })
}

export function deleteNeFromGroup(groupId, neId) {
  return request({
    url: BASE_URL + 'operation/delete/nefromgroup',
    method: 'post',
    data: {
      groupId: groupId,
      neId: neId
    }
  })
}

