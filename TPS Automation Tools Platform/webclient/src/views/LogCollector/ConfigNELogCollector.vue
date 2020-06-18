<template>
  <div>
    <div class="clearfix">
      <h2 style="float:left;">NE Config List</h2>
      <div style="float:right;"> <Button @click="showAddModal" type="info">+ Add</Button> </div>
    </div>
    
    <!-- <Table
      border
      ref="selection"
      :loading="loading"
      :columns="neListColumns"
      :data="neList"
      max-height="300">
    </Table> -->
    
    <iviewTablePage
      border
      :columns="neListColumns"
      :data="neList"
      :total='total'
      :loading='loading'
      :current='current'
      :page-size='pageSize'
      show-sizer
      @on-change='handleChangeSize'
      @on-page-size-change='handlePageChangeSize'
      >
    </iviewTablePage>

    <Modal v-model="updatemodal" title="Update NE config" @on-ok="updateNeConfig" @on-cancel="cancelUpdate" ok-text="Submit" cancel-text="Cancel">
      <Form :model="formItem" :label-width="160">
        <FormItem label="NeName: "><Input v-model="formItem.NEName" /></FormItem>
        <FormItem label="NETYPE: ">
          <Select v-model="NETYPESelected" clearable>
            <Option v-for="item in NETYPEList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Product: "><Input v-model="formItem.Product"  /></FormItem>
        <FormItem label="IP: "><Input v-model="formItem.IP" /></FormItem>
        <FormItem label="Owner: "><Input v-model="formItem.Owner" /></FormItem>
      </Form>
    </Modal>
    
    <Modal v-model="delmodal" title="Delete" @on-ok="DelCfg" @on-cancel="cancelDel" ok-text="Confirm" cancel-text="Cancel">
      Are you sure to delete this NE config ?
    </Modal>

    
    <Modal v-model="addmodal" title="Add new NE config" @on-ok="addNeConfig" @on-cancel="cancelAdd" ok-text="Submit" cancel-text="Cancel">
      <Form :model="formItem" :label-width="160">
        <FormItem label="NeName: "><Input v-model="formItem.NEName" /></FormItem>
        <FormItem label="NETYPE: ">
          <Select v-model="NETYPESelected" clearable>
            <Option v-for="item in NETYPEList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Product: "><Input v-model="formItem.Product"  /></FormItem>
        <FormItem label="IP: "><Input v-model="formItem.IP" /></FormItem>
        <FormItem label="Owner: "><Input v-model="formItem.Owner" /></FormItem>
      </Form>
    </Modal>
    
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'
import iviewTablePage from 'iview-table-page'

export default {
  props: {},
  components: { iviewTablePage },
  data() {
    return {
      loading: false,
      neListColumns: [
        {
          title: "#",
          key: "Id",
          align: "center"
        },
        {
          title: "NEName",
          key: "NEName",
        },
        {
          title: "NETYPE",
          key: "NETYPE",
        },
        {
          title: "Product",
          key: "Product",
        },
        {
          title: "IP",
          key: "IP",
        },
        {
          title: "Owner",
          key: "Owner",
        },
        {
          title: "Action",
          key: "action",
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
      neList: [
        // {
        //   NEName: "Setup51",
        //   NETYPE: "TPS24",
        //   IP: "135.242.243.51",
        //   DBServer: "135.252.217.71",
        //   DBUser: "root",
        //   DBPassword: "hermes123",
        //   DBPath: "/home/svtftp/database/",
        //   SWServer: "135.252.219.139",
        //   SWUser: "nei",
        //   SWPassword: "12345",
        //   SWPath: "/home/ci/loads/delivery/V01.00/latest"
        // }Alarm	Cpu	Sync	Ptp	HardDisk	Temperature	Bs0dump	SummaryInfo	TraceInfo	FreeCmd	ConsoleLog	PmPort	PmSap	SqlRecord	Topology	ConsoleAnalyzer

        {Id: 1, NEName: "Setup11",	NETYPE: "TPS24",	Product: "TPS",	IP: "135.242.243.11",	Owner: "Altran",	Inventory: true,	Ddm:true,	Alarm:true,	Cpu:true, Sync:true, Ptp:true,	HardDisk: true,	Temperature: true,	Bs0dump: true,	SummaryInfo: true,	TraceInfo: false,	FreeCmd: false,	ConsoleLog: false,	PmPort: false,	PmSap: true,	SqlRecord: true,	Topology: true,	ConsoleAnalyzer: false},
        {Id: 2, NEName: "Setup12",	NETYPE: "TPS24",	Product: "TPS",	IP: "135.242.243.12",	Owner: "Altran",	Inventory: true,	Ddm:true,	Alarm:true,	Cpu:true, Sync:true, Ptp:true,	HardDisk: true,	Temperature: true,	Bs0dump: true,	SummaryInfo: true,	TraceInfo: false,	FreeCmd: false,	ConsoleLog: false,	PmPort: false,	PmSap: true,	SqlRecord: true,	Topology: true,	ConsoleAnalyzer: false},
        {Id: 3, NEName: "Setup13",	NETYPE: "TPS24",	Product: "TPS",	IP: "135.242.243.13",	Owner: "Altran",	Inventory: true,	Ddm:true,	Alarm:true,	Cpu:true, Sync:true, Ptp:true,	HardDisk: true,	Temperature: true,	Bs0dump: true,	SummaryInfo: true,	TraceInfo: false,	FreeCmd: false,	ConsoleLog: false,	PmPort: false,	PmSap: true,	SqlRecord: true,	Topology: true,	ConsoleAnalyzer: false},
        {Id: 4, NEName: "Setup14",	NETYPE: "TPS24",	Product: "TPS",	IP: "135.242.243.14",	Owner: "Altran",	Inventory: true,	Ddm:true,	Alarm:true,	Cpu:true, Sync:true, Ptp:true,	HardDisk: true,	Temperature: true,	Bs0dump: true,	SummaryInfo: true,	TraceInfo: false,	FreeCmd: false,	ConsoleLog: false,	PmPort: false,	PmSap: true,	SqlRecord: true,	Topology: true,	ConsoleAnalyzer: false},
        {Id: 5, NEName: "Setup15",	NETYPE: "TPS24",	Product: "TPS",	IP: "135.242.243.15",	Owner: "XZC",	Inventory: true,	Ddm:true,	Alarm:true,	Cpu:true, Sync:true, Ptp:true,	HardDisk: true,	Temperature: true,	Bs0dump: true,	SummaryInfo: true,	TraceInfo: false,	FreeCmd: false,	ConsoleLog: false,	PmPort: false,	PmSap: true,	SqlRecord: true,	Topology: true,	ConsoleAnalyzer: false},
      ],
      // loading: false,
      total: 0,
      current: 1,
      pageSize: 20,
      updatemodal: false,
      formItem: {
        Id: 0,
        NEName:'',
        NETYPE:'',
        Product:'',
        IP:'',
        Owner:''
      },
      NETYPESelected: '',
      NETYPEList:[
        {
            value: 'TPS12',
            label: 'TPS12'
        },
        {
            value: 'TPS24',
            label: 'TPS24'
        }
      ],
      delmodal: false,
      delId: '',

      addmodal: false,
    };
  },
  mounted() {},
  created() {},
  methods: {
    getData(){

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
    edit(row){
      console.log(row);
      this.updatemodal = true;
      this.NETYPESelected = row.NETYPE

      this.formItem.Id = row.Id;
      this.formItem.NEName = row.NEName
      this.formItem.Product = row.Product
      this.formItem.IP = row.IP
      this.formItem.Owner = row.Owner
      this.formItem.NETYPE = row.NETYPE
    },
    cancelUpdate() {
      this.clearFormItem();
    },
    clearFormItem() {
      this.formItem.Id = 0
      this.formItem.NEName = ''
      this.formItem.NETYPE = ''
      this.formItem.Product = ''
      this.formItem.IP = ''
      this.formItem.Owner = ''
    },
    remove(Id){
      this.delmodal = true;
      this.delId = Id;
    },
    DelCfg(){
      let neList = this.neList;
      neList.forEach((element, key) => {
        if(element.Id == this.delId){
          this.neList.splice(key, 1);
        }
      });
    },
    cancelDel(){
      this.delmodal = false;
    },
    updateNeConfig() {
      this.formItem.NETYPE = this.NETYPESelected;
      this.neList.forEach((item, key) => {
        if(this.formItem.Id == item.Id){
          item.NEName = this.formItem.NEName;
          item.NETYPE = this.formItem.NETYPE;
          item.Product = this.formItem.Product;
          item.IP = this.formItem.IP;
          item.Owner = this.formItem.Owner;
        }
      });
    },
    showAddModal(){
      this.addmodal = true;
    },
    addNeConfig(){
      this.formItem.NETYPE = this.NETYPESelected;
      // todos
    },
    cancelAdd(){
      this.addmodal = false;
    }
  },
  watch: {}
};
</script>

<style scoped lang="scss">
</style>