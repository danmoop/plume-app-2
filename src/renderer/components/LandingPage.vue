<template>
  <div>
    <div class="flex">
      <div class="l-block w-3/4 text-center" style="background-image: linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url(/static/spring.png);">
        <p class="roboto-light">Plume</p>
        <div class="btns">
          <div class="px-4 m-10">
            <div class="flex -mx-2">
              <div class="w-1/2 px-2">
                <button @click="createBlank('blank')" class="q shadow-md appBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
                  <i class="fas fa-lg fa-file text-blue"></i>
                  <span class="text-black">Create a blank document</span>
                </button>
              </div>
              <div class="w-1/2 px-2">
                <button @click="createBlank('book')" class="q shadow-md appBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
                  <i class="fas fa-lg fa-book text-green"></i>
                  <span class="text-black">Create a book document</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Those functions will be implemented later -->

          <div class="px-4 m-10">
            <div class="flex -mx-2">
              <div class="px-2" style="width: 100%;">
                <div style="width: 50%; margin: 0px auto;">
                  <div class="flex items-center border-b border-b-2 border-teal py-2">
                    <input v-model="securePass" class="appearance-none bg-transparent border-none text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="password" placeholder="Secure Password">
                    <button @click="createBlank('secure')" class="q shadow-md appBtn bg-white text-red font-semibold py-2 px-4 border border-grey-light rounded">
                      <i class="fas fa-lg fa-lock"></i>
                      <span class="text-black">Create a secure document</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr class="divider">

        <div class="px-4 m-10">
          <div class="px-2" style="width: 100%;">
            <div style="width: 50%; margin: 0px auto;">
              <div class="flex items-center border-b border-b-2 border-teal py-2">
                <input v-model="securePass2" class="appearance-none bg-transparent border-none text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="password" placeholder="Secure Password">
                <button @click="openDocument" class="q shadow-md appBtn bg-white text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded">
                  <i class="fas fa-lg fa-file icon-dark"></i>
                  <span class="text-black">Open document</span>
                </button>
              </div>
            </div>
          </div>
        </div>

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
  import CryptoJS from 'crypto-js';

  export default {
    name: 'landing-page',
    components: {
      EditorPage,
      LatestProjects
    },
    data() {
      return {
        securePass: '',
        securePass2: '',
        secureError: false
      }
    },
    methods: {
      createBlank(type) {

        var pass = this.securePass;

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
            pathFile: fileName + ".plume2",
            secret: null
          };

          var result;

          result = JSON.stringify(project, null, "\t");

          if (type == 'secure') {
            if (pass != '') {
              this.secureError = false;
              project.secret = pass;
              result = CryptoJS.AES.encrypt(result, pass);
            } else {
              this.secureError = true;
              dialog.showMessageBox({
                message: "Your file should have a secure password",
                buttons: ['OK']
              });
            }
          }

          fs.writeFile(fileName + ".plume2", result, function (err) {
            if (err) dialog.showErrorBox("Error", err);

            else if (!this.secureError) {
              dialog.showMessageBox({
                message: "Created successfully to " + fileName + ".plume2",
                buttons: ['OK']
              }, function (response) {
                var recent = JSON.parse(localStorage.getItem('recent'));
                recent.unshift(project);
                localStorage.setItem('recent', JSON.stringify(recent));
                if (!this.secureError) {
                  localRouter.push({
                    name: 'EditorPage',
                    params: {
                      project: project
                    }
                  });
                }
              });
            }
          });
        });
      },
      openDocument() {

        var localRouter = this.$router;
        var _project;
        var pass = this.securePass2;

        dialog.showOpenDialog(function (filename) {
          fs.readFile(filename[0], function (err, data) {
            try {
              _project = JSON.parse(data);
              _project.pathFile = filename[0];
              localRouter.push({
                name: 'EditorPage',
                params: {
                  project: _project
                }
              })
            } catch (e) {
              try {
                _project = JSON.parse(CryptoJS.AES.decrypt(data.toString(), pass).toString(CryptoJS.enc.Utf8));
                _project.pathFile = filename[0];
                localRouter.push({
                  name: 'EditorPage',
                  params: {
                    project: _project
                  }
                })
              } catch (e) {
                dialog.showMessageBox({
                  message: "Failed to open. Password is invalid",
                  buttons: ['OK']
                });
              }
            }
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

<style>
  body {
    overflow-y: hidden;
  }

  .icon-dark {
    color: #2c3e50;
  }

  .text-green {
    color: #27ae60;
  }

  .text-blue {
    color: #2980b9;
  }

  .text-red {
    color: #c0392b;
  }
</style>