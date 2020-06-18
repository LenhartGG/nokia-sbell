<template>
  <div>
    <Modal v-model="editmodal" title="Update NE config" @on-ok="updateNeConfig" @on-cancel="cancelUpdate" ok-text="Submit" cancel-text="Cancel">
      <Form :model="formItem" :label-width="160">
        <FormItem label="NeName: "><Input v-model="formItem.NEName" /></FormItem>
        <FormItem label="NeType: ">
          <!-- <Input v-model="formItem.NeType" /> -->
          <Select v-model="NeTypeSelected" clearable>
            <Option v-for="item in neTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="IP: "><Input v-model="formItem.IP" /></FormItem>
        <FormItem label="TestSetList: ">
          <!-- <Input v-model="formItem.TestSetStrList" /> -->
          <Select v-model="TestSetStrList" multiple clearable>
            <Option v-for="item in testSetList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="DBServer: "><Input v-model="formItem.DBServer" /></FormItem>
        <FormItem label="DBUser: "><Input v-model="formItem.DBUser" /></FormItem>
        <FormItem label="DBPassword: "><Input v-model="formItem.DBPassword" /></FormItem>
        <FormItem label="DBPath: "><Input v-model="formItem.DBPath" /></FormItem>
        <FormItem label="SWServer: "><Input v-model="formItem.SWServer" /></FormItem>
        <FormItem label="SWUser: "><Input v-model="formItem.SWUser" /></FormItem>
        <FormItem label="SWPassword: "><Input v-model="formItem.SWPassword" /></FormItem>
        <FormItem label="SWPath: "><Input v-model="formItem.SWPath" /></FormItem>
        <FormItem label="DBFile: "><Input v-model="formItem.DBFile" /></FormItem>
      </Form>
    </Modal>

    <Modal v-model="addmodal" title="Add new NE config" @on-ok="addNeConfig" @on-cancel="cancelAdd" ok-text="Submit" cancel-text="Cancel">
      <Form :model="formItem" :label-width="160">
        <FormItem label="NeName: "><Input v-model="formItem.NEName" /></FormItem>
                <FormItem label="NeType: ">
          <!-- <Input v-model="formItem.NeType" /> -->
          <Select v-model="NeTypeSelected" clearable>
            <Option v-for="item in neTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="IP: "><Input v-model="formItem.IP" /></FormItem>
        <FormItem label="TestSetList: ">
          <!-- <Input v-model="formItem.TestSetStrList" /> -->
          <Select v-model="TestSetStrList" multiple clearable>
            <Option v-for="item in testSetList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="DBServer: "><Input v-model="formItem.DBServer" value="135.252.217.71"/></FormItem>
        <FormItem label="DBUser: "><Input v-model="formItem.DBUser" value="root" /></FormItem>
        <FormItem label="DBPassword: "><Input v-model="formItem.DBPassword" /></FormItem>
        <FormItem label="DBPath: "><Input v-model="formItem.DBPath" value="hermes123" /></FormItem>
        <FormItem label="SWServer: "><Input v-model="formItem.SWServer" value="135.252.219.139" /></FormItem>
        <FormItem label="SWUser: "><Input v-model="formItem.SWUser" value="nei" /></FormItem>
        <FormItem label="SWPassword: "><Input v-model="formItem.SWPassword" value="12345" /></FormItem>
        <FormItem label="SWPath: "><Input v-model="formItem.SWPath" value="/home/ci/loads/delivery/V01.00.00/latest" /></FormItem>
        <FormItem label="DBFile: "><Input v-model="formItem.DBFile" value="none"/></FormItem>
      </Form>
    </Modal>

    <Modal v-model="delmodal" title="Delete" @on-ok="DelCfg" @on-cancel="cancelDel" ok-text="Confirm" cancel-text="Cancel">
      Are you sure to delete this NE config ?
    </Modal>

    <div>
      <div style="float:left;"> <h2>NE Config List</h2> </div>
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
  import { getTestSetCfgList, getNeCfg, updateNeCfg, deleteNeCfg, addNeCfg } from '../api/neservice'

  export default {
    components: { iviewTablePage },
    data () {
      return {
        editmodal: false,
        addmodal: false,
        delmodal: false,
        delId: 0,
        //please clear these two variable after each related event
        TestSetStrList:[],
        NeTypeSelected:"",
        formItem: {
          Id: 0,
          NEName:'',
          NEType:'',
          IP:'',
          TestSetList:'',
          DBServer:'135.252.217.71',
          DBUser:'root',
          DBPassword:'hermes123',
          DBPath:'/home/svtftp/database/',
          SWServer:'135.252.219.139',
          SWUser:'nei',
          SWPassword:'12345',
          SWPath:'/home/ci/loads/delivery/V01.00.01/latest',
          DBFile: 'none'
        },
        neTypeList:[
          {
              value: 'TPS12',
              label: 'TPS12'
          },
          {
              value: 'TPS24',
              label: 'TPS24'
          }
        ],
        testSetList:[
          {
              value: 'Ixia_wjf_1',
              label: 'Ixia_wjf_1'
          },
          {
              value: '2100_wjf_1',
              label: '2100_wjf_1'
          },
          {
              value: '5800_wjf_1',
              label: '5800_wjf_1'
          }
        ],
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
            title: 'NeName',
            width: 100,
            key: 'NEName',
            render: (h, params) => {
              return h('span', params.row.NEName)
            }
          },
          {
            title: 'NeType',
            width: 100,
            key: 'NEType',
            render: (h, params) => {
              return h('span', params.row.NEType)
            }
          },
          {
            title: 'IP',
            key: 'IP',
            width: 100,
            render: (h, params) => {
              return h('span', params.row.IP)
            }
          },
          {
            title: 'TestSetList',
            key: 'TestSetList',
            width: 200,
            render: (h, params) => {
              let testSetList = params.row.TestSetList.split(',')
              if ( testSetList[0] != "") {
                let tmpRender = []
                testSetList.forEach(element => {
                  tmpRender.push(h('Tag', {attrs: {color: "orange"}}, element))
                })
                // return h('span', params.row.TestSetList)
                return h('span', tmpRender)
              } else {
                return h('span')
              }
            }
          },
          {
            title: 'DBServer',
            key: 'DBServer',
            width: 120,
            render: (h, params) => {
              return h('span', params.row.DBServer)
            }
          },
          {
            title: 'DBUser',
            key: 'DBUser',
            width: 120,
            render: (h, params) => {
              return h('span', params.row.DBUser)
            }
          },
          {
            title: 'DBPassword',
            key: 'DBPassword',
            width: 120,
            render: (h, params) => {
              return h('span', params.row.DBPassword)
            }
          },
          {
            title: 'DBPath',
            key: 'DBPath',
            width: 100,
            render: (h, params) => {
              return h('span', params.row.DBPath)
            }
          },
          {
            title: 'SWServer',
            key: 'SWServer',
            width: 100,
            render: (h, params) => {
              return h('span', params.row.SWServer)
            }
          },
          {
            title: 'SWUser',
            key: 'SWUser',
            width: 100,
            render: (h, params) => {
              return h('span', params.row.SWUser)
            }
          },
          {
            title: 'SWPassword',
            key: 'SWPassword',
            width: 100,
            render: (h, params) => {
              return h('span', params.row.SWPassword)
            }
          },
          {
            title: 'SWPath',
            key: 'SWPath',
            width: 100,
            render: (h, params) => {
              return h('span', params.row.SWPath)
            }
          },
          {
            title: 'DBFile',
            key: 'DBFile',
            width: 100,
            render: (h, params) => {
              return h('span', params.row.DBFile)
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
        //TODO:待后台接口完成再解开注释
        getNeCfg(this.current, this.pageSize).then(response => {
          if (response.isSuccess == true) {
            this.tableData = response.neCfgList
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
        this.formItem.NEName = val.NEName
        this.formItem.NEType = val.NEType
        this.NeTypeSelected = val.NEType
        this.formItem.IP = val.IP
        this.TestSetStrList = val.TestSetList.split(",")
        this.formItem.DBServer = val.DBServer
        this.formItem.DBUser = val.DBUser
        this.formItem.DBPassword = val.DBPassword
        this.formItem.DBPath = val.DBPath
        this.formItem.SWServer = val.SWServer
        this.formItem.SWUser = val.SWUser
        this.formItem.SWPassword = val.SWPassword
        this.formItem.SWPath = val.SWPath
        this.formItem.Id = val.Id
        this.formItem.DBFile = val.DBFile
        this.editmodal = true
      },
      remove(val){
        this.delmodal = true
        this.delId = val
      },
      updateNeConfig() {
        let list = this.TestSetStrList
        // set TestSetList (type: str)
        this.formItem.TestSetList = this.parseList2Str(list)
        this.formItem.NEType = this.NeTypeSelected
        updateNeCfg(this.formItem).then(response => {
          if (response.isSuccess == true) {
            this.getData()
          } else {
            console.log(response.errMsg)
          }
          this.clearFormItem()
        }).catch(error => {
             this.clearFormItem()
          }
        )
      },
      addNeConfig() {
        this.formItem.NEType = this.NeTypeSelected
        let list = this.TestSetStrList
        var tmp = this.parseList2Str(list)
        this.formItem.TestSetList = tmp
        addNeCfg(this.formItem).then(response => {
          if (response.isSuccess == true) {
            if (response.indexWarning){
              this.$Modal.warning({
                title: "Warining:",
                content: "NE: " + this.formItem.NEName + " already exists!"
              })
            }
            this.getData()
          }else{
            console.log(response.errMsg)
          }
          this.clearFormItem()
        }).catch(error => {
          this.clearFormItem()
        })
      },
      DelCfg() {
        //fix bug if only on record in current page and doing delete this record
        if (this.tableData.length == 1) {
          this.current = this.current - 1
        }
        deleteNeCfg(this.delId).then(response => {
          if (response.isSuccess == true) {
            this.getData()
          } else{
            console.log(response.errMsg)
          }
          this.delId = 0
        }).catch(error => {
          this.delId = 0
        })
      },
      cancelDel(){
        this.clearFormItem()
      },
      //通过接口获取最新的TestSet选项集
      setCfgList() {
        getTestSetCfgList().then(response => {
            if (response.isSuccess == true) {
              if(null == response.testSetCfgList){
                this.testSetList = []
              }else{
                this.testSetList = []
                response.testSetCfgList.forEach(testSet => {
                  this.testSetList.push(
                    {
                      value: testSet,
                      label: testSet
                    }
                  )
                });
              }
            }
          })
      },
      cancelAdd() {
        this.clearFormItem()
      },
      cancelUpdate() {
        this.clearFormItem()
      },
      clearFormItem() {
        this.formItem.Id = 0
        this.formItem.NEName = ''
        this.formItem.NEType = ''
        this.NeTypeSelected = ''
        this.formItem.IP = ''
        this.TestSetStrList = []
        this.formItem.TestSetList = ''
        this.formItem.DBServer = '135.252.217.71'
        this.formItem.DBUser = 'root'
        this.formItem.DBPassword = 'hermes123'
        this.formItem.DBPath = '/home/svtftp/database/'
        this.formItem.SWServer = '135.252.219.139'
        this.formItem.SWUser = 'nei'
        this.formItem.SWPassword = '12345'
        this.formItem.SWPath = '/home/ci/loads/delivery/V01.00.01/latest'
        this.formItem.DBFile = 'none'
      },
      parseList2Str(list){
        let tmp = ''
        try {
          list.forEach(element => {
            if(list.indexOf(element) == list.length-1){
              tmp = tmp.concat(element)
            }else{
              tmp = tmp.concat(element + ',')
            }
          });
        } catch (error) {
          console.log(error)
        }
        return tmp
      }
    },
    mounted () {
      this.getData()
      this.setCfgList()
    }

  }
</script>
