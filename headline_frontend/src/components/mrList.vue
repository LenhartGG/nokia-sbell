<template>
  <div class="mrList">
    <section v-show="loading" class="spin_section">
        <Spin class="spin" size="large"></Spin>
    </section>
    
    <section v-show="!loading" class="section-mr">
            <div class="section-mr-date">
                <div class="left" style="cursor:pointer"  @click="emitIsSwitched">
                    <span><img src="@/assets/images/back.png"/>Back</span>
                </div>
                <div class="right">
                    <div v-show="!isnull">
                        <img class="relation_icon" src="@/assets/images/icon-relationship.png">
                        <!-- <router-link :to="{ path: 'hard'}">Hard Chart</router-link> -->
                        <a @click="emitIsChart">Relationship Chart</a>
                        <!-- <a class="relationship_chart_entry" href="">span>Relationship Chart</span></a> -->
                    </div>
                </div>
            </div>

            <div v-show="isnull" class="align_center">Sorry, system cannot find out similar information.<br>
                This JIRA ticket has not been collected in Headline system, please try later. <br>
                Or click “Provide feedback” at the bottom to raise ticket to us, thanks.
            </div>

            <ul v-show="!isnull" id="search_content" v-for="(item,index) in list" :key="index">
                <li class="temp-li"  @click="slideToggle(item)">
                    <div class="article_item shadow">
                        <div class="article_item_top">
                            <div class="left">
                                <div class="jira">JIRA</div>
                                <div class="label"><a href="" style="cursor:pointer">{{item.key}}</a></div>
                                <div class="summary">
                                    <p>{{item.summary}}</p>
                                </div>
                            </div>
                            <div v-show="false" class="right">
                                <ul  class="article_item_options">
                                    <li><div class="article_item_img lock" @click.stop="onClickLock(item)">
                                        <img v-if="item.isLocked" src="@/assets/images/lock.png" alt=""/><img v-else src="@/assets/images//unlock.png" alt=""/>
                                      </div>
                                    </li>
                                    <li><div class="article_item_img star" @click.stop="onClickCollect(item)">
                                      <img v-if="item.isCollected" src="@/assets/images//star2.png" alt=""><img v-else src="@/assets/images//star1.png" alt=""></div>
                                    </li>
                                    <li><div class="article_item_img more_options"><img src="@/assets/images//More_Options1.png" alt=""></div></li>
                                </ul>
                            </div>
                        </div>

                        <transition name="slide">
                            <div class="article_item_center" v-if="item.show">
                                <div class="article_item_content wrapper">
                                    <div v-html="item.description"></div>
                                </div>
                            </div>
                        </transition>

                        <div class="article_item_bottom">
                            <div class="left">
                                <div class="related">
                                    <div v-show="false" class="related_txt">
                                        Be Related To
                                    </div>
                                    <ul v-show="false" class="clearfix" v-for="person in item.relatedTo" :key="person">
                                        <!-- <li><img :src="person" alt=""/></li> -->
                                    </ul>
                                    <ul v-show="false">
                                        <li><img src="@/assets/images//more-user.png" alt=""></li> 
                                    </ul>
                                    <!-- <div class="tag" v-for="element in item.labelList" :key="element.label">{{ element.label }}</div> -->
                                    <ul>
                                        <li v-for="(element,index) in item.labelList" :key="element.label">
                                            <span v-if="index < 4 || index >= item.labelList.length-4" class="tag">{{element.label}}</span>
                                            <span v-else-if="index == 4 && item.labelList.length-4 != 4" :title="parselabelTitle(item.labelList)" class="tag">. . . . . .</span>
                                            <span v-else v-show="false" class="tag"></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="right">
                                <div class="show-all">
                                    <span v-show="false" class="img-watched"><img src="@/assets/images//icon-watched.png" alt=""></span>
                                    <span v-show="false" class="number" v-if="item.viewCount > 0">{{ item.viewCount }}</span>
                                    <span v-show="false" class="number" v-else>0</span>
                                    <span class="show-all-txt" style="cursor:pointer" @click.stop="searchMRByMR(item.key)">Similiar</span>
                                    <span class="show-all-arrow"><a :href="'https://optics-jira.int.net.nokia.com/browse/'.concat(item.key)"><img src="@/assets/images//icon-arrow.png"></a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="related-tickets" v-if="list.indexOf(item) == 0">
                    <div><span class="line"></span><span class="txt">Related tickets</span><span class="line"></span></div>
                </li>
            </ul>
        </section>
  </div>
</template>

<script>
import { mrByMR } from "@/request/api.js";
import { Spin } from "iview";

export default {
    name: 'MRList',
    props : ['list','loading','isnull'],
    data() {
        return {
            
        }
    },
    methods: {
        searchMRByMR(key) {
            //通知父组件Home/index.vue search by mr
            this.$emit("similarTo",key)
        },
        desrciption_init() {
            $(".article_item_center:not(:first)").css("display","none");
        },
        slideToggle(item){
            return item.show = !item.show;
        },
        onClickLock(item){
            //TODO: 处理Lock事件
            return item.isLocked = !item.isLocked;
        },
        onClickCollect(item){
            //TODO: 处理Collect事件
            return item.isCollected = !item.isCollected;

        },
        parselabelTitle(list){
            var title = '';
            var temp = list.slice(4,list.length-4);
            temp.forEach(element => {
                if(temp.indexOf(element) != temp.length-1){
                    title=title.concat(element.label)+' , ';
                }else{
                    title=title.concat(element.label);
                }
            });
            return title;
        },
        emitIsSwitched(){
            this.$emit("back",false)
        },
        emitIsChart(){
            //先把showchart传到SearchList.vue
            this.$emit("showchart",true)
        }
    },
    components: {
        Spin
    },
    computed: {
        
    },
    watch: {

    },
    mounted(){

    },
    beforeDestroy(){
        
    }
}
</script>
<style>
/* 覆盖原生样式的loading图案大小 */
.mrList .spin_section .ivu-spin-large .ivu-spin-dot{
    width: 50px;
    height: 50px;
}
</style>
<style scoped>
img {
    vertical-align: middle;
}
/* align_center */
.align_center{
    padding-top:30px;
    font-size: 18px;
    text-align: center;
}
/* wrapper */
/* 解析文本中的空格和回车换行 */
.wrapper{
  white-space: pre-wrap;
}

/* spin_section */
.spin_section{
    width: 1000px;
    height: 800px;
    margin-top: 30px;
    border: solid #dcdee2 1px
}

/* spin */
.spin{
    width: 50px;
    position: relative;
    top: 400px;
    left: 500px;
    filter:alpha(Opacity=80);
    -moz-opacity:0.5;
    opacity: 0.5;
    z-index:100; 
    background-color:transparent;
}


/* section-mr */
.section-mr{
    /* margin-left: 180px;
    margin-right: 180px; */
    width: 1000px;
    height: 800px;
    /* background-color:blue; */
    /* padding-top: 41px; */
}
.section-mr .section-mr-date{
    /* margin-top: 50px; */
    height: 28px;
}
.section-mr .section-mr-date h4.today{
    padding: 0;
    margin: 0;
    color: RGBA(153, 153, 153, 1);
}
.section-mr .section-mr-date .datapicker{

}

.section-mr .section-mr-date .relation_icon{
    margin-top: -5px;
    width: 26px;
    /* height: 20px; */
    color: rgba(126, 211, 33, 1);
}

.section-mr .related-tickets {
    text-align: center;
    color: #808080;
    font-size: 20px;
}

.section-mr .related-tickets  .txt{
    padding: 0 10px;
}

.section-mr .related-tickets  .line{
    display: inline-block;
    width: 100px;
    height: 0px;
    /* background-color: #808080; */
    margin-bottom: 6px;
    border: 1px solid #808080;
}

/* article_item */
.article_item{
    margin: 12px 5px;
    /* border: 1px solid #ccc; */
}
.article_item_top{
    height: 60px;
    background-color: #fff;
    padding-left: 10px;
    padding-right: 20px;
    border-bottom: 1px solid #ccc;
}
.article_item_top .left .jira{
    /* display: inline-block; */
    float: left;
    height: 60px;
    line-height: 60px;
    width: 40px;
    height: 40px;
    margin-top: 10px;
    margin-bottom: 10px;
    line-height: 40px;
    text-align: center;
    background-color: RGBA(82, 188, 137, 1);
    border-radius: 50%;
    color: rgba(255, 255, 255, 1);
    
    /* 禁止文字选择高亮 */
    -webkit-user-select: none;
    /* Webkit */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* IE 10  */
    /* Currently not supported in Opera but will be soon */
    -o-user-select: none;
    user-select: none;
    /* 禁止文字选择高亮 end */
}
.article_item_top .left .label{
    float: left;
    height: 60px;
    line-height: 60px;
    margin-left: 10px;
    font-size: 20px;
    cursor: pointer;
}
.article_item_top .left .summary{
    float: left;
    height: 60px;
    line-height: 60px;
    margin-left: 10px;
    width: 600px;
    height: 24px;
    padding: 0 5px;
    color: #000;
}
.article_item_top .left .summary p{
    overflow: hidden;
    white-space: nowrap;
    font-size: 16px;
    text-overflow: ellipsis;
}
.article_item_options li{
    float: left;
    padding: 15px 8px;
}
.article_item_img img{
    width: 20px;
}
.article_item_options .more_options img{
    width: auto;
    height: 20px;
}

.article_item_center {
    padding: 20px 50px;
    background-color: #fff;
    overflow: hidden;
}
.article_item_center .article_item_content p{
    color: gray;
    padding-left: 4px;
    height: 200px;
    word-break: break-word;
}


.article_item_bottom{
    height: 60px;
    background-color: RGBA(246, 246, 246, 1);
    padding-left: 20px;
    padding-right: 20px;
}
.article_item_bottom .related .related_txt{
    float: left;
    font-size: 20px;
    line-height: 60px;
    color:rgba(85,85,85,1);
}
.article_item_bottom .related ul{
    float: left;
    margin-left: 20px;
}
.article_item_bottom .related li{
    float: left;
}
.article_item_bottom .related img {
    height: 40px;
    border-radius: 50%;
    margin-left: -10px;
    margin-top: 10px;
}
.article_item_bottom .tag{
    display: inline-block;
    margin-top: 18px;
    margin-left: 5px;
    /*width: 40px;*/
    height: 24px;
    padding: 0 4px;
    line-height: 22px;
    text-align: center;
    color: RGBA(82, 188, 137, 1);
    border: 1px solid RGBA(82, 188, 137, 1);
    border-radius: 8px;
}


.article_item_bottom .show-all {
    padding-top: 18px;
    color: RGBA(153, 153, 153, 1);
}
.article_item_bottom .show-all .show-all-txt {
    margin-left: 10px;
}
.article_item_bottom .show-all .show-all-arrow{
    margin-left: 10px;
    cursor: pointer;
}
.article_item_bottom .show-all .show-all-arrow img{
    margin-top: -4px;
    /* cursor: pointer; */
}

/* 实现jq的slideToggle效果 */
.slide-enter-active {
    height: 0px;
    overflow: hidden;
}
.slide-leave-active{
    height: 0px;
    overflow: hidden;
}
.slide-enter, .slide-leave {
    height: 0;
    opacity: 0;
}
</style>