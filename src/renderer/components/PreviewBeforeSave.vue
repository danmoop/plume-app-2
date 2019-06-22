<template>
    <div style="overflow-y: scroll; height: 96vh;">
        <div v-if="!exporting">
            <div class="export_btns text-center">
                <button @click="saveAsPdf" class="exp_btn m-5 bg-transparent text-blue-dark font-semibold py-2 px-4 border border-blue rounded">
                    <i class="far fa-file-pdf"></i>
                    Save as PDF
                </button>
                <button @click="saveAsTxt" class="exp_btn m-5 bg-transparent text-blue-dark font-semibold py-2 px-4 border border-blue rounded">
                    <i class="far fa-file-alt"></i>
                    Save as TXT
                </button>
            </div>
            <hr>
            <h2 class="q m-2">Preview:</h2>
        </div>

        <quill-editor :disabled="true" :options="options" :content="projectText" @ready="onEditorReady">
        </quill-editor>
    </div>
</template>

<script>
    import {
        quillEditor
    } from 'vue-quill-editor'

    import {
        remote
    } from 'electron';

    const fs = require('fs');

    const dialog = remote.require('electron').dialog;

    export default {
        name: 'PreviewBeforeSave',
        components: {
            quillEditor
        },
        data() {
            return {
                project: [],
                projectText: '',
                options: {
                    modules: {
                        toolbar: false
                    }
                },
                quill: null,
                exporting: false
            }
        },
        beforeMount() {
            this.project = this.$route.params.project;
        },
        mounted() {
            var text = '';

            var lists = this.project.lists;

            for (var i = 0; i < lists.length; i++) {
                text += lists[i].content;
            }

            this.projectText = text;
        },
        methods: {
            onEditorReady(quill) {
                this.quill = quill;
            },
            saveAsTxt() {
                var quill = this.quill;
                var localRouter = this.$router;
                var localProject = this.project;

                dialog.showSaveDialog(function (fileName) {

                    if(fileName != undefined)
                    {
                        fs.writeFile(fileName + '.txt', quill.container.innerText, function (err) {
                            if (!err) {
                                dialog.showMessageBox({
                                    message: "Saved as txt to " + fileName + ".txt",
                                    buttons: ['OK']
                                });
                            }
                        });

                        localRouter.push({
                            name: 'EditorPage',
                            params: {
                                project: localProject
                            }
                        })
                    }
                });
            },
            saveAsPdf() {
                var localRouter = this.$router;
                var localProject = this.project;

                this.exporting = true;
                this.$root.$emit('export');

                document.body.innerHTML = '';

                document.body.innerHTML = this.quill.container.innerHTML;

                dialog.showSaveDialog({
                    filters: [{
                        name: 'PDF',
                        extensions: ['pdf']
                    }]
                }, function (fileName) {
                    remote.getCurrentWindow().webContents.printToPDF({}, function (err, data) {
                    
                        if(fileName != undefined)
                        {
                            fs.writeFile(fileName, data, function (err) {
                                if (!err) {
                                    dialog.showMessageBox({
                                        message: 'PDF document saved to ' + fileName,
                                        buttons: ['OK']
                                    });
                                }
                            });
                        }

                        this.exporting = false;
                        localRouter.push('/');
                        remote.getCurrentWindow().reload();
                    });
                });
            }
        }
    }
</script>

<style>
    .exp_btn {
        transition: 0.3s;
        color: #3498db;
    }

    .exp_btn:hover {
        transition: 0.3s;
        background: #3498db;
        color: white;
    }
</style>