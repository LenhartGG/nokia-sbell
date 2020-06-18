<template>
  <div class style="margin:0 auto; ">
    <!-- content -->
    <!-- <p>当前正在进行第 {{ current + 1 }} 步</p> -->
    <Steps :current="currentStep">
      <Step title="Choose NE-list"></Step>
      <Step title="Operation"></Step>
      <Step title="Confirm"></Step>
    </Steps>

    <!-- step0 Choose NE-list -->
    <div v-if="currentStep==0" style="margin-top: 30px;">
      <p>Please choose the network:</p>
      <Table
        border
        ref="selection"
        :loading="loading"
        :columns="neListColumns"
        :data="neList"
        max-height="300"
        @on-selection-change="onSelectionChange"
        @on-select="onSelect">
      </Table>
      <div style="margin: 10px; overflow: hidden;">
        <Button style="float: right; margin-left: 50px;" type="primary" @click="createGroup">Group</Button>

        <!-- 分页 -->
        <!-- <div style="float: right;">
              <Page :total="10" :page-size="5" :current="currentPage" show-elevator @on-change="changePage"></Page>
        </div>-->
      </div>
      <div class="clearfix" style="margin-top: 40px;">
        <Card
          v-for="(group, groupKey) in groupList || deduplication"
          :key="groupKey"
          style="float: left ; width:30%; margin-top: 20px; margin-left: 0; margin-right: 3%;"
          v-clickoutside="(e) => outsideEventHandler(e, group)"
        >
          <div slot="title">
            <span
              v-show="!group.isRename"
              style="color: #1890FF; height: 20px; line-height: 20px; font-size: 16px;"
              @dblclick="handleStartRename(group, groupKey)"
            >{{group.title}}</span>
            <Input
              v-show="group.isRename"
              ref="groupNameInput"
              :autofocus="group.isRename"
              @on-enter="handleEnterRename(group)"
              @on-blur="handleInputBlur(group)"
              v-model="group.title"
              :value="group.title"
              size="default"
              placeholder="Enter something..."
              style="width: 100px; margin-left: -4x; margin-top: -5px; margin-bottom: -7px; "
            />
            <img 
              src="@/assets/images/rename.png" 
              style="width: 14px; margin-left: 4px; vertical-align: bottom; cursor: pointer;" 
              alt="rename" 
              @click="handleStartRename(group, groupKey)"
            />
          </div>

          <!-- <Button slot="extra" type="default" style="margin-top: -5px;"
            @click="handleStartRename(group, groupKey)"
          >rename</Button> -->

          <Tag
            v-for="(neItem, neIndex) in group.neArray"
            :key="neIndex"
            :closable="group.closable"
            @on-close="handleClickTagClose(group.neArray, neIndex, neItem.Id, group.id)"
          >{{neItem.NEName}}</Tag>

          <Dropdown trigger="click">
            <Button
              v-if="group.closable"
              icon="ios-add"
              type="dashed"
              size="small"
              @click="handleClickAddTag(group)"
            >Add NE</Button>
            <DropdownMenu slot="list">
              <div style="width:320px; padding-left: 18px;">
                <Tag
                  color="primary"
                  v-for="(item, key) in checkedNeList"
                  :key="key"
                  :checkable="!item.checked"
                  :checked="item.checked"
                  :name="item.NEName"
                  @on-change="(checked, name) => { handleCheckChange(checked, name, item, group.neArray, group.id); }"
                >{{item.NEName}}</Tag>
              </div>
            </DropdownMenu>
          </Dropdown>

          <ul v-if="true" class="clearfix group-card">
            <li>
              <img src="@/assets/images/icon-delete.png" alt="delete" @click="delGroup(groupKey, group.id, group.title)" />
            </li>
            <li>
              <img src="@/assets/images/icon-edit.png" alt="edit" @click="editGroup(group)" />
            </li>
          </ul>
        </Card>
      </div>
    </div>

    <!-- step1 operation -->
    <div v-if="currentStep==1" style="margin-top: 30px; ">
      <div>
        <p style="color:rgba(24,144,255,1);">
          <span style="color:rgba(24,144,255,1); font-size:24px;">Operation</span> &nbsp;
          <span style="font-size:14px;">Drag to the table</span>
        </p>
        <ul class="tools clearfix">
          <li
            v-for="(item, index) in operationList"
            :key="index"
            :draggable="true"
            @dragstart="dragStart($event, index)"
            style="cursor: move;"
          >
            <!-- <img src="@/assets/images/operation-neporv.png"> -->
            <img :src="item.src" />
            <p>{{item.text}}</p>
          </li>
        </ul>
      </div>

      <div
        style="position: relative;"
        @dragover.prevent="allowDrop($event)"
        @drop="drop($event)"
      >
        <Table
          border
          :columns="operationColumns"
          :data="data1"
          :draggable="true"
          @on-drag-drop="onDragDrop"
        >
          <template slot-scope="{ row, index }" slot="group">
            <Select v-model="row.group" @on-change="selected => selectChangeGroup(selected, index)">
              <Option
                v-for="group in groupList"
                :value="group.title"
                :key="group.title"
              >{{ group.title }}</Option>
            </Select>
          </template>
          <template slot-scope="{ row, index }" slot="loop">
            <InputNumber :min="0" v-model="data1[index].loop"></InputNumber>
          </template>
          <template slot-scope="{ row, index }" slot="trafficmonitor">
            <Checkbox v-model="data1[index].trafficmonitor">{{data1[index].trafficmonitor}}</Checkbox>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="showView(index)"
            >View</Button>
            <Button type="error" size="small" @click="remove(index)">Delete</Button>
          </template>
        </Table>
        <div
          v-if="showRedDrag"
          :class="{'red-border': true, 'margin-top-0px': isMargintop0}"
        >Drag to the table</div>
      </div>
    </div>

    <!-- step2 Confirm -->
    <div v-if="currentStep==2" style="margin-top: 30px;">
      <h3>Group list:</h3>
      <Table
        border
        :columns="groupListColumns"
        :data="selectedNelist"
        width="auto"
        v-merge-cell="{cell, groupListColumns, selectedNelist}"
      ></Table>
      <h3>Group Operation:</h3>
      <Table border :columns="columns1" :data="data1" width="auto"></Table>
    </div>

    <!-- button -->
    <div class="clearfix">
      <div style="float:right; margin-top: 60px; height: 80px;">
        <Button v-if="currentStep!=0" type="primary" style="margin-right:50px" @click="back">Back</Button>
        <Button v-if="currentStep!=2" type="primary" @click="next">Next</Button>
        <Button v-if="currentStep==2" type="primary" @click="btnConfirm">Confirm</Button>
      </div>
    </div>

    <Alert v-if="showAlert">
      An info prompt
      <template
        slot="desc"
      >Content of prompt. Content of prompt. Content of prompt. Content of prompt.</template>
    </Alert>
    <!-- content/ -->
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'
import { getUserAllNeCfgs, operationConfirm, addNeGroup, renameNeGroup,
  deleteNeGroup, addNeIntoGroup, deleteNeFromGroup } from "../api/neservice";
import { getCookie } from "../common/tools";
import MergeCell from "ivu-table-merge";
import clickoutside from "vue-click-outside";

export default {
  props: {},
  data() {
    return {
      currentStep: 0,
      loading: false,
      neList: [
        {
          NEName: "Setup51",
          NEType: "TPS24",
          IP: "135.242.243.51",
          TestSetList: "Ixia_wjf_1,5800_wjf_1,Ixia_wjf_1",
          DBServer: "135.252.217.71",
          DBUser: "root",
          DBPassword: "hermes123",
          DBPath: "/home/svtftp/database/",
          SWServer: "135.252.219.139",
          SWUser: "nei",
          SWPassword: "12345",
          SWPath: "/home/ci/loads/delivery/V01.00/latest"
        }
      ],
      currentPage: 1,
      checkedNeList: [],
      closable: false,
      neListColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "NEName",
          key: "NEName",
          width: 100
        },
        {
          title: "NEType",
          key: "NEType",
          width: 100
        },
        {
          title: "IP",
          key: "IP",
          width: 140
        },
        {
          title: "TestSetList",
          slot: "TestSetList",
          minWidth: 120,
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
          title: "DBServer",
          key: "DBServer",
          width: 140
        },
        {
          title: "DBUser",
          key: "DBUser",
          width: 90
        },
        {
          title: "DBPassword",
          key: "DBPassword",
          width: 130
        },
        {
          title: "DBPath",
          key: "DBPath",
          minWidth: 180
        },
        {
          title: "SWServer",
          key: "SWServer",
          width: 160
        },
        {
          title: "SWUser",
          key: "SWUser",
          width: 100
        },
        {
          title: "SWPassword",
          key: "SWPassword",
          width: 128
        },
        {
          title: "SWPath",
          key: "SWPath",
          // width: 200,
          minWidth: 200
        }
      ],
      selectionList: [],
      customSelectionList: [],
      groupList: [
        // {
        //   title: "Group-1",
        //   closable: false,
        //   showAdd: false,
        //   isRename: false,
        //   neArray: [
        //     {
        //       checked: true,
        //       NEName: "Setup9",
        //       NEType: "TPS24",
        //       IP: "135.242.243.9",
        //       TestSetList: "lxia_1",
        //       DBServer: "135.252.217.71",
        //       DBUser: "root",
        //       DBPassword: "hermes123",
        //       DBPath: "/home/svtftp/database/",
        //       SWServer: "135.252.219.139",
        //       SWUser: "nei",
        //       SWPassword: "12345",
        //       SWPath: "/home/ci/loads/delivery/V01.00/latest"
        //     },
        //     {
        //       checked: true,
        //       NEName: "Setup10",
        //       NEType: "TPS24",
        //       IP: "135.242.243.10",
        //       TestSetList: "lxia_1",
        //       DBServer: "135.252.217.71",
        //       DBUser: "root",
        //       DBPassword: "hermes123",
        //       DBPath: "/home/svtftp/database/",
        //       SWServer: "135.252.219.139",
        //       SWUser: "nei",
        //       SWPassword: "12345",
        //       SWPath: "/home/ci/loads/delivery/V01.00/latest"
        //     }
        //   ]
        // }
      ],
      neGroupMap: {},
      neGroupIdMap: {},
      singleNeGroupMapX: {},
      selectedNeIds: [],
      operationList: [
        {
          text: "NEProv",
          src: require("@/assets/images/operation-neprov.png")
        },
        {
          text: "WarmReset",
          src: require("@/assets/images/operation-warmreset.png")
        },
        {
          text: "ColdReset",
          src: require("@/assets/images/operation-coldreset.png")
        },
        {
          text: "ColdForce",
          src: require("@/assets/images/operation-coldforce.png")
        },
        {
          text: "DBRestore",
          src: require("@/assets/images/operation-dbrestored.png")
        },
        {
          text: "Upgrade",
          src: require("@/assets/images/operation-upgrade.png")
        },
        {
          text: "Power",
          src: require("@/assets/images/operation-power.png")
        },
        {
          text: "DBClear",
          src: require("@/assets/images/operation-dbclear.png")
        },
        {
          text: "DBBackup",
          src: require("@/assets/images/operation-dbbackup.png")
        },
        {
          text: "DBBackupRestore",
          src: require("@/assets/images/operation-dbbackuprestore.png")
        }
      ],
      operationColumns: [
        {
          title: "Group Name",
          slot: "group"
        },
        {
          title: "Operation",
          key: "operation"
          // slot: "operation"
        },
        {
          title: "Loop Time",
          slot: "loop"
        },
        {
          title: "Traffic Monitor",
          // key: "trafficmonitor"
          slot: "trafficmonitor"
        },
        {
          title: "Action",
          slot: "action"
        }
      ],
      columns1: [
        {
          title: "Group",
          key: "group"
        },
        {
          title: "operation",
          key: "operation"
        },
        {
          title: "loop",
          key: "loop"
        },
        {
          title: "traffic monitor",
          key: "trafficmonitor"
        }
      ],
      data1: [
        // {
        //   group: "Group-1",
        //   operation: "NEPorv",
        //   loop: 1,
        //   trafficmonitor: true,
        // },
      ],
      showAlert: false,
      showRedDrag: false,

      groupListColumns: [
        {
          title: "Group",
          key: "group",
          width: 100,
          align: "center"
        },
        {
          title: "NEName",
          key: "NEName",
          width: 100
        },
        {
          title: "NEType",
          key: "NEType",
          width: 100
        },
        {
          title: "IP",
          key: "IP",
          width: 140
        },
        {
          title: "TestSetList",
          key: "TestSetList",
          minWidth: 120
        },
        {
          title: "DBServer",
          key: "DBServer",
          width: 140
        },
        {
          title: "DBUser",
          key: "DBUser",
          width: 90
        },
        {
          title: "DBPassword",
          key: "DBPassword",
          width: 130
        },
        {
          title: "DBPath",
          key: "DBPath",
          minWidth: 180
        },
        {
          title: "SWServer",
          key: "SWServer",
          width: 160
        },
        {
          title: "SWUser",
          key: "SWUser",
          width: 100
        },
        {
          title: "SWPassword",
          key: "SWPassword",
          width: 128
        },
        {
          title: "SWPath",
          key: "SWPath",
          // width: 200,
          minWidth: 200
        }
      ],

      cell: "group"
    };
  },
  mounted() {},
  created() {
    this.initData();
  },
  methods: {
    back() {
      if (this.currentStep == 0) {
        // this.currentStep = 2;
        return;
      } else {
        this.currentStep -= 1;
      }
    },
    next() {
      var stepflag_1 = false;
      var stepflag_2 = false;

      console.log(this.currentStep);
      if (this.currentStep == 0) {
        if (this.groupList.length == 0) {
          this.$Message.warning({
            content: "Please select some NEs and create an NE group.",
            duration: 5,
            background: true,
            closable: true
          });
          return;
        }
      }

      if (this.currentStep == 1) {
        if (this.data1.length != 0) {
          this.data1.forEach((item, index) => {
            if (!item.group) {
              stepflag_2 = true;
              return;
            }
          });
          if (stepflag_2) {
            this.currentStep == 1;
            this.$Message.warning({
              content: "Choose group for each operation.",
              duration: 5,
              background: true,
              closable: true
            });
            return;
          }
        } else {
          this.$Message.warning({
            content: "Drag these operations to the table below.",
            duration: 5,
            background: true,
            closable: true
          });
          return;
        }
      }

      if (this.currentStep == 3) {
        // this.currentStep = 0;
        return;
      }

      this.currentStep += 1;
    },
    initData(){
      this.loading = true;
      getUserAllNeCfgs().then((response) => {
          console.log(response);
          this.loading = false;
          if (response.isSuccess == true){
            this.neList = response.neCfgs;
            for (let key in response.neGroups) {
              let tmpGroupMap = {title: key, id: response.neGroupsNameIdMap[key], closable: false, showAdd: false, isRename: false, neArray: []}
              this.neGroupIdMap[response.neGroupsNameIdMap[key]] = []
              this.neGroupMap[key] = []
              response.neGroups[key].forEach(item => {
                item.checked = true
                tmpGroupMap.neArray.push(
                  item
                )
                this.neGroupIdMap[response.neGroupsNameIdMap[key]].push(item.Id)
                this.neGroupMap[key].push(item.NEName)
              })
              this.groupList.push(tmpGroupMap)
            }

          } else {

          }

        }
      ).catch(error => {
        this.$Modal.error({
          title: "Error",
          content: "Netword error!"
        });
      });
    },
    btnConfirm() {
      operationConfirm(this.neGroupMap, this.data1).then(
        response => {
          if (response.isSuccess == true){
            this.$Modal.success({
              title: "Success",
              content: "Operation is runing."
            });
          }else{
            this.$Modal.error({
                title: "Error",
                content: "Error while send operations."
            });
          }

        }
      ).catch(error => {
        this.$Modal.error({
          title: "Error",
          content: "Netword error!"
        });
      });
    },

    changePage(currentPage) {
      console.log(currentPage);
      this.currentPage = currentPage;
    },
    onSelect(selection, row) {
      // console.log(selection);
      // console.log(row);
    },
    onSelectionChange(selection) {
      // console.log(selection);
      let newArray = [];
      // let newArray1 = [];
      let tmpIds = [];
      selection.forEach(item => {
        item.checked = true;
        newArray.push(item);
        // newArray1.push(item.NEName);
        tmpIds.push(item.Id)
      });
      this.selectionList = newArray;
      console.log(this.selectionList)
      // this.customSelectionList = newArray1;
      this.selectedNeIds = tmpIds;
    },
    createGroup() {
      if (this.selectionList.length == 0) {
        // alert("您需要先选择网元才能对网元进行分组。");
        this.$Message.warning({
          content:
            "You need to select the network element before you can group the network elements.",
          duration: 5,
          background: true,
          closable: true
        });
        return;
      }

      this.singleNeGroupMapX["neIdList"] = this.selectedNeIds;
      addNeGroup(this.singleNeGroupMapX).then(response => {
        if (response.isSuccess == true) {
          // let tmpGroupTitle = response.newNeGroup.GroupName
          let newNeGroup = response.newNeGroup
          this.groupList.push({
            id: newNeGroup.Id,
            title: newNeGroup.GroupName,
            neArray: this.selectionList,
            closable: false,
            showAdd: false,
            isRename: false
          });
          // data constructed by zewen 2020-05-05 12:21
          this.neGroupMap[response.newNeGroup.GroupName] = this.customSelectionList;
          this.neGroupIdMap[newNeGroup.Id] = this.selectedNeIds;
        } else {
          alert("Fail to create a group.")
        }
        // empty var
        this.singleNeGroupMapX = {}
        this.selectedNeIds = []
        this.$refs.selection.selectAll(false);
      })
      // }).catch(error => {
      //     alert("Error found while request api.")
      // })
    },
    handleStartRename(group, groupKey) {
      group.isRename = true;
      // console.log(this.$refs);

      // this.$refs.groupNameInput.$el.focus();
      let that = this;
      // let timer = setTimeout(()=>{
      //   console.log(that.$refs);
      //   that.$refs.groupNameInput[0].focus();
      //   clearTimeout(timer);
      //   // this.$refs.groupNameInput.$el.focus()
      // }, 0);

      this.$nextTick(()=>{
        this.$refs.groupNameInput[groupKey].focus();
      });
    },
    handleEnterRename(group) {
      console.log(group);
      group.isRename = false;
    },
    handleInputBlur(group){
      group.isRename = false;
      // call rename api to rename this group
      renameNeGroup(group.id, group.title).then(response => {
        if (response.isSuccess == false) {
          this.$Modal.error({
            title: "Error",
            content: "Fail to rename this group!"
          });
        }
      }).catch(error => {
        this.$Modal.error({
          title: "Error",
          content: "Fail to rename this group!"
        });
      })
    },
    delGroup(index, groupId, groupName) {
      // alert(index)
      deleteNeGroup(groupId).then(response => {
         if (response.isSuccess == true) {
           this.$Modal.success({
             title: "Success",
             content: "Success to delete group: " + groupName + " !"
           });
           this.groupList.splice(index, 1);
         } else {
           this.$Modal.error({
             title: "Error",
             content: "Fail to delete this group!"
           });
         }
      })

    },
    editGroup(group) {
      // group.closable = true;
      if (group.closable) group.closable = false;
      else group.closable = true;
      // console.log(group);
    },
    outsideEventHandler(e, group){
      if (group.closable) group.closable = false;
    },
    handleClickAddTag(group) {
      // console.log(group);

      // this.checkedNeList = this.neList;
      let newNeList = JSON.parse(JSON.stringify(this.neList));
      let newCheckedNeList = [];
      for (const key1 in newNeList) {
        let element1 = newNeList[key1];
        element1.checked = false;
        for (const key2 in group.neArray) {
          let element2 = group.neArray[key2];
          if (element1.NEName == element2.NEName) {
            element1.checked = true;
          }
        }
        newCheckedNeList.push(element1);
      }
      this.checkedNeList = newCheckedNeList;
      console.log(JSON.parse(JSON.stringify(this.checkedNeList)));

      if (group.showAdd) {
        group.showAdd = false;
      } else {
        group.showAdd = true;
      }
      // console.log(group);
      return;
    },
    handleClickTagClose(neArray, index, neId, groupId) {
      // neArray = JSON.parse(JSON.stringify(neArray));
      // console.log(neArray, index, neItem, groupId);
      // call api to remove ne from group
      deleteNeFromGroup(groupId, neId).then(response => {
        if (response.isSuccess == true) {
          neArray.splice(index, 1);
        } else {
          this.$Modal.error({
            title: "Error",
            content: "Fail to delete ne from group!"
          })
        }
      }).catch(error => {
        this.$Modal.error({
          title: "Error",
          content: "Fail to delete ne from group!"
        })
      })

    },
    handleCheckChange(checked, name, item, neArray, groupId) {
      console.log(checked, name, item, neArray, groupId);
      let flag = true;
      neArray.forEach(element => {
        if(element.NEName == item.NEName){
          flag = false;
        }
      });
      // call api to add ne into group
      addNeIntoGroup(groupId, item.Id).then(response => {
        if (response.isSuccess == true) {
          item.checked = checked;

          if (flag && checked) {
            neArray.push(item);
          }
        }else{
          this.$Modal.error({
            title: "Error",
            content: "Fail to add ne into group!"
          })
        }
      }).catch(error => {
        this.$Modal.error({
          title: "Error",
          content: "Fail to add ne into group!"
        })
      })

    },
    dragStart(event, index) {
      console.log("dragStart: " + index);
      this.showRedDrag = true;
      event.dataTransfer.setData("Text", index);
    },
    allowDrop($event) {
      // $event.preventDefault();
    },
    drop($event) {
      $event.preventDefault();
      console.log($event.dataTransfer);

      var index = $event.dataTransfer.getData("Text");
      if (index && !isNaN(Number(index))) {
        this.showRedDrag = false;
        this.data1.push({
          group: this.groupList[0].title,
          operation: this.operationList[index].text,
          loop: 1,
          trafficmonitor: false,
          showSelect: false
        });
      } else {
      }
    },
    onDragDrop(index1, index2) {
      if (index1 != "") {
        console.log(index1, index2);
        // var temp = JSON.parse(JSON.stringify(this.data1[index1]));
        // var dataIndex2 = JSON.parse(JSON.stringify(this.data1[index2]));
        // this.data1[index1] = dataIndex2;
        // this.data1[index2] = temp;

        var data1 = JSON.parse(JSON.stringify(this.data1));
        var temp = data1[index1];
        var dataIndex2 = data1[index2];
        data1[index1] = dataIndex2;
        data1[index2] = temp;
        this.data1 = data1;
        data1 = null;
      }
    },
    showView(index) {
      this.$Modal.info({
        title: "Operation Info",
        content: `operation: ${this.data1[index].operation}<br>loop: ${this.data1[index].loop}<br>trafficmonitor: ${this.data1[index].trafficmonitor}`
      });
    },
    remove(index) {
      this.data1.splice(index, 1);
    },
    selectChangeGroup(selected, index) {
      console.log(selected);
      console.log(index);
      this.data1[index].group = selected;
    },
    onDragDrop(index1, index2) {
      if (index1 != "") {
        // console.log(index1, index2);

        var data1 = JSON.parse(JSON.stringify(this.data1));
        var temp = data1[index1];
        var dataIndex2 = data1[index2];
        data1[index1] = dataIndex2;
        data1[index2] = temp;
        this.data1 = data1;
      }
    }
  },
  computed: {
    currentNeList: function() {
      let start = this.currentPage * 5 - 5;
      let end = this.currentPage * 5;

      return this.neList.slice(start, end);
    },
    isMargintop0() {
      if (this.data1.length == 0) {
        return false;
      } else {
        return true;
      }
    },
    selectedNelist: function() {
      var selectedNelist = [];
      // 因为 selectedNelist 可能会有重复的网元 在对网元进行分组的时候 需要先把 groupList 转换成普通的js对象
      var groupList = JSON.parse(JSON.stringify(this.groupList));
      groupList.forEach(function(group, index) {
        var neArray = group.neArray;
        let groupName = group.title;
        for (const key in neArray) {
          if (neArray.hasOwnProperty(key)) {
            const element = neArray[key];
            element.group = groupName;
            console.log(element);
            selectedNelist.push(element);
          }
        }
      });
      return selectedNelist;
    }
  },
  watch: {},
  components: {},
  directives: {
    MergeCell,
    clickoutside
  },
  filters: {
    formattime: function(time){
        // format("Thu Aug 22 2013 15:12:00 GMT+0800", 'yyyy-MM-dd HH:mm:ss');
        var format = "MM/dd-HH:mm"; // 05/11-12:16
        var t = new Date(time);
        var tf = function(i){return (i < 10 ? '0' : '') + i};
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
            switch(a){
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        })
    },
    strSplit: function(str) {
      let newArr = str.split(",");
      if(newArr[0] == ""){
        return []
      }
      return newArr;
    }
  },
};
</script>

<style scoped lang="scss">
.ivu-table {
  overflow: initial;
}
.ivu-table-wrapper {
  overflow: initial;
}

ul.group-card {
  margin-top: 20px;
  li {
    float: left;
    width: 50%;
    height: 16px;
    // padding-left: 15%;
    border-right: 1px solid #e9e9e9;

    img {
      display: block;
      margin: 0 auto;
      cursor: pointer;
    }
  }
  li:last-of-type {
    border-right: none;
  }
}

ul.tools {
  margin-top: 20px;

  li {
    float: left;
    width: 20%;
    margin-bottom: 30px;

    img {
      display: block;
      margin: 0 auto;
    }

    p {
      text-align: center;
      color: #1890ff;
      font-weight: 400;
    }
  }
}

.red-border {
  position: absolute;
  z-index: 10000;
  margin-top: -48px;
  width: 100%;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border: 1px solid red;
  background: #fff;
}
.margin-top-0px {
  margin-top: 0;
}
</style>
