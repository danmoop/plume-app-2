<template>
    <div>
        <div v-if="projects.length != 0">
            <button @click="clearRecentList" class="q bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
                Clear list
            </button>
            <hr class="divider">
        </div>
        <li v-for="proj in projects" style="list-style: none;">
            <button v-if="proj.type != 'secure'" @click="openRecentProject(proj)" class="q btn m-2 bg-transparent text-blue-dark font-semibold py-2 px-4 border border-blue hover:border-transparent rounded">
                <i v-if="proj.type == 'blank'" class="fas fa-lg fa-file text-blue"></i>
                <i v-if="proj.type == 'book'" class="fas fa-lg fa-book text-green"></i>
                {{ proj.filename }}
            </button>

            <button v-if="proj.type == 'secure'" @click="() => displayMsg('Unable to open secret project from this menu! Use a password instead to access!')" class="q btn m-2 bg-transparent text-blue-dark font-semibold py-2 px-4 border border-blue hover:border-transparent rounded">
                <i class="fas fa-lg fa-lock text-red"></i> {{ proj.filename }}
            </button>
        </li>
        <p v-if="projects.length == 0" class="m-5 font-bold">No recent projects</p>
    </div>
</template>

<script>
    
    import fs from 'fs';

    export default {
        data() {
            return {
                projects: []
            }
        },
        beforeMount() {
            var recent = JSON.parse(localStorage.getItem('recent'));

            this.projects = recent;
        },
        methods: {
            clearRecentList() {
                localStorage.setItem('recent', '[]');
                this.projects = [];
            },
            openRecentProject(proj) {
        
                var localRouter = this.$router;

                fs.readFile(proj.pathFile, function(err, data) {
                    var _project = JSON.parse(data);
                    
                    localRouter.push({
                    name: 'EditorPage',
                    params: {
                        project: _project
                    }
              })

                });
            },
            displayMsg(msg)
            {
                alert(msg);
            }
        }
    }
</script>

<style>
    .btn:hover {
        transition: 0.3s;
        background: #3498db;
        color: white;
    }

    .btn:not(:hover) {
        transition: 0.3s;
        background: white;
    }
</style>