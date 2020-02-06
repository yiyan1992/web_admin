<template>
    <div id="app">
        <Banner title="AAA" username="张三" token="aaa"></Banner>
        <Home username="张三" token="aaa"></Home>
    </div>
</template>

<script>
    import Banner from "@/components/Banner";
    import Home from "@/components/Home"

    export default {
        name: 'app',
        components: {
            Banner, Home
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
