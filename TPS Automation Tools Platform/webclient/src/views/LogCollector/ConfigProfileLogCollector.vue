<template>
  <div>
    
    <Form label-position="left" class="clearfix" style="margin-top:20px;">
          <label style="margin-left: 10px">Loop Time：</label>
          <InputNumber :min="0" v-model="looptime"></InputNumber>
          <label style="margin-left: 20px">Loop Interval：</label>
          <InputNumber :min="0" v-model="loopinterval"></InputNumber>
          <label style="margin-left: 20px">Print Error Flag：</label>
          <Checkbox v-model="printErrorFlag">{{printErrorFlag}}</Checkbox>
    </Form>
    
    <Tabs value="name1"  style="margin-top: 20px">
      <TabPane label="AlarmList" name="name1">
        <AlarmListTemplate :AlarmList="AlarmList"></AlarmListTemplate>
      </TabPane>

      <TabPane label="MailList" name="name2">
        <AlarmListTemplate :AlarmList="MailList"></AlarmListTemplate>
      </TabPane>

      <TabPane label="ConsoleKeyWords" name="name3">
        <AlarmListTemplate :AlarmList="ConsoleKeyWords"></AlarmListTemplate>
      </TabPane>

      <TabPane label="neSummary_tps24" name="name4">
        <AlarmListTemplate :AlarmList="neSummary_tps24"></AlarmListTemplate>
      </TabPane>

      <TabPane label="neSummary_tps12" name="name5">
        <AlarmListTemplate :AlarmList="neSummary_tps12"></AlarmListTemplate>
      </TabPane>

      <TabPane label="traceSummary_logfile" name="name6">
        <AlarmListTemplate :AlarmList="traceSummary_logfile"></AlarmListTemplate>
      </TabPane>

      <!-- FreeCmd -->
      <TabPane label="FreeCmd" name="name7">
          <div style="height: 34px;"> <Button style="float:right;" @click="showAddModal" type="info">+ Add</Button> </div>
          <Table
            border
            ref="selection"
            :columns="FreeCmdColumns"
            :data="FreeCmdList"
            max-height="300">
          </Table>
      </TabPane>
      
      <Modal v-model="updateFreeCmdModel" title="Update FreeCmd" @on-ok="handleUpdateFreeCmd" @on-cancel="cancelFreeCmdUpdate" ok-text="Submit" cancel-text="Cancel">
        <Form :model="formItem" :label-width="160">
          <FormItem label="FreeCmd: "><Input v-model="formItem.FreeCmd" /></FormItem>
          <FormItem label="CmdType: "><Input v-model="formItem.CmdType" /></FormItem>
        </Form>
      </Modal>
      
      <Modal v-model="addFreeCmdModel" title="Add FreeCmd" @on-ok="handleAddFreeCmd" @on-cancel="cancelFreeCmdAdd" ok-text="Submit" cancel-text="Cancel">
        <Form :model="formItem" :label-width="160">
          <FormItem label="FreeCmd: "><Input v-model="formItem.FreeCmd" /></FormItem>
          <FormItem label="CmdType: "><Input v-model="formItem.CmdType" /></FormItem>
        </Form>
      </Modal>

      <!-- Team Member List -->
      <TabPane label="Team Member List" name="name8">
          <div style="height: 34px;"> <Button style="float:right;" @click="showTeamMemberAddModal" type="info">+ Add</Button> </div>
          <Table
            border
            ref="selection"
            :columns="teamMemberColumns"
            :data="teamMemberList"
            max-height="300">
          </Table>
      </TabPane>
    </Tabs>
    
    <Modal v-model="updateTeamMemberModel" title="Update Team Member" @on-ok="handleUpdateTeamMember" @on-cancel="cancelTeamMemberUpdate" ok-text="Submit" cancel-text="Cancel">
      <Form :model="formTeamMember" :label-width="160">
        <FormItem label="teamMemberName: "><Input v-model="formTeamMember.teamMemberName" /></FormItem>
        <FormItem label="teamMemberMail: "><Input v-model="formTeamMember.teamMemberMail" /></FormItem>
      </Form>
    </Modal>
    
    <Modal v-model="addTeamMemberModel" title="Add Team Member" @on-ok="handleAddTeamMember" @on-cancel="cancelTeamMemberAdd" ok-text="Submit" cancel-text="Cancel">
      <Form :model="formTeamMember" :label-width="160">
        <FormItem label="teamMemberName: "><Input v-model="formTeamMember.teamMemberName" /></FormItem>
        <FormItem label="teamMemberMail: "><Input v-model="formTeamMember.teamMemberMail" /></FormItem>
      </Form>
    </Modal>
    
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'
import AlarmListTemplate from './AlarmListTemplate.vue'
export default {
  components: { AlarmListTemplate },
  props: {},
  data() {
    return {
      AlarmList: [
        {text: "AUTOSWTIMREF", editable: false},
        {text: "YNCREFUNEQ", editable: false},
        {text: "TI-T4", editable: false},
        {text: "WR", editable: false},
        {text: "ET", editable: false},
        {text: "EPLUNITMISSMOD", editable: false},
        {text: "LK", editable: false},
      ],
      looptime: 0,
      loopinterval: 0,
      printErrorFlag: false,
      MailList: [
        { text: "Jianfeng.1.wang@nokia-sbell.com", editable: false },
        { text: "yanze.chen.ext@nokia-sbell.com", editable: false },
        { text: "jinghua.a.qian@nokia-sbell.com", editable: false },
        { text: "bijun.wan@nokia-sbell.com", editable: false },
        { text: "liting.ma@nokia-sbell.com", editable: false },
        { text: "haixiao.wang.ext@nokia-sbell.com", editable: false },
        { text: "hermes-svt@LIST.NOKIA.COM", editable: false },
        { text: "flag_send_to_cc=False", editable: false },
      ],
      ConsoleKeyWords: [
        { text: "Period: 20200410,20200414", editable: false },
        { text: "Period: -3,20200414", editable: false },
        { text: "Period: -1,now", editable: false },
        { text: "EQM temperature above ThreshL", editable: false },
        { text: "device [[0-9]+:[0-9]+] error status/mask", editable: false },
        { text: "0000:00:00.0: PCIe Bus Error: severity=", editable: false },
        { text: "0001:00:00.0: PCIe Bus Error: severity=", editable: false },
        { text: "0002:00:00.0: PCIe Bus Error: severity=", editable: false },
        { text: "0003:00:00.0: PCIe Bus Error: severity=", editable: false },
        { text: "Machine check in kernel mode", editable: false },
        { text: "Caused by (from MCSR=8000)", editable: false },
        { text: "Instruction Fetch Error Report", editable: false },
        { text: "Oops: Machine check, sig: 7", editable: false },
        { text: "AER: Uncorrected (Non-Fatal) error received: id=0000", editable: false },
        { text: "Completion Timeout", editable: false },
        { text: "Kernel panic - not syncing: Fatal exception", editable: false },
        { text: "Rebooting in 1 seconds", editable: false },
        { text: "Call Trace", editable: false },
        { text: "Instruction dump", editable: false },
        { text: "Oops", editable: false },
        { text: "nobody cared", editable: false },
        { text: "PowerPC Book-E Watchdog Exception", editable: false },
        { text: "soc_schan_op: operation attempt timed out", editable: false },
        { text: "EQM temperature above ThreshL", editable: false },
        { text: "device error status", editable: false },
        { text: "pci_irq_cfg_write: crc-7c26, magic-a3, name-Fquenya, vid-10ee vs. 10ee, did-7011 vs. 701", editable: false },
        { text: "irqProbe : Bad device config info", editable: false },
      ],
      neSummary_tps24:[
        { text: "getAll_port", editable: false },
        { text: "getAll_vpls", editable: false },
        { text: "getAll_sap", editable: false },
        { text: "getAll_domain", editable: false },
        { text: "getAll_association", editable: false },
        { text: "getAll_portInventory", editable: false },
        { text: "show condition", editable: false },
        { text: "alm", editable: false },
        { text: "end", editable: false },
        { text: "getAll_ErpRing", editable: false },
        { text: "getAll_ErpRingPath", editable: false },
        { text: "getAll_OamMep", editable: false },
      ],
      neSummary_tps12:[
        { text: "getAll_port", editable: false },
        { text: "getAll_vpls", editable: false },
        { text: "getAll_sap", editable: false },
        { text: "getAll_domain", editable: false },
        { text: "getAll_association", editable: false },
        { text: "getAll_portInventory", editable: false },
        { text: "show condition", editable: false },
        { text: "alm", editable: false },
        { text: "end", editable: false },
        { text: "getAll_ErpRing", editable: false },
        { text: "getAll_ErpRingPath", editable: false },
        { text: "getAll_OamMep", editable: false },
      ],
      traceSummary_logfile: [
        {text: "/tmp/*.log", editable: false},
        {text: "/pureNeApp/database/*", editable: false},
        {text: "/pureNeApp/*.log", editable: false},
        {text: "/pureNeApp/*.txt", editable: false},
        {text: "/data/application/log/*", editable: false},
        {text: "/data/platform/sda*/var/log/*", editable: false},
        {text: "/var/log/user.log", editable: false},
        {text: "/data/application/log/ual.log.*", editable: false},
      ],

      // FreeCmdList
      FreeCmdList: [
        { FreeCmd: "show version detail", CmdType: "cli", editable: false },
        { FreeCmd: "show general detail", CmdType: "cli", editable: false },
        { FreeCmd: "echo \"\`date` Get system basic info\"", CmdType: "linux", editable: false },
        { FreeCmd: "hostname", CmdType: "linux", editable: false },
        { FreeCmd: "ifconfig lan1", CmdType: "linux", editable: false },
        { FreeCmd: "route", CmdType: "linux", editable: false },
        { FreeCmd: "iptables -L", CmdType: "linux", editable: false },
        { FreeCmd: "cat /proc/`pgrep CPEIMG`/maps |grep libbcmsdk.so|head -n 1|awk -F '-' '{print $1}' ", CmdType: "linux", editable: false },
        { FreeCmd: "cat /etc/ntpq_output", CmdType: "linux", editable: false },
        { FreeCmd: "cat /var/lib/dhcp/dhcpd.leases", CmdType: "linux", editable: false },
        { FreeCmd: "cat /etc/hosts ", CmdType: "linux", editable: false },
        { FreeCmd: "cat /etc/crontab", CmdType: "linux", editable: false },
        { FreeCmd: "netstat -nalpe", CmdType: "linux", editable: false },
        { FreeCmd: "df", CmdType: "linux", editable: false },
        { FreeCmd: "lsmod", CmdType: "linux", editable: false },
        { FreeCmd: "lspci -v", CmdType: "linux", editable: false },
        { FreeCmd: "ipcs", CmdType: "linux", editable: false },
        { FreeCmd: "cat /proc/iomem", CmdType: "linux", editable: false },
        { FreeCmd: "cat /proc/`pgrep CPEIMG`/smaps ", CmdType: "linux", editable: false },
        { FreeCmd: "cat /proc/meminfo", CmdType: "linux", editable: false },
        { FreeCmd: "lsof -n | awk '{print $2}'| sort | uniq -c | sort -nr ", CmdType: "linux", editable: false },
        { FreeCmd: "ks_qv_cpld_cmd op=resettype", CmdType: "linux", editable: false },
        { FreeCmd: "cat /pureNeApp/tftpboot/u-boot.version", CmdType: "linux", editable: false },
        { FreeCmd: "cat /var/lib/firmware/quenya_cpld.version", CmdType: "linux", editable: false },
        { FreeCmd: "mm --rdl 0xc30000000 2 ", CmdType: "linux", editable: false },
        { FreeCmd: "echo \"Get BCM, PLL, VSC info\"", CmdType: "linux", editable: false },
        { FreeCmd: "cpe npapi bcm ver", CmdType: "dbg", editable: false },
        { FreeCmd: "cpe npapi bcm a", CmdType: "dbg", editable: false },
        { FreeCmd: "cpe npapi bcm *:ps", CmdType: "dbg", editable: false },
        { FreeCmd: "cpe npapi bcm *:show c", CmdType: "dbg", editable: false },
        { FreeCmd: "cpe npapi bcm *:mcsstat", CmdType: "dbg", editable: false },
        { FreeCmd: "ps -aem -o pid,ppid,lwp,pcpu,pmem,psr,rss,sz,time,etime,cputime,vsize,priority --sort=-pcpu", CmdType: "linux", editable: false },
        { FreeCmd: "ps -aem -o intpri,rtprio,policy,nice,flag,stat,ucomm,wchan,nwchan,esp,eip,cp,session --sort=-pcpu", CmdType: "linux", editable: false },
      ],
      FreeCmdColumns: [
        {
          title: "FreeCmd",
          key: "FreeCmd",
        },
        {
          title: "CmdType",
          key: "CmdType",
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
                      this.editFreeCmd(params.row)
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
                      this.removeFreeCmd(params.row)
                    }
                  }
                },
                'Delete'
              )
            ])
          }
        }
      ],
      updateFreeCmdModel: false,
      formItem: {
        FreeCmd: '',
        CmdType: ''
      },
      addFreeCmdModel: false,
      // teamMemberList
      teamMemberList: [
        { teamMemberName: "ALTRAN", teamMemberMail: "jiannan.hua@nokia-sbell.com", editable: false },
        { teamMemberName: "CJ", teamMemberMail: "jing.1.chen.ext@nokia-sbell.com", editable: false },
        { teamMemberName: "CYZ", teamMemberMail: "yanze.chen.ext@nokia-sbell.com", editable: false },
        { teamMemberName: "HJN", teamMemberMail: "jiannan.hua@nokia-sbell.com", editable: false },
        { teamMemberName: "LPB", teamMemberMail: "pengbin.liu@nokia-sbell.com", editable: false },
        { teamMemberName: "MLT", teamMemberMail: "liting.ma@nokia-sbell.com", editable: false },
        { teamMemberName: "QJH", teamMemberMail: "jinghua.a.qian@nokia-sbell.com", editable: false },
        { teamMemberName: "QZG", teamMemberMail: "zhigang.a.qiu@nokia-sbell.com", editable: false },
        { teamMemberName: "SR", teamMemberMail: "rong.1.shen.ext@nokia-sbell.com", editable: false },
        { teamMemberName: "WBJ", teamMemberMail: "bijun.wan@nokia-sbell.com", editable: false },
        { teamMemberName: "WDC", teamMemberMail: "daocheng.wang@nokia-sbell.com", editable: false },
        { teamMemberName: "WHX", teamMemberMail: "haixiao.wang.ext@nokia-sbell.com", editable: false },
        { teamMemberName: "WJF", teamMemberMail: "jianfeng.1.wang@nokia-sbell.com", editable: false },
        { teamMemberName: "WX", teamMemberMail: "xi.a.wu@nokia-sbell.com", editable: false },
        { teamMemberName: "XJ", teamMemberMail: "jun.k.xu@nokia-sbell.com", editable: false },
        { teamMemberName: "XZC", teamMemberMail: "zhaochen.xia@nokia-sbell.com", editable: false },
        { teamMemberName: "ZLQ", teamMemberMail: "liqin.a.zhang@nokia-sbell.com", editable: false },
        { teamMemberName: "ZM", teamMemberMail: "ming.a.zhong@nokia-sbell.com", editable: false },
        { teamMemberName: "ZZY", teamMemberMail: "zheyun.zhou@nokia-sbell.com", editable: false },
        { teamMemberName: "TEAM_TPS", teamMemberMail: "Jianfeng.1.wang@nokia-sbell.com", editable: false },
        { teamMemberName: "ADMIN_TPS", teamMemberMail: "Jianfeng.1.wang@nokia-sbell.com", editable: false },
      ],
      teamMemberColumns: [
        {
          title: "teamMemberName",
          key: "teamMemberName",
        },
        {
          title: "teamMemberMail",
          key: "teamMemberMail",
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
                      this.editTeamMember(params.row)
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
                      this.removeTeamMember(params.row)
                    }
                  }
                },
                'Delete'
              )
            ])
          }
        }
      ],
      updateTeamMemberModel: false,
      formTeamMember: {
        teamMemberName: "",
        teamMemberMail: ""
      },
      addTeamMemberModel: false,
    };
  },
  mounted() {},
  created() {},
  methods: {
    editAlarm(index){
      this.AlarmList.forEach((element, key) => {
        if(index == key){
          element.editable = true;
          return;
        }
        element.editable = false;
      });
      
      this.$nextTick(() => {
        this.$refs.alarmInput[index].focus();
      });
    },
    deleteAlarm(index){
      this.AlarmList.splice(index, 1);
    },
    saveAlarm(index){
      this.AlarmList[index].editable = false;
      this.AlarmList[index].text = this.$refs.alarmInput[index].currentValue;
      console.log(this.$refs.alarmInput[index].currentValue);
      
      console.log(this.$refs.alarmInput[index]);
      
    },
    cancelAlarm(index){
      this.$refs.alarmInput[index].currentValue = this.AlarmList[index].text;
      this.AlarmList[index].editable = false;
    },
    handleAddAlarm(){
      this.AlarmList.push({
        text: "", 
        editable: true
      });
      this.$nextTick(() => {
        this.$refs.alarmInput[this.AlarmList.length-1].focus();
      })
    },
    editFreeCmd(row){
      this.formItem.FreeCmd = row.FreeCmd;
      this.formItem.CmdType = row.CmdType;
      this.updateFreeCmdModel = true;
    },
    removeFreeCmd(row){
      console.log("removeFreeCmd");
    },
    handleUpdateFreeCmd(){
      console.log("handleUpdateFreeCmd");
    },
    cancelFreeCmdUpdate(){
      console.log("cancelFreeCmdUpdate");
    },
    showAddModal(){
      this.addFreeCmdModel = true;
    },
    handleAddFreeCmd(){
      console.log("handleAddFreeCmd");
      this.formTeamMember.FreeCmd = "";
      this.formTeamMember.CmdType = "";
    },
    cancelFreeCmdAdd(){
      console.log("cancelFreeCmdAdd");
    },
    
    editTeamMember(row){
      this.formTeamMember.teamMemberName = row.teamMemberName;
      this.formTeamMember.teamMemberMail = row.teamMemberMail;
      this.updateTeamMemberModel = true;
    },
    removeTeamMember(row){
      console.log("removeTeamMember");
    },
    handleUpdateTeamMember(){
      console.log("handleUpdateTeamMember");
    },
    cancelTeamMemberUpdate(){
      console.log("cancelTeamMemberUpdate");
    },
    showTeamMemberAddModal(){
      this.addTeamMemberModel = true;
    },
    handleAddTeamMember(){
      console.log("handleAddTeamMember");
      this.formTeamMember.teamMemberName = "";
      this.formTeamMember.teamMemberMail = "";
    },
    cancelTeamMemberAdd(){
      console.log("cancelTeamMemberAdd");
    }
  },
  watch: {},
};
</script>

<style scoped lang="scss">

.alarm-list {
  border: 1px solid #e9e9e9;
  li{
    padding: 12px 40px 12px 20px;
    border-bottom: 1px solid #e8eaec;
  }
  li:nth-last-of-type(1){
    border-bottom: none;
  }
}

</style>