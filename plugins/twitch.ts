import Vue from 'vue'
import {StaticAuthProvider} from "twitch-auth";
import {ChatClient} from "twitch-chat-client";
import {Context} from "@nuxt/types";

declare module '@nuxt/types' {
  interface Context {
    $chatClient: ChatClient
  }
}


const twitchChatClient: (context: Context) => void = async (context: Context) => {
  const auth = new StaticAuthProvider(
    context.$config.clientId,
    context.$config.accessToken,
  );
  context.$chatClient = new ChatClient(auth, {
    channels: [context.$config.channel]
  });
  await context.$chatClient.connect();
}

export default twitchChatClient
