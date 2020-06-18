<template>
    <div class="table-expand">
        <!-- expand-row -->
        <Row class="expand-row">
            <Col span="24">
                <div class="expand-key">
                    <p ref="desc_wrapper" class="desc_wrapper" :class="{ ellipsis: ellipsisCondition && isEllipsis  }" 
                        v-html="row.description">
                    </p>
                    <div v-show="ellipsisCondition">
                        <span class="desc_wrapper_more"
                            v-show="isEllipsis == true"
                            @click="showMoreDesc(false)">
                            more
                        </span>
                        <span class="desc_wrapper_more"
                            v-show="isEllipsis == false"
                            @click="showMoreDesc(true)">
                            less
                        </span>
                    </div>

                    <div v-if="typeof releatedUser[0] == 'object'" class="recommend-box" :class="{ slideAnimate: showBox }">
                        <div class="box-position-relative">
                            <!-- show arrow -->
                            <div class="show-recommend-box"
                            @click="showRecommendBox">
                                <img src="@/assets/images/icon-show-recommend.png">
                            </div>
                            <!-- header -->
                            <div class="recommend-header clearfix">
                                <div class="header-left">{{ row.key }}</div>
                                <div class="header-right">
                                    <img src="@/assets/images/icon-order.png">
                                    <span class="order">Order</span>
                                </div>
                            </div>
                            <!-- content -->
                            <div class="recommend-content">
                                <CheckboxGroup
                                    v-model="recommendCheckGroup"
                                    @on-change="CheckboxChange">
                                    <div class="recommend-item" 
                                        v-for="(item, index) in releatedUser" :key="index">
                                        <div class="item-number">{{index + 1}}</div>
                                        <!-- <div class="item-right" :title="item.displayName + ' Open Issues(' + item.openMR +')'"> -->
                                        <div class="item-right">
                                            <span class="name"> {{ item.displayName }} </span>
                                            <!-- <span class="open">Open Issues({{ item.openMR }})</span> -->
                                            <Checkbox v-show="$route.query.filter === 'I\'m Assignee'" class="recommand-check"
                                                :label="item.emailAddress">
                                            </Checkbox>
                                            <span v-show="$route.query.filter === 'I\'m Reporter' || $route.query.filter === 'I\'m Manager'" class="assign" 
                                                @click="showAssignModal(item)">
                                                Assign
                                            </span>
                                        </div>
                                    </div>
                                </CheckboxGroup>
                            </div>
                            <!-- more arrow -->
                            <div class="recommend-more">
                                <span class="more-btn"  
                                    v-if="row.releatedUser.length > 3" 
                                    @click="showMoreRecommend">
                                    <img :class="{isMore: !flag}" src="@/assets/images/icon-more-arrow.png">
                                    <span v-show="!flag" class="txt">MORE</span>
                                    <span v-show="flag" class="txt">LESS</span>
                                </span>
                                <span v-show="$route.query.filter === 'I\'m Assignee'" class="recommend-btn recommendActive"
                                    :class="{recommendBtnActive: isRecommendBtnActive}"
                                    @click="showRecommendModal">
                                    Recommend
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </Col>
            <Col span="24">
                <div class="expand_footer">
                    <!-- labels -->
                    <div v-if="row.labels" class="labels">
                        <Tag v-for="(label, index) in row.labels" :key="index">{{label}}</Tag>
                    </div>
                    <!-- links button -->
                    <div class="link_btn clearfix">
                        <a class="right similar-btn"
                            v-if="hasSimilar"
                            @click="goSec2">
                            <img src="@/assets/images/headline-related.png" alt="">
                            <span class="txt">Similar</span>
                        </a>
                        <a class="right tojira-btn" :href="httppath + row.key" target="_balnk">
                            <img src="@/assets/images/jira-icon.png" alt="">
                        </a>
                        <Button class="assign-btn" type="primary"
                            v-if="hasAssigntome"
                            @click="funcAssignToMe">
                            Assign to me
                        </Button>
                    </div>
                </div>
            </Col>
        </Row>
        <!-- expand-row end -->
        <!-- assignModal -->
        <Modal
            v-model="assignModal"
            :title="Title"
            :loading="assignLoading"
            @on-ok="assignAsyncOK"
            ok-text="Assign"
            cancel-text>
            <!-- <p>After you click ok, the dialog box will close in 2 seconds.</p> -->
            <textarea name="" id="" cols="30" rows="10" placeholder="Comments..."
                v-model="assignComments">
            </textarea>
        </Modal>
        <!-- Recommend people to resolve -->
        <Modal
            v-model="recommendModal"
            :loading="recommendLoading"
            @on-ok="recommendAsyncOK"
            ok-text="Send"
            cancel-text>
            <div slot="header" class="modal-header">
                <p>Recommend these following people to resolve {{ row.key }}</p>
                <ul class="person clearfix">
                    <li
                        v-for="user in recommendList" :key="user.emailAddress">
                        <img src="@/assets/images/icon-person.png" alt="">
                        <span>{{ user.displayName }}</span>
                    </li>
                </ul>
            </div>
            <textarea 
                name="" id="" cols="30" rows="10" placeholder="Comments..."
                v-model="recommendComments">
            </textarea>
        </Modal>
    </div>
</template>
<script>
    import { getCookie } from '@/utils/auth.js';
    import { assigneMR, recomendMR } from '@/request/api.js';

    export default {
        props: {
            row: Object,
            // showBox: Boolean
        },
        data () {
            return {
                href: '',
                httppath: 'https://optics-jira.int.net.nokia.com/browse/',
                flag: false,
                showBox: false,
                // recommendModal
                assignModal: false,
                assignLoading: true,
                Title: '',

                // recommendModal
                recommendModal: false,
                recommendLoading: true,

                // jsx render test
                items: [
                    {name: 123},
                    {name: 456},
                    {name: 789},
                ],

                // 给 desc_wrapper 设置超出省略的 flag
                ellipsisCondition: false,
                isEllipsis: true,
                // recommendList
                recommendCheckGroup: [],
                recommendList: [],
                isRecommendBtnActive: false,

                recommendComments: '',  // assignee进行recommend时的comments
                assignComments: '',     // reorter进行asign时候的comments
                assignedName:'',      // 被assign的用户名

                hasSimilar: false,
                hasAssigntome: false,
            }
        },
        created () {
            this.showSimilarAndAssignBtn();
            this.$Message.config({  //全局配置message
                duration: 5
            })
        },
        mounted () {

            this.hasMoreAndLessCondition();

            this.slideFunc();   //自动滑出

        },
        methods:{
            showSimilarAndAssignBtn(){
                let filter = this.$route.query.filter;
                if(this.row.labels && this.row.labels.length!=0){
                    this.hasSimilar = true;
                }
                if(filter == 'I\'m Assignee' || filter == 'I\'m Reporter' || filter == 'I\'m Manager'){
                    this.hasAssigntome = true;
                } else {
                    this.hasAssigntome = false;
                }
            },
            goSec2(){
                // similar pushState 
                let query = this.$route.query;
                let currentActiveName = query.currentActiveName;
                let section = query.section;
                if(section == 'SearchSimilar'){
                    section = 'SearchSimilar';
                } else {
                    section = 'section2';
                }
                let filter = query.filter;
                let searchUrl = query.searchUrl;
                this.$router.push({ 
                    path: '/', 
                    query: { 
                        currentTabComponent: 'filters',
                        currentActiveName: currentActiveName,
                        section: section, 
                        filter: filter,
                        searchUrl: searchUrl,
                        key: this.row.key, 
                        count: 50
                    } 
                })
            },
            /**
             * The condition of the more-less of class .ellipsis
             */
            hasMoreAndLessCondition(){
                let p = this.$refs.desc_wrapper;
                if(!p){
                    return;
                }
                p = window.getComputedStyle(p).height;
                p = parseInt(p.substring(0, p.length-2));
                if ( p>210 ) {
                    this.ellipsisCondition = true;
                } else {
                    this.ellipsisCondition = false;
                }

            },
            showMoreDesc(flag){
                this.isEllipsis = flag;
            },
            showMoreRecommend(){
                // more button
                if( this.flag ) {
                    this.flag = false;
                } else {
                    this.flag = true;
                }
            },
            showRecommendBox(){
                if( this.showBox ) {
                    this.showBox = false;
                } else {
                    this.showBox = true;
                }
            },
            slideFunc(){
                // 自动滑出
                setTimeout(() => {
                    this.showBox = true;
                },500)
            },
            showAssignModal(user){
                console.log(user);
                // 用于被assign的用户名
                this.assignedName = user.name;
                // 用于modal的title
                this.Title = "Assign " + this.row.key + " to " +  user.displayName;
                this.assignModal = true;
            },
            assignAsyncOK(){
                let assigner =  getCookie('username');
                let comment = assigner + " assigned " + this.row.key + " to " + this.assignedName + '.';
                let option = {
                    key: this.row.key,
                    assinger: this.assignedName,
                    comment: this.assignComments || comment
                }
                console.log(option);
                
                assigneMR(option).then((result) => {
                    console.log(result);
                    this.assignModal = false;

                    if(result.data.isSuccess){
                        this.$Message.success('You have successfully assigned '+this.row.key+' to '+ this.assignedName +'.');
                    }else{
                        this.$Message.error('Failed to assign '+this.row.key+' '+ this.assignedName +'.');
                    }

                }).catch((err) => {
                    console.log(err);
                    this.assignModal = false;
                    this.$Message.error('Failed to assign '+this.row.key+' '+ this.assignedName +'.');
                    
                });

                return;
                setTimeout(() => {
                    this.assignModal = false;
                }, 2000);
            },
            showRecommendModal(){
                if(!this.isRecommendBtnActive){
                    return;
                }
                this.recommendModal = true;
            },
            recommendAsyncOK(){
                console.log(this.recommendComments);

                let recomender = [];
                let person = "";

                this.recommendList.forEach(item => {
                    recomender.push(item.name);
                    person += item.displayName;
                });
                let assigner =  getCookie('username');

                let comment = assigner + " recommended assigning the task to " + person;

                let option = {
                    "key":this.row.key,
                    "recomender":recomender,
                    "comment":this.recommendComments || comment
                }
                
                recomendMR(option).then((result) => {
                    console.log(result);
                    this.recommendModal = false;
                    if(result.data.isSuccess){
                        this.$Message.success('You have successfully sent the recommendation email.');
                    } else {
                        this.$Message.error('Recommended mail delivery failed.');
                    }
                }).catch((err) => {
                    console.log(err);
                    this.recommendModal = false;
                    this.$Message.error('Recommended mail delivery failed.');
                    
                });
                return;
                setTimeout(() => {
                    this.recommendModal = false;
                }, 2000);
            },
            /**
             * 监听复选框CheckBox
             */
            CheckboxChange(array){
                console.log(array);
                if(array.length){
                    this.isRecommendBtnActive = true;
                } else {
                    this.isRecommendBtnActive = false;

                }
                let newArray = [];
                this.row.releatedUser.forEach((user) => {
                    this.recommendCheckGroup.forEach(ele => {
                        if(user.emailAddress == ele){
                            newArray.push(user);
                        }

                    })
                })
                this.recommendList = newArray;
            },
            funcAssignToMe(){
                let assinger = getCookie('username');
                let comment = assinger + " assigned " + this.row.key + " to " + assinger + '.';
                let option = {
                    key: this.row.key,
                    assinger: assinger,
                    comment: this.assignComments || comment
                }
                console.log(option);
                
                assigneMR(option).then((result) => {
                    console.log(result);
                    this.assignModal = false;
                    if(result.data.isSuccess == true){
                        this.$Message.success('You have successfully '+this.row.key+' tasks to yourself.');

                    } else {
                        this.$Message.error('Assign failure.');
                    }

                }).catch((err) => {
                    console.log(err);
                    this.assignModal = false;
                    this.$Message.error('Assign failure.');
                    
                });
            }
        },
        computed: {
            releatedUser: function(){
                // compute props row.releatedUser
                if( this.row.releatedUser ){
                    if( this.row.releatedUser.length > 3){
                        if( this.flag ) {
                            return this.row.releatedUser;
                        } else {
                            return this.row.releatedUser.slice(0,3);
                        }
                    } else {
                        return this.row.releatedUser;
                    }
                } else {
                    return [];
                }
            },
            
        }
    };
</script>

<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
    
    .desc_wrapper{
        white-space: pre-wrap;
        /* word-break: break-all; */
        line-height: 21px;

    }
    .desc_wrapper_more{
        cursor: pointer;
        color: #2d8cf0;
    }

    .ellipsis{
        /* 给 desc_wrapper 设置超出10行显示省略号 */
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 10;
    }
    
    .tojira-btn{
        display: inline-block;
        height:27px;
        border-radius:4px;
        border:1px solid rgba(32,80,129,1);
        vertical-align: middle;
    }
    .tojira-btn img{
        margin: 4px 12px;
        height: 16px;
        vertical-align: middle;
    }

    .similar-btn{
        padding: 4px;
        margin-left: 20px;
        display: inline-block;
        vertical-align: middle;
        height:27px;
        line-height: 20px;
        background:rgba(255,255,255,1);
        border-radius:4px;
        border:1px solid rgba(82,196,26,1);
    }
    .similar-btn img {
        height: 18px;
    }
    .similar-btn .txt{
        font-size:14px;
        font-weight:400;
        color:rgba(82,196,26,1);
    }

    .expand_footer{
        padding-top: 20px;
    }
    .expand_footer .labels{
        float: left;
        margin-bottom: 16px;
    }
    .expand_footer .link_btn{
        float: right;
        margin-bottom: 16px;
    }

    .assign-btn{
        margin-right: 20px;
        line-height: 1.1;
    }

    /* recommend-box */
    .expand-key{
        position: relative;
    }
    @media screen and (max-width: 1200px) {
        .recommend-box{
            position: absolute;
            top: 0px;
            right: -412px;
            width:329px;
            padding: 9px;
            background:rgba(255,255,255, 1);
            box-shadow:0px 2px 4px 0px rgba(150,150,150,0.42);
            border-radius:6px;
            z-index: 1000;
        }
    }
    @media screen and (min-width: 1200px) {
        .recommend-box{
            position: absolute;
            top: 0px;
            right: -412px;
            width:329px;
            padding: 9px;
            background:rgba(255,255,255, 1);
            box-shadow:0px 2px 4px 0px rgba(150,150,150,0.42);
            border-radius:6px;
            z-index: 1000;
        }
    }
    @media screen and (min-width: 1300px) {
        .recommend-box{
            position: absolute;
            top: 0px;
            right: -414px;
            width:329px;
            padding: 9px;
            background:rgba(255,255,255, 1);
            box-shadow:0px 2px 4px 0px rgba(150,150,150,0.42);
            border-radius:6px;
            z-index: 1000;
        }
    }
    @media screen and (min-width: 1400px) {
        .recommend-box{
            position: absolute;
            top: 0px;
            right: -416px;
            width:329px;
            padding: 9px;
            background:rgba(255,255,255, 1);
            box-shadow:0px 2px 4px 0px rgba(150,150,150,0.42);
            border-radius:6px;
            z-index: 1000;
        }
    }
    @media screen and (min-width: 1400px) {
        .recommend-box{
            position: absolute;
            top: 0px;
            right: -418px;
            width:329px;
            padding: 9px;
            background:rgba(255,255,255, 1);
            box-shadow:0px 2px 4px 0px rgba(150,150,150,0.42);
            border-radius:6px;
            z-index: 1000;
        }
    }
    @media screen and (min-width: 1500px) {
        .recommend-box{
            position: absolute;
            top: 0px;
            right: -420px;
            width:329px;
            padding: 9px;
            background:rgba(255,255,255, 1);
            box-shadow:0px 2px 4px 0px rgba(150,150,150,0.42);
            border-radius:6px;
            z-index: 1000;
        }
    }
    @media screen and (min-width: 1700px) {
        .recommend-box{
            position: absolute;
            top: 0px;
            right: -422px;
            width:329px;
            padding: 9px;
            background:rgba(255,255,255, 1);
            box-shadow:0px 2px 4px 0px rgba(150,150,150,0.42);
            border-radius:6px;
            z-index: 1000;
        }
    }
    @media screen and (min-width: 1800px) {
        .recommend-box{
            position: absolute;
            top: 0px;
            right: -425px;
            width:329px;
            padding: 9px;
            background:rgba(255,255,255, 1);
            box-shadow:0px 2px 4px 0px rgba(150,150,150,0.42);
            border-radius:6px;
            z-index: 1000;
        }
    }
    .slideAnimate{
        transform: translateX(-330px);
        transition: 1.5s;
    }
    .recommend-header{

    }
    .header-left{
        float: left;
        font-size:14px;
        font-family:'Headline bold';
        color:rgba(101,101,101,1);
    }
    .header-right{
        float: right;
    }
    .header-right .order{
        color:rgba(101,101,101,1);
    }
    .header-right img{
        margin-top: 3px;
        margin-right: 2px;
    }
    .recommend-content{
        margin-top: 20px;
    }
    .box-position-relative{
        position: relative;
    }
    .show-recommend-box{
        position: absolute;
        top: 50%;
        left: -24px;
        margin-top: -15px;
        width: 15px;
        height: 30px;
        border-radius: 100px 0 0 100px;
        z-index: 0;
        background-color: #fff;
        box-shadow:-1px 1px 2px 0px rgba(150,150,150,0.42);
        cursor: pointer;
    }
    .show-recommend-box img{
        margin-top: 7px;
        transform: rotate(-90deg);
    }

    .recommend-item{
        margin-bottom: 11px;
        height: 20px;
        line-height: 20px;
    }
    .item-number{
        float: left;
        font-family: "Headline bold";
        color:rgba(101,101,101,1);
    }
    .item-right{
        margin-left: 20px;
        padding-left: 6px;
        height: 20px;
        color: white;
        background:linear-gradient(270deg,rgba(147,147,147,0) 0%,rgba(145,145,145,1) 100%);
    }
    .recommend-item:nth-child(1) .item-right {
        background:linear-gradient(270deg,rgba(248,109,105,0) 0%,rgba(197,86,81,1) 100%);

    }
    .recommend-item:nth-child(2) .item-right{
        background:linear-gradient(270deg,rgba(36,150,82,0) 0%,rgba(36,151,82,1) 100%);
    }
    .recommend-item:nth-child(3) .item-right{
        background:linear-gradient(270deg,rgba(249,167,40,0) 0%,rgba(248,167,40,1) 100%);
    }
    .item-right .name{
        display: inline-block;
        max-width: 100px;
        height: 20px;
        overflow:hidden;
        word-break: break-all;
        text-overflow:ellipsis;
        /* display:-webkit-box; */
        -webkit-line-clamp:1;
        -webkit-box-orient:vertical;
    }
    .item-right .open{
        margin-left: 14px;
        font-size: 12px;
        display: inline-block;
        overflow:hidden;
        height: 20px;
    }

    .recommand-check{
        float: right;
        margin-right: 0px;
    }
    .item-right .assign{
        float: right;
        color: #4a90e2;
        cursor: pointer;
    }

    .recommend-more{
        /* text-align: center; */
        font-size:14px;
        font-family: "Headline regular";
        color:rgba(74,144,226,1);
    }
    .recommend-more .more-btn{
        margin-left: 130px;
        cursor: pointer;
    }
    .recommend-more img{
        margin-top: 3px;
    }
    .recommend-more .isMore{
        transform: rotate(180deg);
    }
    .recommend-more .txt{
        margin-left: 4px;
    }
    .recommend-btn{
        float: right;
        margin-top: 1px;
        font-size:12px;
        color: #999;
    }
    .recommendBtnActive{
        color: #4a90e2;
        cursor: pointer;
    }


    /* assignModel */
    textarea{
        width: 100%;
        resize: none;
        border: none;
        font-size: 14px;
    }

    .modal-header{
        line-height: 34px;
    }
    .modal-header ul.person>li{
        float: left;
        margin-right: 46px;
    }
    .modal-header img{
        margin-right: 12px;
        width: 34px;
        height: 34px;
    }
</style>