<template>
  <div>
    <Modal v-model="editmodal" title="Update TestSet" @on-ok="updateTestSet" @on-cancel="cancelUpdate" ok-text="Submit" cancel-text="Cancel">
      <Form :model="formItem" :label-width="160">
        <FormItem label="TestSetName: ">
          <Input v-model="formItem.TestSetName"></Input>
        </FormItem>
        <FormItem label="analyzerType: ">
          <Input v-model="formItem.AnalyzerType"></Input>
        </FormItem>
        <FormItem label="restApiServerIp: ">
          <Input v-model="formItem.RestApiServerIp"></Input>
        </FormItem>
        <FormItem label="restPort: ">
          <Input v-model="formItem.RestPort"></Input>
        </FormItem>
        <FormItem label="checkPortName: ">
          <Input v-model="formItem.CheckPortName"></Input>
        </FormItem>
        <FormItem label="otTestSetId: ">
          <Input v-model="formItem.OtTestSetId"></Input>
        </FormItem>
        <FormItem label="otTestSetPort: ">
          <Input v-model="formItem.OtTestSetPort"></Input>
        </FormItem>
        <FormItem label="otSignalType: ">
          <Input v-model="formItem.OtSignalType"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="addmodal" title="Add new TestSet" @on-ok="addTestSet" @on-cancel="cancelAdd" ok-text="Submit" cancel-text="Cancel">
      <Form :model="formItem" :label-width="160">
        <FormItem label="TestSetName: ">
          <Input v-model="formItem.TestSetName"></Input>
        </FormItem>
        <FormItem label="analyzerType: ">
          <Input v-model="formItem.AnalyzerType"></Input>
        </FormItem>
        <FormItem label="restApiServerIp: ">
          <Input v-model="formItem.RestApiServerIp"></Input>
        </FormItem>
        <FormItem label="restPort: ">
          <Input v-model="formItem.RestPort"></Input>
        </FormItem>
        <FormItem label="checkPortName: ">
          <Input v-model="formItem.CheckPortName"></Input>
        </FormItem>
        <FormItem label="otTestSetId: ">
          <Input v-model="formItem.OtTestSetId"></Input>
        </FormItem>
        <FormItem label="otTestSetPort: ">
          <Input v-model="formItem.OtTestSetPort"></Input>
        </FormItem>
        <FormItem label="otSignalType: ">
          <Input v-model="formItem.OtSignalType"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="delmodal" title="Delete" @on-ok="DelTestSet" @on-cancel="cancelDel" ok-text="Confirm" cancel-text="Cancel">
      Are you sure to delete this TestSet ?
    </Modal>

    <div>
      <div style="float:left;"> <h2>TestSet</h2> </div>
      <div style="float:right;"> <Button @click="showAddModal" type="info">+ Add</Button> </div>
    </div>

    <div class="clearfix">
      <br>
      <iviewTablePage
        border
        :columns="columns"
        :data="tableData"
        :total='total'
        :loading='loading'
        :current='current'
        :page-size='pageSize'
        show-sizer
        @on-change='handleChangeSize'
        @on-page-size-change='handlePageChangeSize'>
      </iviewTablePage>
    </div>

  </div>
</template>

<script>
  import iviewTablePage from 'iview-table-page'
  import { getTestSetCfg, addTestSetCfg, updateTestSetCfg, deleteTestSetCfg } from "../api/neservice";

  export default {
    components: { iviewTablePage },
    data () {
      return {
        editmodal: false,
        addmodal: false,
        delmodal: false,
        delId: 0,
        formItem: {
          Id: 0,
          TestSetName: '',
          AnalyzerType: '',
          RestApiServerIp: '',
          RestPort: '',
          CheckPortName: '',
          OtTestSetId: '',
          OtTestSetPort: '',
          OtSignalType: ''
        },
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center',
            indexMethod: row => {
              // 序号逻辑
              return (
                row._index + 1 + this.pageSize * this.current - this.pageSize
              )
            }
          },
          {
            title: 'TestSetName',
            key: 'TestSetName',
            render: (h, params) => {
              return h('span', params.row.TestSetName)
            }
          },
          {
            title: 'analyzerType',
            key: 'AnalyzerType',
            render: (h, params) => {
              return h('span', params.row.AnalyzerType)
            }
          },
          {
            title: 'restApiServerIp',
            key: 'RestApiServerIp',
            render: (h, params) => {
              return h('span', params.row.RestApiServerIp)
            }
          },
          {
            title: 'restPort',
            key: 'RestPort',
            render: (h, params) => {
              return h('span', params.row.RestPort)
            }
          },
          {
            title: 'checkPortName',
            key: 'CheckPortName',
            render: (h, params) => {
              return h('span', params.row.CheckPortName)
            }
          },
          {
            title: 'otTestSetId',
            key: 'OtTestSetId',
            render: (h, params) => {
              return h('span', params.row.OtTestSetId)
            }
          },
          {
            title: 'otTestSetPort',
            key: 'OtTestSetPort',
            render: (h, params) => {
              return h('span', params.row.OtTestSetPort)
            }
          },
          {
            title: 'otSignalType',
            key: 'OtSignalType',
            render: (h, params) => {
              return h('span', params.row.OtSignalType)
            }
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit(params.row)
                      }
                    }
                  },
                  'Edit'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.remove(params.row.Id)
                      }
                    }
                  },
                  'Delete'
                )
              ])
            }
          }
        ],
        tableData: [],
        loading: false,
        total: 0,
        current: 1,
        pageSize: 20
      }
    },
    methods: {
      showAddModal(){
        this.addmodal = true
      },
      getData () {
        if (this.loading) return
        this.loading = true
        getTestSetCfg(this.current, this.pageSize).then(response => {
          if (response.isSuccess == true) {
            this.tableData = response.testSetCfgList
            this.total = response.total
            this.loading = false
          }
        })
      },
      handleChangeSize (val) {
        this.current = val
        this.$nextTick(() => {
          this.getData()
        })
      },
      handlePageChangeSize (val) {
        this.pageSize = val
        this.$nextTick(() => {
          this.getData()
        })
      },
      edit(val){
        this.formItem.Id = val.Id
        this.formItem.TestSetName = val.TestSetName
        this.formItem.AnalyzerType = val.AnalyzerType
        this.formItem.RestApiServerIp = val.RestApiServerIp
        this.formItem.RestPort = val.RestPort
        this.formItem.CheckPortName = val.CheckPortName
        this.formItem.OtTestSetId = val.OtTestSetId
        this.formItem.OtTestSetPort = val.OtTestSetPort
        this.formItem.OtSignalType = val.OtSignalType
        // work around to update testsetlist in necfg
        this.formItem.OriginalTestSetName = val.TestSetName
        this.editmodal = true
      },
      remove(val){
        this.delmodal = true
        this.delId = val
      },
      updateTestSet() {
        updateTestSetCfg(this.formItem).then(response => {
            if (response.isSuccess == true) {
              this.getData()
            } else {
              alert(response.errMsg)
            }
            this.clearFormItem()
        }).catch(error => {
          this.clearFormItem()
        })
      },

      addTestSet() {
        addTestSetCfg(this.formItem).then(response => {
              if (response.isSuccess == true) {
                if (response.indexWarning){
                  this.$Modal.warning({
                    title: "Warining:",
                    content: "TestSet: " + this.formItem.TestSetName + " already exists!"
                  })
                }
                  this.getData()
              }else{
                alert(response.errMsg)
              }
              this.clearFormItem()
        }).catch(error => {
          console.log(2)
          this.clearFormItem()
        })
      },

      DelTestSet() {
          // fix bug if only on record in current page and doing delete this record
          if (this.tableData.length == 1) {
            this.current = this.current - 1
          }
          deleteTestSetCfg(this.delId).then(response => {
            if (response.isSuccess == true) {
              this.getData()
            } else{
              alert(response.errMsg)
            }
            this.delId = 0
            }).catch(error => {
              this.delId = 0
            })
      },

      // DelCli() {
      //   // fix bug if only on record in current page and doing delete this record
      //   if (this.tableData.length == 1) {
      //     this.current = this.current - 1
      //   }
      //   deleteNeChecklistCli(this.delId).then(response => {
      //     if (response.isSuccess == true) {
      //       this.getData()
      //     } else{
      //       alert(response.errMsg)
      //     }
      //     this.delId = 0
      //   }).catch(error => {
      //     this.delId = 0
      //   })
      // },

      cancelDel(){
        this.clearFormItem()
      },
      cancelAdd() {
        this.clearFormItem()
      },
      cancelUpdate() {
        this.clearFormItem()
      },
      clearFormItem() {
        this.formItem.Id = 0
        this.formItem.AnalyzerType = ''
        this.formItem.CheckPortName = ''
        this.formItem.OtSignalType = ''
        this.formItem.OtTestSetId = ''
        this.formItem.OtTestSetPort = ''
        this.formItem.RestApiServerIp = ''
        this.formItem.TestSetName = ''
        this.formItem.RestPort = ''
      },
    },
    mounted () {
      this.getData()
    }
  }




</script>
