<template>
    <div class="menu-test">
        <Menu ref="menutest" :theme="theme3" :active-name="activeName" :open-names="['1', '2', '3', '4']">
            <Submenu name="1">
                <!-- title已被隐藏 只展示item -->
                <template slot="title">
                    <!-- <Icon type="ios-filing" /> -->
                    HOMEPAGE
                </template>

                <MenuItem class="homepage-nav" name="1-1"  :to="{ path: '/', query: { currentTabComponent: 'homepage', currentActiveName: '1-1' } }">
                    <img class="menu-icon" src="@/assets/images/icon-homepage.png" alt="">
                    <router-link :to="{ path: '/', query: { currentTabComponent: 'homepage', currentActiveName: '1-1' } }">
                        HOMEPAGE
                    </router-link>
                </MenuItem>
                
            </Submenu>

            <!-- <Submenu name="2">
                <template slot="title">
                    <img class="menu-icon" src="@/assets/images/icon-new-mrs.png" alt="">
                    Unassigned MR
                </template>
    
                <MenuItem  name="2-1" :to="{ 
                        path: '/', 
                        query: { 
                            currentTabComponent: 'filters', 
                            currentActiveName: '2-1' ,
                            section: 'section1', 
                            filter: 'I\'m Assignee', 
                            page:1, 
                            searchUrl: ''
                        } 
                    }">
                    <router-link 
                    :to="{ 
                        path: '/', 
                        query: { 
                            currentTabComponent: 'filters', 
                            currentActiveName: '2-1' ,
                            section: 'section1', 
                            filter: 'I\'m Assignee', 
                            page:1, 
                            searchUrl: ''
                        } 
                    }">
                        I'm Assignee
                    </router-link>
                </MenuItem>

                <MenuItem  name="2-2" :to="{ 
                        path: '/', 
                        query: { 
                            currentTabComponent: 'filters', 
                            currentActiveName: '2-2' ,
                            section: 'section1', 
                            filter: 'I\'m Reporter', 
                            page:1, 
                            searchUrl: ''
                        } 
                    }">
                    <router-link 
                    :to="{ 
                        path: '/', 
                        query: { 
                            currentTabComponent: 'filters', 
                            currentActiveName: '2-2' ,
                            section: 'section1', 
                            filter: 'I\'m Reporter', 
                            page:1, 
                            searchUrl: ''
                        } 
                    }">
                        I'm Reporter
                    </router-link>
                </MenuItem>
                <MenuItem  name="2-3" :to="{ 
                        path: '/', 
                        query: { 
                            currentTabComponent: 'filters', 
                            currentActiveName: '2-3' ,
                            section: 'section1', 
                            filter: 'I\'m Manager', 
                            page:1, 
                            searchUrl: ''
                        } 
                    }">
                    <router-link 
                    :to="{ 
                        path: '/', 
                        query: { 
                            currentTabComponent: 'filters', 
                            currentActiveName: '2-3' ,
                            section: 'section1', 
                            filter: 'I\'m Manager', 
                            page:1, 
                            searchUrl: ''
                        } 
                    }">
                        I'm Manager
                    </router-link>
                </MenuItem>
            </Submenu> -->
            
            <Submenu name="2">
                <template slot="title">
                    <img class="menu-icon" src="@/assets/images/icon-new-mrs.png" alt="">
                    Unassigned MR
                </template>
    
                <MenuItem  v-for="(menuItem, index) in filterArray0" :key="index" :name="'2-'+(index+1)" 
                    :to="{ 
                        path: '/', 
                        query: { 
                            currentTabComponent: 'filters', 
                            currentActiveName: '2-'+(index+1) ,
                            section: 'section1', 
                            filter: menuItem.name, 
                            filterid: menuItem.id,
                            page:1, 
                            searchUrl: ''
                        } 
                    }">
                    <router-link 
                    :to="{ 
                        path: '/', 
                        query: { 
                            currentTabComponent: 'filters', 
                            currentActiveName: '2-'+(index+1) ,
                            section: 'section1', 
                            filter: menuItem.name, 
                            filterid: menuItem.id,
                            page:1, 
                            searchUrl: ''
                        } 
                    }">
                        {{menuItem.name}}
                    </router-link>
                </MenuItem>
            </Submenu>

            <Submenu name="3">
                <template slot="title">
                    <img class="menu-icon" src="@/assets/images/icon-relevant.png" alt="">
                    RELEVANT TO ME
                </template>

                <MenuItem  v-for="(menuItem, index) in filterArray1" :key="index" :name="'3-'+(index+1)"
                    :to="{
                        path: '/',
                        query: {
                            currentTabComponent: 'filters',
                            currentActiveName: '3-'+(index+1),
                            section: 'section1', 
                            filter: menuItem.name, 
                            page:1, 
                            searchUrl: menuItem.searchUrl
                        }
                    }">
                    <router-link 
                        :to="{
                            path: '/',
                            query: {
                                currentTabComponent: 'filters',
                                currentActiveName: '3-'+(index+1),
                                section: 'section1', 
                                filter: menuItem.name, 
                                page:1, 
                                searchUrl: menuItem.searchUrl
                            }
                        }">
                        {{ menuItem.name }}
                    </router-link>
                </MenuItem>
            </Submenu>

            <Submenu name="4">
                <template slot="title">
                    <img class="menu-icon" src="@/assets/images/icon-favourite.png" alt="">
                    FAVOURITE FILTERS
                </template>

                <Submenu :name="index2 + 5" v-show="false" v-for="(Submenu, index2) in filterArray3" :key="Submenu.id">
                    <template slot="title">Submenu {{ index2 }}</template>
                    <!-- <MenuItem v-for="(subItem, subIndex) in Submenu" :name="(index2+5)+'-'+subIndex" :key="subItem.id">{{ subItem.name }}</MenuItem> -->
                    <MenuItem :name="(index2 + 5) + '-1'">Option 7</MenuItem>
                    <MenuItem :name="(index2 + 5) + '-2'">Option 8</MenuItem>
                </Submenu>
                
                <MenuItem  v-for="(menuItem, index3) in filterArray2" :key="menuItem.id" :name="'4-'+(index3+1)"
                    :to="{
                        path: '/',
                        query: {
                            currentTabComponent: 'filters',
                            currentActiveName: '4-'+(index3+1),
                            section: 'section1', 
                            filter: menuItem.name, 
                            page:1, 
                            searchUrl: menuItem.searchUrl
                        }
                    }">
                    <router-link 
                        :to="{
                            path: '/',
                            query: {
                                currentTabComponent: 'filters',
                                currentActiveName: '4-'+(index3+1),
                                section: 'section1', 
                                filter: menuItem.name, 
                                page:1, 
                                searchUrl: menuItem.searchUrl
                            }
                        }">
                        {{ menuItem.name }}
                    </router-link>
                </MenuItem>
            </Submenu>

            <!-- <Submenu name="2">
                <template slot="title">
                    <Icon type="ios-filing" />
                    RELEVANT TO ME
                </template>
                <MenuItem name="2-1">Option 5</MenuItem>
                <MenuItem name="2-2">Option 6</MenuItem>
            </Submenu>
            <Submenu name="4">
                <template slot="title">
                    <Icon type="ios-cog" />
                    FAVOURITE FILTERS
                </template>
                <Submenu name="3">
                    <template slot="title">Submenu</template>
                    <MenuItem name="3-1">Option 7</MenuItem>
                    <MenuItem name="3-2">Option 8</MenuItem>
                </Submenu>
                <MenuItem name="4-1">Option 9</MenuItem>
                <MenuItem name="4-2">Option 10</MenuItem>
                <MenuItem name="4-3">Option 11</MenuItem>
                <MenuItem name="4-4">Option 12</MenuItem>
            </Submenu> -->
        </Menu>
    </div>
</template>

<script>
export default {
    props: [
        'filterArray'
    ],
    data () {
        return {
            theme3: 'dark', //  light
            isTruthy: true,
            currentFilter: '',
            activeName: ''
        }
    },
    created () {
        this.initMenu();
    },
    methods: {
        initMenu(){
            
        }
    },
    computed:{
        filterArray0(){
            let newArr = [];
            this.filterArray.forEach((element, index) => {
                if (index<3){
                    newArr.push(element);
                }
            });
            return newArr;
        },
        filterArray1(){
            let newArr = [];
            this.filterArray.forEach((element, index) => {
                if (index<9 && index>3){
                    newArr.push(element);
                }
            });
            return newArr;
        },
        filterArray2(){
            let newArr = [];
            this.filterArray.forEach((element, index) => {
                if (index>=12){
                    newArr.push(element);
                }
            });
            return newArr;
        },
        filterArray3(){
            let newArr = [];
            newArr[0] = [];
            newArr[1] = [];
            newArr[2] = [];
            this.filterArray.forEach((element, index) => {
                if (index>=6 && index<9){
                    newArr[0].push(element);
                }
                if (index>=9 && index<12){
                    newArr[1].push(element);
                }
                if (index>=12 && index<15){
                    newArr[2].push(element);
                }
            });
            return newArr;
        }
    },
    watch: {
        '$route' (to, from) {

            let query = to.query;
            let currentActiveName = query.currentActiveName;
            this.$nextTick(()=>{
                
                this.$refs.menutest.currentActiveName = currentActiveName;
                this.$refs.menutest.updateActiveName()
            })
        },

    }
}
</script>

<style>
.menu-test{
    
}

/* ivu-menu */
.ivu-menu{
    width: 200px!important;
    background: rgb(46, 50, 63);
}
.ivu-menu-dark{
    margin-left: 10px;
}
.ivu-menu-submenu-title{
    font-family: 'Headline bold'
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-child-item-active>.ivu-menu-submenu-title{
    background: rgb(46, 50, 63);
    border-radius: 6px;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover{
    background: rgb(46, 50, 63);
    border-radius: 6px;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title{
    background: rgb(46, 50, 63);
    border-radius: 6px;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover{
    background: rgb(46, 50, 63);
    border-radius: 6px;
}

.menu-test a{
    color: #fff;
}
.menu-test a.active{
    background: #2d8cf0;
}


.menu-test .ivu-menu-vertical .ivu-menu-submenu:nth-of-type(1) > ul > li {
    padding-left: 24px!important;
}
.menu-test .ivu-menu-vertical .ivu-menu-submenu:nth-of-type(1) .ivu-menu-submenu-title{
    display: none;
}

/* 菜单的title文字调整  */
.ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{
    padding: 14px 14px;
}

/* 菜单的导航item文字调整  */
.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item{
    padding-left: 39px!important;
}

/* 下拉箭头位置 */
.ivu-menu-vertical .ivu-menu-submenu-title-icon{
    right: 10px;
}
/* 导航图标位置调整 */
.menu-icon{
    margin-top: 3px;
    margin-right: 6px;
}

/* 调整导航homepage的位置 */
.ivu-menu-vertical .ivu-menu-submenu .homepage-nav {
    padding-left: 14px!important
}
</style>