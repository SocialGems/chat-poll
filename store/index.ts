export const state = () => ({
  startPoll: false
})

export const mutations = {
  startPoll(state) {
    state.startPoll = true;
  },
  stopPoll(state) {
    state.startPoll = true;
  }
}
