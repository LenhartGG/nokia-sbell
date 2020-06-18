<template>
  <div>
    
      <Table
        border
        ref="selection"
        :loading="loading"
        :columns="neListColumns"
        :data="neList"
        max-height="300"
        @on-selection-change="onSelectionChange">
      </Table>

      <div style="float: right; padding: 18px;">
          <Button type="primary" :loading="isConfirmLoading" @click="handleConfim">
              <span v-if="!isConfirmLoading">Confirm</span>
              <span v-else>Loading...</span>
          </Button>
      </div>
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  props: {},
  data() {
    return {

      loading: false,
      isConfirmLoading: false,

      neListColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "NEName",
          key: "NEName",
          width: 100,
        },
        {
          title: "NETYPE",
          key: "NETYPE",
          width: 100,
        },
        {
          title: "Product",
          key: "Product",
          width: 100,
        },
        {
          title: "IP",
          key: "IP",
          width: 150,
        },
        {
          title: "Owner",
          key: "Owner",
          width: 100,
        },
        // {
        //   title: "Connect",
        //   key: "Connect",
        //   width: 100,
        // },
        {
          title: "Inventory",
          key: "Inventory",
          width: 110,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.Inventory
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].Inventory = val;
                          }
                        }
                      },
                      param.row.Inventory);
          }
        },
        {
          title: "Ddm",
          key: "Ddm",
          width: 100,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.Ddm
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].Ddm = val;
                          }
                        }
                      },
                      param.row.Ddm);
          }
        },
        {
          title: "Alarm",
          key: "Alarm",
          width: 100,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.Alarm
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].Alarm = val;
                          }
                        }
                      },
                      param.row.Alarm);
          }
        },
        {
          title: "Cpu",
          key: "Cpu",
          width: 100,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.Cpu
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].Cpu = val;
                          }
                        }
                      },
                      param.row.Cpu);
          }
        },
        {
          title: "Sync",
          key: "Sync",
          width: 100,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.Sync
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].Sync = val;
                          }
                        }
                      },
                      param.row.Sync);
          }
        },
        {
          title: "Ptp",
          key: "Ptp",
          width: 100,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.Ptp
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].Ptp = val;
                          }
                        }
                      },
                      param.row.Ptp);
          }
        },
        {
          title: "HardDisk",
          key: "HardDisk",
          width: 100,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.HardDisk
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].HardDisk = val;
                          }
                        }
                      },
                      param.row.HardDisk);
          }
        },
        {
          title: "Temperature",
          key: "Temperature",
          width: 130,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.Temperature
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].Temperature = val;
                          }
                        }
                      },
                      param.row.Temperature);
          }
        },
        {
          title: "Bs0dump",
          key: "Bs0dump",
          width: 110,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.Bs0dump
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].Bs0dump = val;
                          }
                        }
                      },
                      param.row.Bs0dump);
          }
        },
        {
          title: "SummaryInfo",
          key: "SummaryInfo",
          width: 130,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.SummaryInfo
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].SummaryInfo = val;
                          }
                        }
                      },
                      param.row.SummaryInfo);
          }
        },
        {
          title: "TraceInfo",
          key: "TraceInfo",
          width: 120,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.TraceInfo
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].TraceInfo = val;
                          }
                        }
                      },
                      param.row.TraceInfo);
          }
        },
        {
          title: "FreeCmd",
          key: "FreeCmd",
          width: 110,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.FreeCmd
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].FreeCmd = val;
                          }
                        }
                      },
                      param.row.FreeCmd);
          }
        },
        {
          title: "ConsoleLog",
          key: "ConsoleLog",
          width: 130,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.ConsoleLog
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].ConsoleLog = val;
                          }
                        }
                      },
                      param.row.ConsoleLog);
          }
        },
        {
          title: "PmPort",
          key: "PmPort",
          width: 100,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.PmPort
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].PmPort = val;
                          }
                        }
                      },
                      param.row.PmPort);
          }
        },
        {
          title: "PmSap",
          key: "PmSap",
          width: 100,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.PmSap
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].PmSap = val;
                          }
                        }
                      },
                      param.row.PmSap);
          }
        },
        {
          title: "SqlRecord",
          key: "SqlRecord",
          width: 120,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.SqlRecord
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].SqlRecord = val;
                          }
                        }
                      },
                      param.row.SqlRecord);
          }
        },
        {
          title: "Topology",
          key: "Topology",
          width: 100,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.Topology
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].Topology = val;
                          }
                        }
                      },
                      param.row.Topology);
          }
        },
        {
          title: "ConsoleAnalyzer",
          key: "ConsoleAnalyzer",
          width: 160,
          render: (h ,param) => {
            return h("Checkbox", 
                      {
                        props: {
                          value: param.row.ConsoleAnalyzer
                        },
                        on: {
                          'on-change': (val) => {
                            console.log(val, param);
                            this.neList[param.index].ConsoleAnalyzer = val;
                          }
                        }
                      },
                      param.row.ConsoleAnalyzer);
          }
        },

      ],
      neList: [
        // {
        //   NEName: "Setup51",
        //   NEType: "TPS24",
        //   IP: "135.242.243.51",
        //   TestSetList: "Ixia_wjf_1,5800_wjf_1,Ixia_wjf_1",
        //   DBServer: "135.252.217.71",
        //   DBUser: "root",
        //   DBPassword: "hermes123",
        //   DBPath: "/home/svtftp/database/",
        //   SWServer: "135.252.219.139",
        //   SWUser: "nei",
        //   SWPassword: "12345",
        //   SWPath: "/home/ci/loads/delivery/V01.00/latest"
        // }Alarm	Cpu	Sync	Ptp	HardDisk	Temperature	Bs0dump	SummaryInfo	TraceInfo	FreeCmd	ConsoleLog	PmPort	PmSap	SqlRecord	Topology	ConsoleAnalyzer

        { NEName: "Setup11",	NETYPE: "TPS24",	Product: "TPS",	IP: "135.242.243.11",	Owner: "Altran",	Inventory: true,	Ddm:true,	Alarm:true,	Cpu:true, Sync:true, Ptp:true,	HardDisk: true,	Temperature: true,	Bs0dump: true,	SummaryInfo: true,	TraceInfo: false,	FreeCmd: false,	ConsoleLog: false,	PmPort: false,	PmSap: true,	SqlRecord: true,	Topology: true,	ConsoleAnalyzer: false},
        { NEName: "Setup12",	NETYPE: "TPS24",	Product: "TPS",	IP: "135.242.243.12",	Owner: "Altran",	Inventory: true,	Ddm:true,	Alarm:true,	Cpu:true, Sync:true, Ptp:true,	HardDisk: true,	Temperature: true,	Bs0dump: true,	SummaryInfo: true,	TraceInfo: false,	FreeCmd: false,	ConsoleLog: false,	PmPort: false,	PmSap: true,	SqlRecord: true,	Topology: true,	ConsoleAnalyzer: false},
        { NEName: "Setup13",	NETYPE: "TPS24",	Product: "TPS",	IP: "135.242.243.13",	Owner: "Altran",	Inventory: true,	Ddm:true,	Alarm:true,	Cpu:true, Sync:true, Ptp:true,	HardDisk: true,	Temperature: true,	Bs0dump: true,	SummaryInfo: true,	TraceInfo: false,	FreeCmd: false,	ConsoleLog: false,	PmPort: false,	PmSap: true,	SqlRecord: true,	Topology: true,	ConsoleAnalyzer: false},
        { NEName: "Setup14",	NETYPE: "TPS24",	Product: "TPS",	IP: "135.242.243.14",	Owner: "Altran",	Inventory: true,	Ddm:true,	Alarm:true,	Cpu:true, Sync:true, Ptp:true,	HardDisk: true,	Temperature: true,	Bs0dump: true,	SummaryInfo: true,	TraceInfo: false,	FreeCmd: false,	ConsoleLog: false,	PmPort: false,	PmSap: true,	SqlRecord: true,	Topology: true,	ConsoleAnalyzer: false},
        { NEName: "Setup15",	NETYPE: "TPS24",	Product: "TPS",	IP: "135.242.243.15",	Owner: "XZC",	Inventory: true,	Ddm:true,	Alarm:true,	Cpu:true, Sync:true, Ptp:true,	HardDisk: true,	Temperature: true,	Bs0dump: true,	SummaryInfo: true,	TraceInfo: false,	FreeCmd: false,	ConsoleLog: false,	PmPort: false,	PmSap: true,	SqlRecord: true,	Topology: true,	ConsoleAnalyzer: false},

      ],
      selection: [],
      
    };
  },
  mounted() {},
  created() {},
  methods: {
    onSelectionChange(selection){
      console.log(selection);
      this.selection = selection;
    },
    handleConfim(){
      if(!this.selection || this.selection.length == 0){
        alert("Please select NE first.")
        return;
      }
      this.isConfirmLoading = true;
      console.log(JSON.parse(JSON.stringify(this.selection)));
      
      let timer = setTimeout(() => {
        this.isConfirmLoading = false;
        clearTimeout(timer);
        timer = null;
      }, 1000);
    }
  },
  watch: {},
  components: {}
};
</script>

<style scoped lang="scss">
th.ivu-table-cell {
    padding-left: 10px!important;
    padding-right: 10px!important;
}
</style>