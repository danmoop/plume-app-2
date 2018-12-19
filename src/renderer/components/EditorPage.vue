<template>
    <div>
        <div class="flex mb-4">
            <div class="w-1/6 sidebar h-12 h-screen" style="overflow-y: scroll;">
                <div class="mt-5 h-screen">
                    <ul class="list-reset">
                        <a class="q list-title"><i class="fas fa-file-invoice"></i> Lists</a>
                        <a href="#" style="color: #111;" @click="addList" class="navBtn font-semibold">
                            <i class="fas fa-plus"></i>
                        </a>
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
                            <a href="#" style="color: #e74c3c;" @click="deleteFromTrash(list)"><i class="far fa-times-circle"></i></a>
                            <a href="#" style="color: #16a085;" @click="recover(list)"><i class="fas fa-undo"></i></a>
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
                <ul v-if="editorShown" class="list-reset flex justify-between" style="border: 2px solid #ecf0f1;">
                    <li class="mr-3">
                        <input @change="onNameChange($event)" v-if="!trashShown" class="border border-grey-light q ml-5"
                            placeholder="Username" :value="this.currentList.title">
                        <input @change="onNameChange($event)" v-if="trashShown" :disabled="trashShown" class="border border-grey-light q ml-5"
                            placeholder="Username" :value="this.currentList.title + ' (In trash)'">
                        <button @click="deleteList" v-if="!trashShown" class="navBtn bg-grey-light text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
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
                disabled: false,
                quill: null
            }
        },
        mounted() {
            this.filename = this.project.filename;
            this.$root.$emit('setDocName', this.filename);
            this.fs = require('fs');
        },
        beforeMount() {
            this.project = this.$route.params.project;
            remote.getCurrentWindow().maximize();
        },
        methods: {
            openList(list) {
                this.editorShown = true;
                this.content = list.content;
                this.currentList = list;
                this.trashShown = false;
                this.disabled = false;

                this.refreshWords();
            },
            onEditorReady(quill) {
                this.quill = quill;

                this.refreshWords();
            },
            onEditorChange(event) {
                this.content = event.html;
                this.currentList.content = this.content;

                this.fs.writeFile(this.project.pathFile, JSON.stringify(this.project, null, "\t"), function (err) {});

                this.refreshWords();
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

                this.setWords(0, 0);
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
                this.editorShown = false;

                this.setWords(0, 0);
            },
            previewTrash(list) {
                this.editorShown = true;
                this.content = list.content;
                this.currentList = list;
                this.trashShown = true;
                this.disabled = true;
                this.refreshWords();
            },
            recover(list) {
                var index = this.project.trash.indexOf(list);
                this.project.trash.splice(index, 1);
                this.project.lists.push(list);
                this.fs.writeFile(this.project.pathFile, JSON.stringify(this.project, null, "\t"), function (err) {});
                this.editorShown = false;
            },
            refreshWords() {
                var symNum = this.quill.container.innerText.length - 1;
                var wordNum = this.quill.container.innerText.trim().split(/\s+/).length;
                this.$root.$emit('setNums', symNum, wordNum);
            },
            setWords(symNum, wordNum) {
                this.$root.$emit('setNums', symNum, wordNum);
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