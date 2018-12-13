<template>
    <div>

        <div class="flex mb-4">
            <div class="w-1/6 sidebar h-12 vh-100">
                <div class="text-center mt-5">
                    <button @click="goBack" class="bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                </div>
            </div>
            <div class="w-5/6 h-12 vh-100">
                <quill-editor style="height: 100vh;" :content="content" :options="editorOption" @change="onEditorChange($event)">
                </quill-editor>
            </div>
        </div>
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

    import App from './../App';

    export default {
        name: 'EditorPage',
        components: {
            quillEditor,
            App
        },
        data() {
            return {
                content: '<p>example content</p>',
                project: [],
                editorOption: {},
                filename: null
            }
        },
        mounted() {
            this.filename = this.project.filename;
            this.$root.$emit('setDocName', this.filename);
        },
        beforeMount() {
            this.project = this.$route.params.project;
        },
        methods: {
            goBack() {
                this.$router.push('landing-page');
                this.$root.$emit('unsetDocName');
            }
        }
    }
</script>

<style>
    .sidebar {
        background: #f3f3f3;
    }

    .vh-100 {
        height: 100vh;
    }

    .divider {
        background: #888;
        opacity: 0.3;
        width: 50%;
    }
</style>