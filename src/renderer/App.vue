<template>
  <div id="app">
    <ul class="list-reset flex justify-between appNav" v-if="!exporting">
      <li class="mr-3">
        <button @click="goBack" v-if="editActive" class="navBtn text-center bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
          <i class="fas fa-arrow-left"></i>
        </button>
        <button v-if="editActive" class="font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fas fa-lock text-red" v-if="projectType == 'secure'"></i>
          <i class="fas fa-file text-blue" v-if="projectType == 'blank'"></i>
          <i class="fas fa-book text-green" v-if="projectType == 'book'"></i>
          {{activeDocumentName}}
        </button>
      </li>
      <li class="mr-3">
        <button v-if="editActive" class="text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
          Words: {{wordsAmount}}
        </button>
        <button v-if="editActive" class="text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
          Characters: {{symbolsAmount}}
        </button>
      </li>
      <li class="mr-3">
        <button @click="minimizeWindow" class="navBtn bg-grey-light text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fas fa-window-minimize"></i>
        </button>
        <button @click="maximizeWindow" class="navBtn bg-grey-light text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fas fa-window-maximize"></i>
        </button>
        <button @click="closeWindow" class="navBtn bg-grey-light text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fas fa-times"></i>
        </button>
      </li>
    </ul>
    <transition enter-active-class="animated fadeIn">
      <router-view />
    </transition>
  </div>
</template>

<script>
  import {
    remote
  } from 'electron';

  export default {
    name: 'plume2',
    data() {
      return {
        activeDocumentName: null,
        wordsAmount: 0,
        symbolsAmount: 0,
        editActive: false,
        projectType: '',
        exporting: false
      }
    },
    methods: {
      minimizeWindow() {
        remote.getCurrentWindow().minimize();
      },
      closeWindow() {
        remote.getCurrentWindow().close();
      },
      maximizeWindow() {
        remote.getCurrentWindow().maximize();
      },
      goBack() {
        this.$router.push('landing-page');
        this.editActive = false;
        this.symbolsAmount = 0;
        this.wordsAmount = 0;
      }
    },
    mounted() {
      this.$root.$on('setDocName', (name) => {
        this.activeDocumentName = name;
        this.editActive = true;
      });
      this.$root.$on('setNums', (symNum, wordNum) => {
        this.symbolsAmount = symNum;
        this.wordsAmount = wordNum;
      });
      this.$root.$on('setProjectType', (type) => {
        this.projectType = type;
      });
      this.$root.$on('export', () => {
        this.exporting = true;
      });
      this.$root.$on('exportFinished', () => {
        this.exporting = false;
      });
    }
  }
</script>

<style>

  @page {
    height: 100vh;
  }

  @import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css');
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  @import url('https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css');
  @import url('https://fonts.googleapis.com/css?family=Roboto:100|Roboto');
  @import url('https://use.fontawesome.com/releases/v5.5.0/css/all.css');
  @import url('https://fonts.googleapis.com/css?family=Quicksand:500,700');

  .r-block {
    background: #f5f5f5;
    height: 100vh;
  }

  .l-block {
    background-color: #fff;
  }

  .roboto-light {
    padding-top: 2rem;
    font-size: 5em;
    font-family: Roboto;
    font-weight: 100;
  }

  .roboto-light-sm {
    font-family: Roboto;
  }

  .light-text {
    font-family: Roboto;
    font-size: 1.5em;
    padding-top: 1rem;
  }

  .btns {
    margin-top: calc(30vh - 6rem);
  }

  .navBtn {
    -webkit-app-region: no-drag;
  }

  .navBtn:hover {
    transition: 0.3s;
    background: rgb(211, 211, 211);
  }

  .navBtn:not(:hover) {
    transition: 0.3s;
    background: transparent;
  }

  .appBtn:hover {
    transition: 0.3s;
    background: rgb(240, 240, 240);
  }

  .appBtn:not(:hover) {
    transition: 0.3s;
    background: transparent;
  }

  .appNav {
    background-color: rgb(235, 235, 235);
    -webkit-app-region: drag;
  }

  .divider {
    background: #eeeded;
    padding: 1px;
  }

  * {
    user-select: none !important;
  }

  *:focus {
    outline: 0 !important;
  }

  .q {
    font-family: Quicksand;
    font-weight: 700;
  }
</style>