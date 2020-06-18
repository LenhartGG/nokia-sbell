<template>
  <div class="filters">

        <!-- headline_breadcrup start -->
        <div class="headline_breadcrup">
            <Breadcrumb class="bread">
                <BreadcrumbItem v-if="firstbread" >{{firstbread}}</BreadcrumbItem>
                <BreadcrumbItem v-if="secondbread" :to="tofilter">{{secondbread}}</BreadcrumbItem>
                <BreadcrumbItem v-if="thirdbread||open">{{thirdbread}}</BreadcrumbItem>
            </Breadcrumb>
        </div>
        
        <!-- white_box start -->
        <div class="white_box">
            <div class="header clearfix">
            <div class="title">{{headline_title}}</div>

            <!-- <div v-show="false" class="search">
                <Select v-model="model10" multiple style="width:260px">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div> -->

            <div class="chart-entry" v-show="isSec2" @click="pushStateToSec3">
                <img src="@/assets/images/related.png" />
                <span class="txt">Labels Relationship Chart</span>
            </div>
            </div>
            <!-- section1 -->
            <div v-show="isSec1" class="section1">
            <!-- jira table -->
            <Table 
                :highlight-row="true"
                :border="false" 
                :data="tableData1" 
                :columns="tableColumns1" 
                :stripe="false"
                :loading="loading"
                @on-expand="onExpand">
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :page-size="pageSize" :current="currentpage" @on-change="changePage"></Page>
                </div>
            </div>
            </div>
            <!-- section2 -->
            <div v-show="isSec2" class="section2">
            <Table 
                :highlight-row="false"
                :border="false" 
                :data="tableData2" 
                :show-header="false"
                :columns="tableColumns2" 
                :stripe="false"
                :loading="loading2">
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total2" :page-size="pageSize2" :current="currentpage2" @on-change="changePage2"></Page>
                </div>
            </div>
            </div>
            <!-- section3 -->
            <div v-show="isSec3" class="section3">
            <relatedChart
                v-bind:chartlist='relatedChartList'
                v-bind:loading='isRelatedLoading'
                ref="relatedChart">
            </relatedChart>
            </div>

        </div>
  </div>
</template>

<script>

import Header from "@/components/header";
import Menu from "@/components/menu";
import expandRow from '@/components/table-expand.vue';
import relatedChart from '@/components/chart.vue';

import { setBGColorForBody } from "@/utils/tool.js";
import { getjirafilterdata, newAssigneeToMe, newReportedByMe,newOpenMRForManager, mrByMR, getJiraData, addWatch, deleteWatch } from '@/request/api.js';

export default {
  name: "filters",
  data() {
    return {
        // filterData
        filterData: [], // from api getjirafilterdata
        tofilter:{},
        // section
        httppath: 'https://optics-jira.int.net.nokia.com/browse/',
        isSec1: false,
        isSec2: false,
        isSec3: false,
        firstbread: '',
        secondbread: '',
        thirdbread: '',
        open: '',
        headline_title: '',
        cityList: [
            {
                value: 'New York',
                label: 'New York'
            },
            {
                value: 'London',
                label: 'London'
            },
            {
                value: 'Sydney',
                label: 'Sydney'
            },
            {
                value: 'Ottawa',
                label: 'Ottawa'
            },
            {
                value: 'Paris',
                label: 'Paris'
            },
            {
                value: 'Canberra',
                label: 'Canberra'
            }
        ],
        model10: [],
        // table1
        loading: false,
        tableData1: [],
        tableColumnsChecked: ['key', 'priority', 'summary', 'status', 'created', 'reporter', 'assignee', 'go'],
        tableColumns1: [],
        // page1
        total: 0,           //总数
        pageSize: 50,       //页数
        currentpage: 1,     //当前页码
        // table2
        loading2: false,
        tableData2: [],
        tableColumns2: [],
        // page2
        total2: 0,           //总数
        pageSize2: 50,       //页数
        currentpage2: 1,     //当前页码
        // section3 relatedChart
        isRelatedLoading: false,
        relatedChartList: []
    };
  },
  components: { Header, Menu, expandRow, relatedChart },
  created() {
    setBGColorForBody('#2E323F');
    this.initPage();
    this.getjirafilterdata(); //请求Menu的数据
  },
  mounted() { },
  methods: {
    initPage(){ // 初始化table1
        this.setTableColumns1();
        this.setTableColumns2();
        console.log('Start initializing the table');
        // console.log(this.$route);

        // issues
        let query = this.$route.query;
        let currentTabComponent = query.currentTabComponent;
        let section = query.section;
        let filter = query.filter;
        let searchUrl = query.searchUrl;
        let page =  query.page;
        let fieldName = query.fieldName;
        let order = query.order;
        
        // mybymr
        let key =  this.$route.query.key;
        let count =  this.$route.query.count;

        this.switchSection({
            currentTabComponent: currentTabComponent,   // currentTabComponent homepage new-mrs filters 
            section: section,                           //section1 section2 section3
            page: page,    //section1 分页器的页码
            // section1
            filter: filter,
            searchUrl: searchUrl,
            fieldName: fieldName,
            order: order,
            // section2 section3
            key: key,
            count: count
        })
            
    },
    getjirafilterdata(){
      let self = this;
      getjirafilterdata()
        .then(result => {
          if (!result.data) {
            
            this.filterData = [];
            return
          }
          console.log(result);
          this.filterData = result.data.filterArray;
          this.setBread();
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 设置bread
    setBread(){
      let query = this.$route.query;
      let currentActiveName = query.currentActiveName;
      let section = query.section;
      let filter = query.filter;
      let curTicket = query.key;
      let open = query.open;
      let setSecondBread = () => {

        if(!filter && this.filterData==[]){
          return;
        }
        this.filterData.forEach((ele, index) => {
          if (filter == ele.name && index < 3 && index < 9) {
            this.firstbread = 'Unassigned MR';
            
            if(open){
              this.secondbread = filter + "("+ open +")";
            } else {
              this.secondbread = filter;
            }
            this.tofilter = {
              path: '/',
              query: {
                currentTabComponent: 'filters',
                currentActiveName: currentActiveName,   // menu currentActiveName 1-2 
                section: 'section1', 
                filter: ele.name, 
                page:1, 
                searchUrl: ele.searchUrl
              }
            }
          } else if (filter == ele.name && index >= 3 && index < 9) {
            this.firstbread = 'RELEVANT TO ME';
            
            if(open){
              this.secondbread = filter + "("+ open +")";
            } else {
              this.secondbread = filter;
            }
            this.tofilter = {
              path: '/',
              query: {
                currentTabComponent: 'filters',
                currentActiveName: currentActiveName,   // menu currentActiveName 1-2 
                section: 'section1', 
                filter: ele.name, 
                page:1, 
                searchUrl: ele.searchUrl
              }
            }
          } else if (filter == ele.name && index >= 9) {
            this.firstbread = 'FAVOURITE FILTERS';
            
            if(open){
              this.secondbread = filter + " ("+ open +" )";
            } else {
              this.secondbread = filter;
            }
            this.tofilter = {
              path: '/',
              query: {
                currentTabComponent: 'filters',
                currentActiveName: currentActiveName,   // menu currentActiveName 1-2 
                section: 'section1', 
                filter: ele.name, 
                page:1, 
                searchUrl: ele.searchUrl
              }
            }
          }
        }); 
      };
      if ( section == 'section1' ) {
        setSecondBread()
        this.thirdbread = '';
      } else if ( section == 'section2') {
        setSecondBread()
        this.thirdbread = curTicket + ' Related Tickets';
        this.headline_title = curTicket + ' Related Tickets';
      } else if ( section == 'SearchSimilar' ) {
        this.firstbread = '';
        this.secondbread = '';
        this.thirdbread = curTicket + ' Related Tickets';
        this.headline_title = curTicket + ' Related Tickets';
        
      } else if (section == 'section3') {
        setSecondBread()
        this.thirdbread = curTicket + ' Related Tickets';
        this.headline_title = curTicket + ' Related Tickets';
      }
    },
    // 显示隐藏 section flag
    showSec(sec){
      if(sec == 'section1'){
        this.isSec1 = true;
        this.isSec2 = false;
        this.isSec3 = false;
      }
      if(sec == 'section2'){
        this.isSec1 = false;
        this.isSec2 = true;
        this.isSec3 = false;
      }
      if(sec == 'section3'){
        this.isSec1 = false;
        this.isSec2 = false;
        this.isSec3 = true;
      }
      if(sec == 'SearchSimilar'){
        this.isSec1 = false;
        this.isSec2 = true;
        this.isSec3 = false;
      }
      if(sec == 'SearchChart'){
        this.isSec1 = false;
        this.isSec2 = false;
        this.isSec3 = true;
      }
    },
    // show section3
    pushStateToSec3(){
      let query = this.$route.query;
      let section = query.section;
      if(section == 'SearchSimilar'){
        section = 'SearchChart';
      } else {
        section = 'section3';
      }

      let filter = query.filter;
      let searchUrl = query.searchUrl;

      let fieldName = query.fieldName;
      let order = query.order;

      let key = query.key;
      let count = query.count;

      this.$router.push({
        path: '/', 
        query: {
            currentTabComponent: 'filters',
            section: section, 
            
            filter: filter,
            searchUrl: searchUrl,
            fieldName: fieldName,
            order: order,

            key: key, 
            count: count 
        }
      })
    },
    showD3Chart(options){
      console.log('showD3Chart')
      // this.$refs.relatedChart.loading = false;
      let query = this.$route.query;
      let key = query.key;
      let count = parseInt(query.count);
      if(key && count > 0 && this.relatedChartList.length == 0){
        var options = { key: key, count: count };
        this.loading = true;
        mrByMR(options)
            .then((result) => {
            console.log(result.data.result);
            
              this.loading = false;
              this.$refs.relatedChart.createMap(result.data.result);            
            }).catch((err) => {
              this.$refs.relatedChart.loading = false;
              this.$refs.relatedChart.createMapModel();
            });
      }else{
        this.$refs.relatedChart.createMap(this.relatedChartList); 
      }
    },
    //切换section 1 2 3 => jiraIssues(section1) / similiar(section2) / relationchart(section3)
    switchSection(arg){
        let options;
        let section = arg.section;
        let filter = arg.filter;
        let page = arg.page;
        let searchUrl = arg.searchUrl;
        let fieldName = arg.fieldName;
        let order = arg.order;

        let key = arg.key;
        let count = arg.count;
        
        let sortBy = {};
        if (fieldName && order) {
          sortBy = { fieldName: fieldName, order: order };
        }
        console.log('section--------:', section);
        
        /**
         * section
         * section1       点击左侧边栏触发 filter-table
         * section2       点击 filter-table 的 similar按钮 查找相似 mr
         * section3       点击 Labels Relationship Chart 按钮 展示mr关系图chart
         * SearchSimilar  输入mr号 查找当前并找出相似mr
         * SearchChart    在 SearchSimilar 下， 点击 Labels Relationship Chart 按钮 展示mr关系图chart
         */
        switch (section) {
          case 'section1':
            this.showSec('section1');
            this.headline_title = filter;
            
            options = { "url": searchUrl, "page": page.toString(), "rows": "50", "sortBy": sortBy};
            if (filter === 'I\'m Assignee') {
                this.newAssigneeToMe(options);
            } else if (filter === 'I\'m Reporter') {
                this.newReportedByMe(options);
            }  else if (filter === 'I\'m Manager') {
                this.newOpenMRForManager(options);
            } else {
                this.getJiraData(options);
            }
            break;
          case 'section2':
            this.showSec('section2');
            options = { key: key, count: count };
            this.mrByMR(options);
            break;
          case 'section3':
            this.showSec('section3');
            options = { key: key, count: count };
            //TODO: Need SSL
            window._paq.push(["trackEvent","Filters","SearchSmiliar",options.key,options.count]);
            window._paq.push(['trackSiteSearch',options.key,"SearchSmiliar",options.count]);
            this.showD3Chart(options);
            break;
          case 'SearchSimilar':
            this.showSec('SearchSimilar');
            options = { key: key, count: count };
            this.mrByMR(options);
            break;
          case 'SearchChart':
            this.showSec('SearchChart');
            options = { key: key, count: count };
            this.mrByMR(options);
            break;
          default:
            console.log('Section1 is displayed by default');
            // this.showSec('section1');
            // this.headline_title = filter;
            // let options = { url: searchUrl, page: page, rows: 50,};
            // this.getJiraData(options);
        }
    },
    changePage(current) { // changePage 分页回调
        console.log('changePage 分页回调');
        console.log(current);
        let query = this.$route.query;
        let currentActiveName = query.currentActiveName;
        let filter = query.filter;
        let searchUrl = query.searchUrl;
        let page = current;
        let fieldName = query.fieldName;
        let order = query.order;
        this.$router.push({
            path: '/', 
            query: {
                currentTabComponent: 'filters',
                currentActiveName: currentActiveName,
                section: 'section1', 
                filter: filter, 
                page: page, 
                searchUrl: searchUrl,
                // 排序
                fieldName: fieldName,
                order: order
            }
        });
        return;
    },
    setTableColumns1(){
        //set color for status
        let getStatusColor = (status) => {
          let color  = '';
          if (status) {
            if (status == 'New' ||
                status == 'Open' ) {
                color = 'blue';
            } else if (status == 'Closed'    ||
                status == 'COMMITTED' ||
                status == 'WITHDRAWN' || 
                status == 'COMPLETE' || 
                status == 'FID-CLASS' || 
                status == 'REJECTED' || 
                status == 'AVAILABLE' || 
                status == 'CANCELLED' || 
                status == 'FEATURE COMPLETED' || 
                status == 'SOLUTION COMPLETED' ) {
                color = 'green';
            } else {
              color = 'warning';
            }
            return color;
          }
        };

        let table1ColumnList = {
          'expand': {
              type: 'expand',
              width: 40,
              render: (h, params) => {
                  let showBox = true;
                  return h(expandRow, {
                      props: {
                          row: params.row,
                          showBox: false,
                      }
                  })
              }
          },
          'key': {
              title: "Key",
              key: "key",
              // width: 130,
              render: (h, params) => { // <-- h must be in scope
                  let href = this.httppath + params.row.key;
                  return <a href={[href]} target="_blank">{params.row.key}</a>
              }
          },
          // 'project': {
          //     title: "Project",
          //     key: "project"
          // },
          'priority': {
              title: "Priority",
              key: "priority",
              // width: 80,
          },
          'summary': {
              title: "Summary",
              key: "summary",
              width: 300,
              // renderHeader: (h, params) => { // params {column, index}
              //     return h('div', [
              //         h('Button', {
              //                 props: {
              //                     type: 'primary',
              //                     size: 'small'
              //                 },
              //                 style: {
              //                     marginRight: '5px'
              //                 },
              //                 on: {
              //                     click: () => {
              //                         // this.show(params.index);
              //                     }
              //                 }
              //             }, 'View'),
              //     ])
              // },
              render: (h, params) => { // <-- h must be in scope
                  let href = this.httppath + params.row.key;
                  return <p class="line-clamp2"><a href={[href]} target="_blank" title={params.row.summary}>{params.row.summary}</a></p>
              }
          },
          'status': {
              title: "Status",
              key: "status",
              width: 180,
              render: (h, params) => {
                  let status = params.row.status;
                  
                  return h('div', [
                      h('Tag', {
                          props: {
                              type: 'border',
                              color: getStatusColor(status)
                          },
                          style: {
                            fontSize: '11px'
                          }
                          
                      }, status)
                  ]);
              }
          },
          'created': {
              title: "Created",
              key: "created",
              // width: 80,
              // sortable: true,
              render: (h, params) => { // <-- h must be in scope
                  let date = params.row.created;
                  date = date.substring(0, date.indexOf('T'));
                  // console.log(date);
                  return <div>{date}</div>;
              }
          },
          // 'updated': {
          //     title: "Updated",
          //     key: "updated",
          //     sortable: true
          // },
          'reporter': {
              title: "Reporter",
              key: "reporter",
              // width: 120
          },
          'assignee': {
              title: "Assignee",
              key: "assignee"
          },
          'watch': {
              title: "watch",
              key: "watch",
              width: 60,
              render: (h, params) => { // <-- h must be in scope
                  let href = this.httppath + params.row.key;
                  let isCollected = params.row.isCollected;
                  let src = '';
                  let flag = 'unwatched';
                  let watched = require("../assets/images/icon-watching2x.png");
                  let unwatched = require("../assets/images/icon-unwatching2x.png");
                  if ( isCollected ) { 
                    src = watched;
                    flag = 'watched';
                  } else { 
                    src = unwatched;
                    flag = 'unwatched';
                  }
                  return h('img', {
                        style: {
                          display: 'inline-block',
                          // position: 'absolute',
                          // right: '20px',
                          // top: '50%',
                          // marginTop: '-8px',
                          height: '16px',
                          // backgroundImage: require("../assets/images/icon-watching.png"),
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          cursor: 'pointer'
                        },
                        attrs: {
                          // javascript: "void(0)",
                          src: src
                        },
                        on: {
                          click: (event) => {
                            console.log(event);
                            
                            let option = {
                              key: params.row.key
                            }
                            
                            // console.log(option);
                            
                            if (flag == 'watched') {
                              event.target.attributes[0].nodeValue = unwatched;
                              flag = 'unwatched';
                              // return;
                              deleteWatch(option).then((result) => {
                                console.log(result);
                                
                                this.$Message.success("You successfully cancelled the watch for "+params.row.key+".")
                              }).catch((err) => {
                                console.log(err);
                                this.$Message.error("Failure to unwatch"+params.row.key+"!")
                              });
                            } else {
                              event.target.attributes[0].nodeValue = watched;
                              flag = 'watched';
                              // return;
                              addWatch(option).then((result) => {
                                console.log(result);
                                this.$Message.success("You have successfully watched "+params.row.key+".")
                              }).catch((err) => {
                                console.log(err);
                                this.$Message.error("Failure to watch"+params.row.key+"!")
                                
                              });
                            }
                            // console.log(flag);
                          }
                        }
                      })
              }
          }
          // 'go': {
          //     title: " ",
          //     key: "go",
          //     show: false,
          //     render: (h, params) => {
          //         return h('div', [
          //             h('Button', {
          //                 props: {
          //                     type: 'primary',
          //                     size: 'small'
          //                 },
          //                 style: {
          //                     marginRight: '5px'
          //                 },
          //                 on: {
          //                     click: () =>{
          //                         // this.isSwitched = !this.isSwitched;
          //                         // this.mrKey = params.row.key; 
          //                         // this.mrLoading = true;
          //                         // this.$refs.SearchList.fetchMRList(this.mrKey)
          //                     }
          //                 }
          //             }, 'Similar')
          //         ]);
          //     }
          // }
        };
        let data = [];
        let renderHeader = (h, params) => { // params {column, index}
                  let src = '';
                  let rotate = '';
                  let fieldName = this.$route.query.fieldName;
                  let order = this.$route.query.order;
                  // this.fieldName == params.column.key
                  if (fieldName && fieldName == params.column.key) {
                    if (order == "ASC") {
                      src = require("../assets/images/sort-arrow.png");
                      rotate = 'rotate(0deg)';
                    } else if (order == "DESC") {
                      src = require("../assets/images/sort-arrow.png");
                      rotate = 'rotate(180deg)';
                    }
                  } else if(fieldName && fieldName!=params.column.key) {
                    src = '';
                  }
                  return h(
                  'a', {
                    style: {
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                      color: '#5a516e'
                    },
                    on: {
                        click: () => {
                            // this.show(params.index);
                            console.log(params);
                            this.sortTable1(params.column.key);
                        }
                    }
                  }, [
                      h('span', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                      }, params.column.title),
                      h('img', {
                        attrs: {
                            src: src
                        },
                        style: {
                          width: '20px',
                          transform: rotate
                        },
                        on: {
                            click: () => {
                                // this.show(params.index);
                            }
                        }
                      }),
                  ])
              }
        for (const key in table1ColumnList) {
          if (table1ColumnList.hasOwnProperty(key)) {
            const element = table1ColumnList[key];
            if(key != 'expand' || key != 'watch'){
              element.renderHeader = renderHeader;
            }
            data.push(element);
          }
        }
        this.tableColumns1 = data;
    },
    sortTable1(fieldName){
        /**
         * 对table1进行排序
         */
        let query = this.$route.query;
        let currentActiveName = query.currentActiveName;
        let filter = query.filter;
        let searchUrl = query.searchUrl;
        let page = query.page;
        
        let order;
        
        // if(fieldName == query.fieldName && query.order){
          if (query.order == "DESC"){
            order = "ASC";
          } else {
            order = "DESC";
          }
        // }
        // order = query.order || 'ASC';
        
        
        this.$router.push({
          path: '/', 
          query: {
            currentTabComponent: 'filters',
            currentActiveName: currentActiveName,
            section: 'section1', 
            filter: filter, 
            page: page, 
            searchUrl: searchUrl,
            fieldName: fieldName, // table1 fieldName
            order: order,         // table1 order
          }
        });
    },
    /**
     * onExpand
     * 展开或收起某一行时触发
     */
    onExpand(row, status){
      console.log(row, status);
      
    },
    // getJiraData
    getJiraData(options) {
        let that = this;
        console.log('options', options)
        that.loading = true;
        
        getJiraData(options)
            .then((result) => {
                console.log('Table was successfully initialized');
                console.log("getJiraData--result--", result.data);
                if (!result.data) {
                  this.loading = false;
                  this.tableData1 = [];
                  return;
                }
                let issues = result.data.issues;
                this.total = result.data.total;


                this.setTableData(issues);
                this.loading = false;
            })
            .catch((err) => {
                this.loading = false;
                console.log(err);
            });
    },
    mrByMR(options) {
        let that = this;
        console.log('options', options)
        that.loading2 = true;
        
        mrByMR(options)
            .then((result) => {
                console.log('Table2 was successfully initialized');
                console.log("mrByMR--result--", result.data);
                // return 
                let issues = result.data.result;
                this.relatedChartList = issues;

                let data = [];
                if (issues && issues.length != 0) {
                    issues.forEach(obj => {
                        let innerObj = {};
                        Object.keys(obj).forEach((key, index) => {
                            innerObj[key] = obj[key];
                        });
                        data.push(innerObj);
                    });
                }
                data[0]['_expanded'] = true;

                this.tableData2 = data;
                this.loading2 = false;
            })
            .catch((err) => {
                this.loading2 = false;
                console.log(err);
            });
    },
    // newAssigneeToMe
    newAssigneeToMe(options) {
        let that = this;
        console.log('options', options)
        that.loading = true;
        
        newAssigneeToMe(options)
            .then((result) => {
                console.log('Table was successfully initialized');
                console.log("newAssigneeToMe--result--", result.data);
                let issues = result.data.issues;

                this.total = result.data.total;

                this.setTableData(issues);
                this.loading = false;
            })
            .catch((err) => {
                this.loading = false;
                console.log(err);
            });
    },
    // newReportedByMe
    newReportedByMe(options) {
        let that = this;
        console.log('options', options)
        that.loading = true;
        
        newReportedByMe(options)
            .then((result) => {
                console.log('Table was successfully initialized');
                console.log("newAssigneeToMe--result--", result.data);
                let issues = result.data.issues;

                this.total = result.data.total;

                this.setTableData(issues);
                this.loading = false;
            })
            .catch((err) => {
                this.loading = false;
                console.log(err);
            });
    },
    // newOpenMRForManager
    newOpenMRForManager(options) {
        let that = this;
        console.log('options', options)
        that.loading = true;
        
        newOpenMRForManager(options)
            .then((result) => {
                console.log('Table was successfully initialized');
                console.log("newOpenMRForManager--result--", result.data);
                let issues = result.data.issues;

                this.total = result.data.total;

                this.setTableData(issues);
                this.loading = false;
            })
            .catch((err) => {
                this.loading = false;
                console.log(err);
            });
    },
    setTableData(issues){
        if(issues && issues.length != 0){
            let data = [];
            issues.forEach(obj => {
                let innerObj = {};
                Object.keys(obj).forEach((key, index) => {
                    innerObj[key] = obj[key];
                });
                data.push(innerObj);
            });
            data[0]['_expanded'] = true;
            this.tableData1 = data;
        } else {
            this.tableData1 = [];
        }
    },
    setTableColumns2(){
      this.tableColumns2 = [
          {
              type: 'expand',
              width: 40,
              render: (h, params) => {
                  return h(expandRow, {
                      props: {
                          row: params.row
                      }
                  })
              }
          },
          {
              title: "Key",
              key: "key",
              // width: 130,
              render: (h, params) => { // <-- h must be in scope
                  let href = this.httppath + params.row.key;
                  let isCollected = params.row.isCollected;
                  let src = '';
                  let flag = 'unwatched';
                  let watched = require("../assets/images/icon-watching2x.png");
                  let unwatched = require("../assets/images/icon-unwatching2x.png");
                  if ( isCollected ) { 
                    src = watched;
                    flag = 'watched';
                  } else { 
                    src = unwatched;
                    flag = 'unwatched';
                  }
                  return h(
                    'div', {
                      style: {
                        position: 'relative'
                      },
                    }, [
                      h('a', {
                        attrs: {
                          href: href,
                          target: "_blank"
                        }
                      }, params.row.key),
                      h('span', {
                        style: {
                          marginLeft: '20px'
                        },
                        attrs: {
                          // href: href,
                          target: "_blank"
                        }
                      }, params.row.summary),
                      h('img', {
                        style: {
                          display: 'block',
                          position: 'absolute',
                          right: '20px',
                          top: '50%',
                          marginTop: '-8px',
                          height: '16px',
                          // backgroundImage: require("../assets/images/icon-watching.png"),
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          cursor: 'pointer'
                        },
                        attrs: {
                          // javascript: "void(0)",
                          src: src
                        },
                        on: {
                          click: (event) => {
                            console.log(event);
                            
                            let option = {
                              key: params.row.key
                            }
                            
                            console.log(option);
                            
                            if (flag == 'watched') {
                              event.target.attributes[0].nodeValue = unwatched;
                              flag = 'unwatched';
                              // return;
                              deleteWatch(option).then((result) => {
                                console.log(result);
                                
                                this.$Message.success("You successfully cancelled the watch for "+params.row.key+".")
                              }).catch((err) => {
                                console.log(err);
                                this.$Message.error("Failure to unwatch"+params.row.key+"!")
                              });
                            } else {
                              event.target.attributes[0].nodeValue = watched;
                              flag = 'watched';
                              // return;
                              addWatch(option).then((result) => {
                                console.log(result);
                                this.$Message.success("You have successfully watched "+params.row.key+".")
                              }).catch((err) => {
                                console.log(err);
                                this.$Message.error("Failure to watch"+params.row.key+"!")
                                
                              });
                            }
                            console.log(flag);
                          }
                        }
                      }),
                    ]);
              }
          }]
    },
    changePage2(current) { // changePage 分页回调

        // 暂时先return 等待后台对数据做了缓存之后，再使用分页
        return;
        console.log('changePage 分页回调');
        console.log(current);
        let query = this.$route.query;
        let filter = query.filter;
        let searchUrl = query.searchUrl;
        let page = current;
        this.$router.push({
            path: '/', 
            query: {
                currentTabComponent: 'filters',
                section: 'section2', 
                filter: filter, 
                page: page, 
                searchUrl: searchUrl
          }
        });
        return;
    },
    
  },
  computed: {},
  watch:{
     '$route' (to, from) {
            // 对路由变化作出响应...
            // alert('检测浏览器返回按钮的触发')
            console.log('检测浏览器返回按钮的触发');
            console.log('from: ', from);
            console.log('to: ', to);
            let currentTabComponent = to.query.currentTabComponent;
            let section = to.query.section;
            // issues
            let filter = to.query.filter;
            let searchUrl = to.query.searchUrl;
            let page = +to.query.page;
            let fieldName = to.query.fieldName;
            let order = to.query.order;
            // mrbymr
            let key = to.query.key;
            let count = to.query.count;

            this.setBread(); // 面包屑导航

            this.switchSection({
                currentTabComponent: currentTabComponent,
                section: section, 
                filter: filter, 
                searchUrl: searchUrl,
                page: page, 
                fieldName: fieldName,
                order: order,

                key: key,
                count: count
            })

      }
  }
};
</script>

<style scoped>
.filters{
  overflow: hidden;
}
.headline_breadcrup{
  width: 98%;
  margin-bottom: 10px;
  height: 22px;
}
.headline_breadcrup .bread{
  float: left;
  margin-left: 20px;
}

.white_box{
  margin-bottom: 40px;
  background: #fff;
  width: 98%;
  border-radius:6px;
  border: 1px solid #ccc;
  padding: 10px 10px;
}
.white_box .header{
  height: 40px;
}
.white_box .header .title{
  float: left;
  font-size:20px;
  font-family: 'Headline Bold';
  font-weight:bold;
  color:rgba(51,51,51,1);
}
.white_box .header .search{
  float: right;
}
.white_box .header .chart-entry{
  float: right;
  margin-right: 22px;
  cursor: pointer;
}
.white_box .header .chart-entry img{
  width: 30px;
}
.white_box .header .chart-entry .txt{
  margin-left: 10px;
  width:110px;
  height:30px;
  font-size:14px;
  font-family: 'Headline regular';
  font-weight:400;
  color:rgba(126,211,33,1);
  line-height:30px;
}

</style>