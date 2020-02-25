<template>
    <div id="app">
        <Banner title="AAA" username="张三" token="aaa"></Banner>
        <Home username="张三" token="aaa"></Home>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Banner from "@/components/Banner.vue";
    import Home from "@/components/Home.vue";

    @Component({
        components: {
            Banner, Home
        }
    })

    export default class App extends Vue {

        beforeCreate() {
            //检测token是否存在
            let item = localStorage.getItem("Authorization");
            if (item != null && item.length > 0) {
                this.axios.get("checkToken").then(result => {
                    if (result.data.code == 200) {
                        console.log()
                    } else {
                        this.$router.replace("/login")
                    }
                });
            } else {
                this.$router.replace("/login")
            }
        }

    }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
