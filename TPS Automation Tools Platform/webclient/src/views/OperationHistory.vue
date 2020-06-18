<template>
  <div>
  <Modal style="width:60%" width="60%" v-model="logmodal" title="Operation Log" ok-text="OK" cancel-text="Cancel">
    {{ logContent }}
  </Modal>
  <Table border
         ref="tableData"
         :columns="opHistoryColumns"
         :data="opHistoryList"
  >
  </Table>
  </div>
</template>
<script>
  import { getOperationRecords, getLogByOperatonId } from '../api/neservice'
  export default {
    props: {},
    data() {
      return {
        opHistoryList: [

        ],
        logContent: "",
        logmodal: false,
        opHistoryColumns: [
          {
            title: "Start Time",
            align: 'center',
            key: "StartTimestamp",
            render: (h, params) => {
              if (params.row.StartTimestamp.indexOf(".") != -1) {
                let i = params.row.StartTimestamp.indexOf(".")
                return h('span', params.row.StartTimestamp.substring(0, i))
              } else {
                return h('span', params.row.StartTimestamp)
              }
            }
          },
          {
            title: "End Time",
            align: 'center',
            key: "EndTimestamp",
            render: (h, params) => {
              if (params.row.EndTimestamp.indexOf(".") != -1) {
                let i = params.row.EndTimestamp.indexOf(".")
                return h('span', params.row.EndTimestamp.substring(0, i))
              }else {
                return h('span', params.row.EndTimestamp)
              }
            }
          },
          {
            title: "Ne Config File",
            align: 'center',
            key: "neConfigFile",
            render: (h, params) => {
              return h("a", {
                  attrs: {
                    href: params.row.OperationFileDownloadPath,
                  }
                },
                [
                  h("Icon", {
                      attrs: {
                        type: "md-archive",
                      }
                    }
                  )
                ]
              )
            }
          },
          {
            title: "Status",
            align: 'center',
            key: "Status",
            render: (h, params) => {
              if (params.row.Status == 1) {
                return h('Alert', {
                  attrs: {
                    type: "success",
                    "show-icon": true
                  }
                },"Succeeded")
              } else if (params.row.Status == 2) {
                return h('Alert', {
                  attrs: {
                    type: "error",
                    "show-icon": true
                  }
                }, "Failed")
              } else if (params.row.Status == 0) {
                return h('Alert', {
                  attrs: {
                    type: "warning",
                    "show-icon": true
                  }
                }, "In Progress")
              }


            }
          },
          {
            title: "Log",
            align: 'center',
            key: "Log",
            render: (h, params) => {
              return h('span', {
                  attrs: {
                    type: "md-search",
                    "data-id": params.row.Id,
                  },
                  on: {
                    click: () => {
                      this.showLog(params.row.Id)

                    }
                  }
                },
                [h('Icon', {
                    attrs: {
                      type: "md-search",
                      "data-id": params.row.Id
                    }
                  }
                )
                ]
              )
            }
          }
        ],
      };
    },
    mounted() {},
    created() {
      getOperationRecords().then(response => {
        console.log(response)
        if (response["isSuccess"] && "opRecords" in response) {
          // this.opHistoryList = response["opRecords"]
          // let op_records = response["opRecords"]
          // var opHistoryList = []
          //
          // for (let i in op_records) {
          //   let tmp = {}
          //
          //   tmp["StartTimestamp"] = op_records[i].StartTimestamp
          //   tmp["EndTimestamp"] = op_records[i].EndTimestamp
          //   tmp["Status"] = op_records[i].Status
          //   opHistoryList.push(tmp)
          // }
          // console.log(opHistoryList)
          this.opHistoryList = response["opRecords"]
        }
      } )



    },
    methods: {
      showLog(operationId) {
        getLogByOperatonId(operationId).then(response => {
          console.log(response)
          this.logContent = response.log
          this.logmodal = true
        }).catch(error => {
            console.log(error)
            alert(error)
          }
        )
      }
    },
    watch: {},
    components: {}
  };

</script>

<style scoped lang="scss">
  .ivu-table {
  overflow: initial;
  }
  .ivu-table-wrapper {
  overflow: initial;;
  }
</style>
