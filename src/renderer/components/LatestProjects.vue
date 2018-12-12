<template>
    <div>
        <div v-if="projects.length != 0">
            <button @click="clearRecentList" class="bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
                Clear list
            </button>
            <hr class="divider">
        </div>
        <li v-for="proj in projects" style="list-style: none;">
            <button @click="openRecentProject(proj)" class="btn m-2 bg-transparent text-blue-dark font-semibold py-2 px-4 border border-blue hover:border-transparent rounded">
                {{ proj.filename }}
            </button>
        </li>
        <p v-if="projects.length == 0" class="m-5 font-bold">No recent projects</p>
    </div>
</template>

<script>
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
                this.$router.push({
                    name: 'EditorPage',
                    params: {
                        project: proj
                    }
                })
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