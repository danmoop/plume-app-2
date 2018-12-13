<template>
  <div>
    <div class="flex">
      <div class="l-block w-3/4 text-center">
        <p class="roboto-light">Plume 2</p>
        <div class="btns">
          <div class="px-4 m-10">
            <div class="flex -mx-2">
              <div class="w-1/2 px-2">
                <button @click="createBlank('blank')" class="q shadow-md appBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
                  <i class="fas fa-lg fa-file text-blue"></i>
                  <span class="text-black">Create blank document</span>
                </button>
              </div>
              <div class="w-1/2 px-2">
                <button @click="createBlank('book')" class="q shadow-md appBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
                  <i class="fas fa-lg fa-book text-green"></i>
                  <span class="text-black">Create book document</span>
                </button>
              </div>
            </div>
          </div>
          <div class="px-4 m-10">
            <div class="flex -mx-2">
              <div class="w-1/2 px-2">
                <button @click="createBlank('secure')" class="q shadow-md appBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
                  <i class="fas fa-lg fa-lock"></i>
                  <span class="text-black">Create secure document</span>
                </button>
              </div>
              <div class="w-1/2 px-2">
                <button @click="createBlank('science')" class="q shadow-md appBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
                  <i class="fas fa-lg fa-atom text-red"></i>
                  <span class="text-black">Create scientific document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr class="divider">
        <button @click="openDocument" class="q shadow-md m-10 appBtn bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
          <i class="fas fa-lg fa-file text-indigo"></i>
          <span class="text-black">Open document</span>
        </button>
      </div>
      <div class="r-block w-1/4 text-center">
        <h2 class="q m-5">Recent documents</h2>
        <latest-projects></latest-projects>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    remote
  } from 'electron';

  const dialog = remote.require('electron').dialog;
  const fs = require('fs');

  import EditorPage from './EditorPage';
  import LatestProjects from './LatestProjects';

  export default {
    name: 'landing-page',
    components: {
      EditorPage,
      LatestProjects
    },
    methods: {
      createBlank(type) {

        var localRouter = this.$router;

        dialog.showSaveDialog(function (fileName) {

          let splittedPath = fileName.split("\\");
          let projectName = splittedPath[splittedPath.length - 1];

          let project = {
            type: type,
            filename: projectName,
            actors: [],
            places: [],
            notes: [],
            shortStory: "",
            lists: [],
            trash: [],
            pathFile: fileName
          };

          var result;

          result = JSON.stringify(project, null, "\t");

          fs.writeFile(fileName + ".plume", result, function (err) {
            if (err) dialog.showErrorBox("Error", err);

            else {
              dialog.showMessageBox({
                message: "Created successfully to " + fileName + ".plume",
                buttons: ['OK']
              }, function (response) {
                var recent = JSON.parse(localStorage.getItem('recent'));
                recent.unshift(project);
                localStorage.setItem('recent', JSON.stringify(recent));
                localRouter.push({
                  name: 'EditorPage',
                  params: {
                    project: project
                  }
                });
              });
            }
          });
        });
      },
      openDocument() {
        var localRouter = this.$router;
        var _project;

        dialog.showOpenDialog(function (filename) {
          fs.readFile(filename[0], function (err, data) {
            _project = JSON.parse(data);
            localRouter.push({
              name: 'EditorPage',
              params: {
                project: _project
              }
            })
          });
        });
      }
    },

    beforeMount() {
      if (localStorage.getItem('recent') == null) {
        localStorage.setItem('recent', '[]');
      }
    }
  }
</script>