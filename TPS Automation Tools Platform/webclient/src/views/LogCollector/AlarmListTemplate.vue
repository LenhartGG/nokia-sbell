<template>
    <Form label-position="top">
        <ul class="alarm-list">
        <li v-for="(item, index) in AlarmList" :key="index"
            style="min-height: 46px;">
            <span v-if="!item.editable">{{item.text}}</span>
            <Input ref="alarmInput" v-show="item.editable" :value="item.text" style="width: 200px;" />

            <a v-if="!item.editable" style="float: right;" href="javascript:void(0)" @click="deleteAlarm(index)">Delete</a>
            <a v-if="!item.editable" style="float: right; margin-right: 20px;" href="javascript:void(0)" @click="editAlarm(index)">Edit</a>

            <div v-if="item.editable" 
            style="float: right;">
            <Button type="primary" size="default" @click="saveAlarm(index)">Save</Button>
            <Button size="default" 
                style="margin-left: 10px;"
                @click="cancelAlarm(index)">
                Cancel
            </Button>
            </div>
        </li>
        <li><Button type="dashed" long @click="handleAddAlarm" icon="md-add">Add item</Button></li>
        </ul>
    </Form>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  props: ["AlarmList"],
  data() {
    return {
        
    //   AlarmList: [
    //     {text: "AUTOSWTIMREF", editable: false},
    //     {text: "YNCREFUNEQ", editable: false},
    //     {text: "TI-T4", editable: false},
    //     {text: "WR", editable: false},
    //     {text: "ET", editable: false},
    //     {text: "EPLUNITMISSMOD", editable: false},
    //     {text: "LK", editable: false},
    //   ],
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
  },
  watch: {},
  components: {}
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