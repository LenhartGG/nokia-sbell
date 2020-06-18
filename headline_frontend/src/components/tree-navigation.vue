<style>
/* #scroll-2{
    height: 700px;
    overflow-x: hidden;

} */
.tree-navigation{
    height: 700px;
    overflow-x: hidden;
}
</style>

<template>
<!-- <div class="tree-navigation"  v-bar> -->
<div  class="tree-navigation ">
    <Tree :data="items" ></Tree>
</div>
</template>

<script>

export default {
    props: ['items'],
    data() {
        return {
            
                data5: [
                    {
                        title: 'parent 2',
                        expand: false,
                    },
                    {
                        title: 'parent 1',
                        expand: true,
                        render: (h, { root, node, data }) => {
                            return h('div', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('router-link', {
                                    style: { backgroundColor: 'red' },
                                    props:{ 
                                        'to': {
                                            path: '/filters',
                                            query: {
                                                section: 'section1', 
                                                filter: '@Mentioned me', 
                                                page:1, 
                                                searchUrl: 'https://optics-jira.int.net.nokia.com/rest/api/2/search?jql=summary%20~%20currentUser()%20OR%20description%20~%20currentUser()%20OR%20comment%20~%20currentUser()'
                                            }
                                        }
                                    },
                                }, [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ])
                            ]);
                        },
                        children: [
                            {
                                title: 'child 1-1',
                            },
                            {
                                title: 'child 1-2',
                            }
                        ]
                    },
                    {
                        title: 'parent 3',
                        expand: true,
                        // render: (h, { root, node, data }) => {
                        //     return h('div', {
                        //         style: {
                        //             display: 'inline-block',
                        //             width: '100%'
                        //         }
                        //     }, [
                        //         h('router-link', {
                        //             style: { backgroundColor: 'red' },
                        //             props:{ 
                        //                 'to': {
                        //                     path: '/filters',
                        //                     query: {
                        //                         section: 'section1', 
                        //                         filter: '@Mentioned me', 
                        //                         page:1, 
                        //                         searchUrl: 'https://optics-jira.int.net.nokia.com/rest/api/2/search?jql=summary%20~%20currentUser()%20OR%20description%20~%20currentUser()%20OR%20comment%20~%20currentUser()'
                        //                     }
                        //                 }
                        //             },
                        //         }, [
                        //             h('Icon', {
                        //                 props: {
                        //                     type: 'ios-folder-outline'
                        //                 },
                        //                 style: {
                        //                     marginRight: '8px'
                        //                 }
                        //             }),
                        //             h('span', data.title)
                        //         ])
                        //     ]);
                        // },
                        children: [
                            {
                                title: 'child 1-1',
                                render: (h, { data }) => {
                                    console.log(data);
                                    
                                    return h('router-link', {
                                            style: { backgroundColor: 'red' },
                                            props:{ 
                                                'to': {
                                                    path: '/filters',
                                                    query: {
                                                        section: 'section1', 
                                                        filter: '@Mentioned me', 
                                                        page:1, 
                                                        searchUrl: 'https://optics-jira.int.net.nokia.com/rest/api/2/search?jql=summary%20~%20currentUser()%20OR%20description%20~%20currentUser()%20OR%20comment%20~%20currentUser()'
                                                    }
                                                }
                                            },
                                        }, data.title
                                    )
                                }
                            },
                            {
                                title: 'child 1-2',
                            }
                        ]
                    },
                ],
                // buttonProps: {
                //     type: 'default',
                //     size: 'small',
                // }
        }
    },
    created(){
        
    },
    methods:{
        
        
    },
    watch:{
        'items': function (){
            if( this.items ){
                this.data5 = this.items
            }
        }
    }
}
</script>
