<template>
    <div>
        <router-link to="/">Proceed to home page</router-link>
        <h1>Hello</h1>
    </div>

</template>

<script>

    import {remote} from 'electron';

    export default {
        name: 'EditorPage',
        methods: {
            increase() {
                remote.getCurrentWindow().setSize(1000, 900);
            }
        }
    }
</script>