<template>
  <div>
 
    <div class="flex">
      <div class="l-block w-3/4 text-center">
        <p class="roboto-light">Plume 2</p>
        <div class="btns">
          <div class="px-4 m-10">
            <div class="flex -mx-2">
              <div class="w-1/2 px-2">
                <button @click="createBlank" class="appBtn bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
                  <i class="fas fa-lg fa-file text-blue"></i>
                  <span class="text-black">Create blank document</span>
                </button>
              </div>
              <div class="w-1/2 px-2">
                <button class="appBtn bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
                  <i class="fas fa-lg fa-book text-green"></i>
                  <span class="text-black">Create book document</span>
                </button>
              </div>
            </div>
          </div>
          <div class="px-4 m-10">
            <div class="flex -mx-2">
              <div class="w-1/2 px-2">
                <button class="appBtn bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
                  <i class="fas fa-lg fa-lock"></i>
                  <span class="text-black">Create secure document</span>
                </button>
              </div>
              <div class="w-1/2 px-2">
                <button class="appBtn bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
                  <i class="fas fa-lg fa-atom text-red"></i>
                  <span class="text-black">Create scientific document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr class="divider">
        <button class="m-10 appBtn bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
          <i class="fas fa-lg fa-file text-indigo"></i>
          <span class="text-black">Open document</span>
        </button>
      </div>
      <div class="r-block w-1/4 text-center">
        <p class="light-text m-5">Recent projects</p>
        <!-- <editor-page></editor-page> -->
        <router-link to="/editor">Proceed to editor</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    remote
  } from 'electron';

  import EditorPage from './EditorPage';

  export default {
    name: 'landing-page',
    components: {
      EditorPage
    }
  }
</script>