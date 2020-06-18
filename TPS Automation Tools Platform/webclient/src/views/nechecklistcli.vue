<template>
  <div>
    <Modal v-model="editmodal" title="Update neCheckList_cli" @on-ok="updateCli" @on-cancel="cancelUpdate" ok-text="Submit" cancel-text="Cancel">
      <Form :model="formItem" :label-width="160">
        <FormItem label="neSummary_tps24: ">
          <Input v-model="formItem.NESummaryTps24"></Input>
        </FormItem>
        <FormItem label="neSummary_tps12: ">
          <Input v-model="formItem.NESummaryTps12"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="addmodal" title="Add new neCheckList_cli" @on-ok="addCli" @on-cancel="cancelAdd" ok-text="Submit" cancel-text="Cancel">
      <Form :model="formItem" :label-width="160">
        <FormItem label="neSummary_tps24: ">
          <Input v-model="formItem.NESummaryTps24"></Input>
        </FormItem>
        <FormItem label="neSummary_tps12: ">
          <Input v-model="formItem.NESummaryTps12"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="delmodal" title="Delete" @on-ok="DelCli" @on-cancel="cancelDel" ok-text="Confirm" cancel-text="Cancel">
      Are you sure to delete this neCheckList_cli ?
    </Modal>

    <div>
      <div style="float:left;"> <h2>NE Check List Cli</h2> </div>
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
  import { getNeChecklistCli, updateNeChecklistCli, deleteNeChecklistCli, addNeChecklistCli } from '../api/neservice'

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
          NESummaryTps12: '',
          NESummaryTps24: ''
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
            title: 'neSummary_tps24',
            key: 'NESummaryTps24',
            render: (h, params) => {
              return h('strong', params.row.NESummaryTps24)
            }
          },
          {
            title: 'neSummary_tps12',
            key: 'NESummaryTps12',
            render: (h, params) => {
              return h('strong', params.row.NESummaryTps12)
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
        getNeChecklistCli(this.current, this.pageSize).then(response => {
          if (response.isSuccess == true) {
            this.tableData = response.cliList
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
        this.formItem.NESummaryTps12 = val.NESummaryTps12
        this.formItem.NESummaryTps24 = val.NESummaryTps24
        this.formItem.Id = val.Id
        this.editmodal = true
      },
      remove(val){
        this.delmodal = true
        this.delId = val
      },
      updateCli() {
        updateNeChecklistCli(this.formItem).then(response => {
          if (response.isSuccess == true) {
            this.getData()
          } else {
            alert(response.errMsg)
          }
          this.clearFormItem()
        }).catch(error => {
             this.clearFormItem()
          }
        )
      },
      addCli() {
        addNeChecklistCli(this.formItem).then(response => {
          if (response.isSuccess == true) {
            this.getData()
          }else{
            alert(response.errMsg)
          }
          this.clearFormItem()
        }).catch(error => {
          this.clearFormItem()
        })
      },
      DelCli() {
        // fix bug if only on record in current page and doing delete this record
        if (this.tableData.length == 1) {
          this.current = this.current - 1
        }
        deleteNeChecklistCli(this.delId).then(response => {
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
        this.formItem.NESummaryTps12 = ''
        this.formItem.NESummaryTps24 = ''
      },
    },
    mounted () {
      this.getData()
    }
  }
</script>
