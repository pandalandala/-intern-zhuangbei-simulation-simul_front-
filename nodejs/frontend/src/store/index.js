// store/index.js
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      nodes: [],
      edges: [],
      errorMessage: "",
      successMessage: "",
    };
  },
  mutations: {
    setNodes(state, nodes) {
      state.nodes = nodes;
    },
    setEdges(state, edges) {
      state.edges = edges;
    },
    removeNode(state, id) {
      const array = state.nodes.filter(item => item.id !== id); 
      state.nodes = array;
    },
    removeEdge(state, id) {
      console.log(state.edges);
      const array = state.edges.filter(item => item.id !== id); 
      state.edges = array;
    },
    setErrorMessage(state, message) {
      state.errorMessage = message;
    },
    setSuccessMessage(state, message) {
      state.successMessage = message;
    }
  },
  actions: {
    showError({ commit }, message) {
      commit('setErrorMessage', message);
      setTimeout(() => {
        commit('setErrorMessage', ''); // 5秒后清空消息
      }, 5000);
    },
    showSuccess({ commit }, message) {
      commit('setSuccessMessage', message);
      setTimeout(() => {
        commit('setSuccessMessage', ''); // 5秒后清空消息
      }, 5000);
    },
  }
});

export default store;
