<template>
    <div>
        <div class="flex mb-4">
            <div class="w-1/6 sidebar h-12 h-screen" style="overflow-y: scroll;">
                <div class="mt-5 h-screen">
                    <button @click="goBack" class="text-center bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <ul class="list-reset">
                        <a class="q list-title"><i class="fas fa-file-invoice"></i> Lists</a>
                        <button @click="addList" class="navBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
                            <i class="fas fa-plus"></i>
                        </button>
                        <li v-for="list in project.lists" class="q list-item">
                            <a href="#" @click="openList(list)" class="item"><i class="far fa-file"></i>
                                {{list.title}}</a>
                        </li>
                    </ul>
                    <hr>
                    <ul class="list-reset under-item">
                        <a class="q list-title"><i class="fas fa-trash-alt"></i> Trash</a>
                        <li v-for="list in project.trash" class="q list-item">
                            <a @click="previewTrash(list)" href="#" class="trash-item"><i class="far fa-file"></i>
                                {{list.title}}</a>
                                <a href="#" @click="deleteFromTrash(list)"><i class="far fa-times-circle"></i></a>
                        </li>
                    </ul>

                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                </div>
            </div>
            <div class="w-5/6 h-12 h-screen" style="overflow-y: scroll;">
                <ul v-if="editorShown && !trashShown" class="list-reset flex justify-between" style="border: 2px solid #ecf0f1;">
                    <li class="mr-3">
                        <input @change="onNameChange($event)" class="border border-grey-light q ml-5" placeholder="Username"
                            :value="this.currentList.title">
                        <button @click="deleteList" class="navBtn bg-grey-light text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>
                    <li class="mr-3">
                    </li>
                    <li class="mr-3">
                    </li>
                </ul>

                <h2 class="text-center" style="width: 90%;margin: 0px auto;margin-top: 25%;" v-if="!editorShown">Looks
                    like there is nothing here yet. Get started by creating / opening blank file on the left sidebar!</h2>

                <quill-editor :disabled="disabled" v-if="editorShown" @ready="onEditorReady" :content="content"
                    :options="editorOption" @change="onEditorChange($event)">
                </quill-editor>

                <br><br>
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
                filename: null,
                editorShown: false,
                wordAmount: null,
                currentList: null,
                fs: null,
                trashShown: false,
                disabled: false
            }
        },
        mounted() {
            this.filename = this.project.filename;
            this.$root.$emit('setDocName', this.filename);
            this.fs = require('fs');
        },
        beforeMount() {
            this.project = this.$route.params.project;
        },
        methods: {
            goBack() {
                this.$router.push('landing-page');
                this.$root.$emit('unsetDocName');
            },
            openList(list) {
                this.editorShown = true;
                this.content = list.content;
                this.currentList = list;
                this.trashShown = false;
                this.disabled = false;
            },
            onEditorReady(quill) {
                var symNum = quill.container.innerText.length;
                var wordNum = quill.container.innerText.trim().split(/\s+/).length;
                this.$root.$emit('setNums', symNum, wordNum);
            },
            onEditorChange(event) {
                this.content = event.html;
                this.currentList.content = this.content;

                this.fs.writeFile(this.project.pathFile, JSON.stringify(this.project, null, "\t"), function (err) {});

                var symNum = event.text.length;
                var wordNum = event.text.split(" ").length;
                this.$root.$emit('setNums', symNum, wordNum);
            },
            addList() {
                var list = {
                    title: "Untitled",
                    content: '',
                    id: "list_" + this.makeid()
                }

                this.project.lists.push(list);

                this.fs.writeFile(this.project.pathFile, JSON.stringify(this.project, null, "\t"), function (err) {});
            },
            makeid() {
                var text = '';
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 20; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            },
            deleteList() {
                this.project.trash.push(this.currentList);
                var index = this.project.lists.indexOf(this.currentList);
                this.project.lists.splice(index, 1);

                this.currentList = null;
                this.editorShown = false;

                this.fs.writeFile(this.project.pathFile, JSON.stringify(this.project, null, "\t"), function (err) {});
            },
            onNameChange(event) {
                var index = this.project.lists.indexOf(this.currentList);
                this.project.lists[index].title = event.target.value;
                this.fs.writeFile(this.project.pathFile, JSON.stringify(this.project, null, "\t"), function (err) {});
            },
            deleteFromTrash(list) { 
                var index = this.project.trash.indexOf(list);
                this.project.trash.splice(index, 1);
                this.fs.writeFile(this.project.pathFile, JSON.stringify(this.project, null, "\t"), function (err) {});
            },
            previewTrash(list) { 
                this.editorShown = true;
                this.content = list.content;
                this.currentList = list;
                this.trashShown = true;
                this.disabled = true;
            }
        }
    }
</script>

<style>
    .sidebar {
        background: #f3f3f3;
    }

    .divider {
        background: #888;
        opacity: 0.3;
        width: 50%;
    }

    .list-title {
        margin: 8px;
        margin-left: 10px;
    }

    .list-item {
        margin: 8px;
        margin-left: 25px;
    }

    .item {
        transition: 0.25s;
        text-decoration: none;
        color: #333;
    }

    .trash-item {
        transition: 0.25s;
        text-decoration: none;
        color: #333;
    }

    .trash-item:hover {
        transition: 0.25s;
        color: #e74c3c;
    }

    .under-item {
        margin-top: 50px;
    }

    .item:hover {
        transition: 0.25s;
        color: #3498db;
    }
</style>