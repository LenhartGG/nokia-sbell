<template>
    <div>
        <menu2 :filterArray="filterArray" ref="menu2">
        </menu2>

        <div ref="element">123123</div>
    </div>
</template>

<script>
import menu2 from '@/components/menu-test.vue';
import { getjirafilterdata } from "@/request/api.js";

export default {
    data () {
        return {
            theme3: 'dark', //  light
            filterArray: []
        }
    },
    created() {
        this.getjirafilterdata();
        
    },
    mounted() {
        console.log(window.getComputedStyle(this.$refs.element).height);

    },
    methods: {
        
        getjirafilterdata() {
            let self = this;
            getjirafilterdata()
                .then(result => {
                    console.log(result);
                    this.filterArray = result.data.filterArray
                    // this.setMenu(result.data);  // setMenu items
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },
    components:{
        menu2
    }

}
</script>


<style>

</style>