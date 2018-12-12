<template>
    <div>
        <router-link to="/">Proceed to home page</router-link>
        <quill-editor :content="content" :options="editorOption" @change="onEditorChange($event)">
        </quill-editor>
    </div>

</template>

<script>
    import {
        remote
    } from 'electron';
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    import {
        quillEditor
    } from 'vue-quill-editor'

    export default {
        name: 'EditorPage',
        components: {
            quillEditor
        },
        data() {
            return {
                content: '<p>example content</p>',
                editorOption: { /* quill options */ }
            }
        },
        mounted() {
            console.log('this is current quill instance object', this.myQuillEditor)
        },
        beforeMount() {
            this.project = this.$route.params.project;
        }
    }
</script>