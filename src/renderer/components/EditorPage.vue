<template>
    <div>
        <h1>{{project}}</h1>
        <router-link to="/">Proceed to home page</router-link>
    </div>

</template>

<script>
    import {remote} from 'electron';

    export default {
        name: 'EditorPage',
        beforeMount(){
            this.project = this.$route.params.project;
        }
    }
</script>