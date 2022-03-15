<template>
  <div>
    <v-btn color="green" @click="startPoll">Poll ON</v-btn>
    <v-btn color="red" @click="stopPoll">Poll OFF</v-btn>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, useContext} from '@nuxtjs/composition-api'
//https://twitchtokengenerator.com/quick/J5I2iG67Xg
let votePhase = ref(true);

export default defineComponent({
  methods: {
    startPoll(){
      localStorage.setItem('startPoll', 'true');
    },
    stopPoll(){
      localStorage.setItem('startPoll', 'false');
    }
  }
})
</script>
