<template>
    <div>
        <div class="flex mb-4" v-if="!isEditorHidden">
            <div class="w-1/6 sidebar" style="overflow-y: scroll; height: 99vh;">
                <div class="mt-10">
                    <ul class="list-reset">
                        <!-- <a href="#" @click="getInfo">Get info</a> -->
                        <a class="q list-title"><i class="fas fa-file-invoice"></i> Lists</a>
                        <a href="#" style="color: #111;" @click="addList" class="navBtn font-semibold">
                            <i class="fas fa-plus"></i>
                        </a>
                        <draggable @update="onDragUpdate" :list="project.lists" @start="drag=true" @end="drag=false">
                            <li v-for="list in project.lists" :key="list.id" class="q list-item">
                                <a href="#" @click="openList(list)" class="item"><i class="far fa-file"></i>
                                    {{list.title}}</a>
                            </li>
                        </draggable>
                    </ul>
                    <hr>
                    <ul class="list-reset under-item" v-if="this.project.type == 'book'">
                        <a class="q list-title"><i class="fas fa-users"></i> Actors</a>
                        <a href="#" style="color: #111;" @click="addActor" class="navBtn font-semibold">
                            <i class="fas fa-plus"></i>
                        </a>
                        <draggable @update="onDragUpdate" :list="project.actors" @start="drag=true" @end="drag=false">
                            <li v-for="list in project.actors" class="q list-item">
                                <a @click="openList(list)" href="#" class="actor-item"><i class="far fa-user-circle"></i>
                                    {{list.title}}</a>
                            </li>
                        </draggable>
                    </ul>
                    <hr>
                    <ul class="list-reset under-item" v-if="this.project.type == 'book'">
                        <a class="q list-title"><i class="fas fa-globe-americas"></i> Places</a>
                        <a href="#" style="color: #111;" @click="addPlace" class="navBtn font-semibold">
                            <i class="fas fa-plus"></i>
                        </a>
                        <draggable @update="onDragUpdate" :list="project.places" @start="drag=true" @end="drag=false">
                            <li v-for="list in project.places" class="q list-item">
                                <a @click="openList(list)" href="#" class="place-item"><i class="fas fa-map-marker-alt"></i>
                                    {{list.title}}</a>
                            </li>
                        </draggable>
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
            <div class="w-5/6" style="height: 95vh; overflow-y: scroll;">
                <ul v-if="editorShown" class="list-reset flex justify-between" style="border: 2px solid #ecf0f1;">
                    <li class="mr-3">
                        <button v-if="project.type == 'secure'" style="margin: 0px auto;" @click="hideEditor" class="q shadow-md appBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
                            <i class="fas fa-lg fa-lock"></i>
                        </button>
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

                <div style="width: 50%; margin: 0px auto; margin-top: 150px;" v-if="!editorShown && project.type == 'secure'">
                    <div class="flex items-center py-2">
                        <button style="margin: 0px auto;" @click="hideEditor" class="q shadow-md appBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
                            <i class="fas fa-lg fa-lock"></i>
                            <span class="text-black">Hide editor</span>
                        </button>
                    </div>
                </div>

                <quill-editor :disabled="disabled" v-if="editorShown" @ready="onEditorReady" :content="content"
                    :options="editorOptions" @change="onEditorChange($event)">
                </quill-editor>

                <br><br>
            </div>
        </div>

        <transition enter-active-class="animated fadeIn">
            <div v-if="isEditorHidden">
                <h2 class="text-center q" style="width: 90%;margin: 0px auto;margin-top: 25%;">
                    Editor is hidden. Enter your document's secure passcode to unlock
                </h2>
                <div style="width: 50%;margin: 0px auto; margin-top: 50px;">
                    <input style="margin: 0px auto; width: 50%;border: 2px solid #e2e2e2;" v-model="securePass" class="appearance-none bg-transparent border-none text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
                        type="password" placeholder="Secure Password">
                    <button @click="submitUnlock" style="margin: 0px auto; width: 30%;" class="q shadow-md appBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
                        <span class="text-black">Submit</span>
                    </button>
                </div>
            </div>
        </transition>

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
    import CryptoJS from 'crypto-js';
    import draggable from 'vuedraggable';

    const dialog = remote.require('electron').dialog;

    export default {
        name: 'EditorPage',
        components: {
            quillEditor,
            App,
            draggable
        },
        data() {
            return {
                content: '<p>example content</p>',
                project: [],
                editorOptions: {},
                filename: null,
                editorShown: false,
                wordAmount: null,
                currentList: null,
                fs: null,
                trashShown: false,
                disabled: false,
                quill: null,
                isEditorHidden: false,
                securePass: ''
            }
        },
        mounted() {
            this.filename = this.project.filename;
            this.$root.$emit('setDocName', this.filename);
            this.fs = require('fs');

            if (this.project.type == 'secure')
                this.$root.$emit('setSecure', true);
            else
                this.$root.$emit('setSecure', false);
        },
        beforeMount() {
            this.project = this.$route.params.project;
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

                this.save();

                this.refreshWords();
            },
            addList() {
                var list = {
                    title: "Untitled",
                    content: '',
                    id: "list_" + this.makeid()
                }

                this.project.lists.push(list);

                this.save();
            },
            addActor() {
                var list = {
                    title: "Unnamed",
                    content: '',
                    id: "actor_" + this.makeid()
                }

                this.project.actors.push(list);

                this.save();
            },
            addPlace() {
                var list = {
                    title: "Uncharted",
                    content: '',
                    id: "place_" + this.makeid()
                }

                this.project.places.push(list);

                this.save();
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

                if (this.currentList.id.split("_")[0] == 'list') {
                    var index = this.project.lists.indexOf(this.currentList);
                    this.project.lists.splice(index, 1);
                } else if (this.currentList.id.split("_")[0] == 'actor') {
                    var index = this.project.actors.indexOf(this.currentList);
                    this.project.actors.splice(index, 1);
                } else if (this.currentList.id.split("_")[0] == 'place') {
                    var index = this.project.places.indexOf(this.currentList);
                    this.project.places.splice(index, 1);
                }

                this.currentList = null;
                this.editorShown = false;

                this.save();

                this.setWords(0, 0);
            },
            onNameChange(event) {

                if (this.currentList.id.split("_")[0] == 'list') {
                    var index = this.project.lists.indexOf(this.currentList);
                    this.project.lists[index].title = event.target.value;
                } else if (this.currentList.id.split("_")[0] == 'actor') {
                    var index = this.project.actors.indexOf(this.currentList);
                    this.project.actors[index].title = event.target.value;
                } else if (this.currentList.id.split("_")[0] == 'place') {
                    var index = this.project.places.indexOf(this.currentList);
                    this.project.places[index].title = event.target.value;
                }

                this.save();
            },
            deleteFromTrash(list) {
                var index = this.project.trash.indexOf(list);
                this.project.trash.splice(index, 1);
                this.save();
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

                if (list.id.split("_")[0] == 'list')
                    this.project.lists.push(list);
                else if (list.id.split("_")[0] == 'actor')
                    this.project.actors.push(list);
                else if (list.id.split("_")[0] == 'place')
                    this.project.places.push(list);

                this.save();
                this.editorShown = false;

                this.setWords(0, 0);
            },
            refreshWords() {
                var symNum = this.quill.container.innerText.length - 1;
                var wordNum = this.quill.container.innerText.trim().split(/\s+/).length;
                this.$root.$emit('setNums', symNum, wordNum);
            },
            setWords(symNum, wordNum) {
                this.$root.$emit('setNums', symNum, wordNum);
            },
            getInfo() {
                console.log('CryptoJS');
            },
            onDragUpdate() {
                this.save();
            },
            save() {

                var result = JSON.stringify(this.project, null, "\t");

                if (this.project.type == 'secure') {
                    result = CryptoJS.AES.encrypt(result, this.project.secret);
                }

                this.fs.writeFile(this.project.pathFile, result, function (err) {});
            },
            hideEditor() {
                this.isEditorHidden = true;
            },
            submitUnlock() {
                if (this.securePass == this.project.secret) {
                    this.isEditorHidden = false;
                    this.securePass = '';
                } else

                    dialog.showMessageBox({
                        message: "Password is invalid",
                        buttons: ['OK']
                    });
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

    .place-item {
        transition: 0.25s;
        text-decoration: none;
        color: #333;
    }

    .place-item:hover {
        transition: 0.25s;
        text-decoration: none;
        color: #8c7ae6;
    }

    .actor-item {
        transition: 0.25s;
        text-decoration: none;
        color: #333;
    }

    .actor-item:hover {
        transition: 0.25s;
        color: #27ae60;
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