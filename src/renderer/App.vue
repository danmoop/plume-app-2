<template>
  <div id="app">
       <ul class="list-reset flex-row-reverse flex appNav">
      <li class="mr-3">
        <button @click="closeWindow" class="navBtn bg-grey-light text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fas fa-times"></i>
        </button>
      </li>
      <li class="mr-3">
        <button @click="maximizeWindow" class="navBtn bg-grey-light text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fas fa-window-maximize"></i>
        </button>
      </li>
      <li class="mr-3">
        <button @click="minimizeWindow" class="navBtn bg-grey-light text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
          <i class="fas fa-window-minimize"></i>
        </button>
      </li>
    </ul>
    <transition enter-active-class="animated fadeIn">
      <router-view/>
    </transition>
  </div>
</template>

<script>

  import {remote} from 'electron';

  export default {
    name: 'plume2',
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
      createBlank() {
        alert(EditorPage);
      }
    }
  }
</script>

<style>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css');
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
  @import url('https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css');
  @import url('https://fonts.googleapis.com/css?family=Roboto:100|Roboto');
  @import url('https://use.fontawesome.com/releases/v5.5.0/css/all.css');

  body {
    overflow-y: hidden;
  }

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

  .roboto-light-sm{
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

  *:focus {
    outline: 0 !important;
  }
</style>