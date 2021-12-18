<template>
  <div>
    <div v-if="winningEntry != null">
      <h1>Momentane Challenge</h1>
      <h3>{{ winningEntry.title }} ({{ winningEntry.votes }} Votes)</h3>
    </div>
    <br/>
    <div v-if="currentPoll">
      <h1>{{ currentPoll.title }}</h1>
      <template v-for="entry in currentPoll.entries">
        <h3>{{ entry.title }}</h3>
        <v-progress-linear v-bind:value="getPercentage(entry)" color="blue" height="25">
          <strong>{{ entry.votes * 100 }}%</strong>
        </v-progress-linear>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, useContext} from '@nuxtjs/composition-api'
import {PollEntry} from "~/Entities/PollEntry";
import {Poll} from "~/Entities/Poll";
import {Context} from "@nuxt/types";
//https://twitchtokengenerator.com/quick/J5I2iG67Xg
let votePhase = ref(true);
let winningEntry = ref<PollEntry>();
let alreadyVoted = ref<Array<string>>(new Array<string>());
let currentPoll = ref<Poll>();
let timer;
let pollTriggered = false;

export default defineComponent({
  setup() {
    const context = useContext();
    const chatClient = context.$chatClient;
    chatClient.onMessage((channel, user, message, msg) => {
      if (!votePhase)
        return;

      if (!/^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/.test(message))
        return;

      const number = Number.parseInt(message);

      if (number <= 0)
        return;

      if (alreadyVoted.value.includes(user))
        return;

      alreadyVoted.value.push(user);
      currentPoll.value.entries[number - 1].votes += 1;
    });

    return {
      currentPoll,
      winningEntry,
      alreadyVoted
    }
  },
  asyncData(ctx: Context): Promise<object | void> | object | void {
    const questions = ctx.$config.questions;
    const entryCount = ctx.$config.entryCount;
    const pollTitle = ctx.$config.pollTitle;
    const pollDuration = ctx.$config.pollDuration;
    const repeatEvery = ctx.$config.repeatEvery;

    if (!localStorage.getItem('startPoll'))
      localStorage.setItem('startPoll', 'true');

    setInterval(() => {
      const startPoll = localStorage.getItem('startPoll') == 'true';

      if (!startPoll)
        return;

      if (pollTriggered)
        return;

      pollTriggered = true;
      alreadyVoted.value = [];

      const pollEntries: PollEntry[] = [];

      while (pollEntries.length < entryCount) {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        if (pollEntries.filter(entry => entry.title === randomQuestion).length === 0)
          pollEntries.push(new PollEntry(randomQuestion));
      }

      currentPoll.value = new Poll(pollTitle, pollEntries);

      setTimeout(() => {
        winningEntry.value = currentPoll.value?.entries.sort(entry => entry.votes)[0];
        currentPoll.value = null
      }, pollDuration) //pollDuration

      setTimeout(() => pollTriggered = false, repeatEvery);
    }, 100);

  },
  methods: {
    getPercentage(entry: PollEntry) {
      return (entry.votes / alreadyVoted.value.length) * 100;
    }
  }
})
</script>
