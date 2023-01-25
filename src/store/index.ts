import { createStore } from 'vuex'
import axios from 'axios';
export default createStore({
  state: {
    notificationCount: 0,
    serverDelayTime: 1000,
    favCount: 0,
    pageLoading: false,
    activePage: 'home',
    server: 'http://buyandsell.hellolinker.net',
    token: localStorage.getItem('token'),
    user: {
      email_verified_at: null,
    },
    defaultVar: {
      region: '',
      city: '',
      category: '',
    },
    cacheData: {
      my_posts: '',
      searchPage: {},
    }
  },
  getters: {
    api(state) {
      return state.server + '/api'
    },
    imagePath(state) {
      return state.server + '/storage/images/'
    },
    isLogin(state) {
      if (state.token) {
        return true;
      }
      return false;
    },
    authHeader(state) {
      return {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + state.token,
          'Content-Type': 'multipart/form-data'
        }
      }
    },

  },
  mutations: {

  },
  actions: {
    activePage({ state }, value) {
      state.activePage = value;
    },
    storeUser({ state }, value) {
      state.user = value.user;
      this.dispatch('getData');
      localStorage.setItem('verified_at', value.user.email_verified_at);
      if (value.token) {
        state.token = value.token;
        localStorage.setItem('token', value.token);
      }
    },
    getUser({ state, getters }) {
      this.state.pageLoading = true;
      axios.get(getters.api + '/user', getters.authHeader).then(r => {
        state.user = r.data;
        this.dispatch('getData');
        localStorage.setItem('verified_at', r.data.email_verified_at);
        this.state.pageLoading = false;
      }).catch(err => {
        console.log(err);
        if (err.response.statusText == 'Unauthorized') {
          localStorage.removeItem('token');
          state.user = {
            email_verified_at: null,
          };
          state.token = '';
        }
        this.state.pageLoading = false;
      })
    },
    getDefaultApi({ state }, value) {
      state.defaultVar = {
        region: value.region,
        city: value.city,
        category: value.category,
      }
    },
    pageLoadingState({ state }, value) {
      state.pageLoading = value;
    },
    getFavCount({ state, getters }) {
      if (getters.isLogin) {
        axios.get(this.getters.api + '/like/count', getters.authHeader).then(r => {
          state.favCount = r.data;
        }).catch(err => {
          console.log(err.response);
          console.log(err.response.statusText);

        })
      }
    },
    getNotiCount({ state, getters }) {
      axios.get(getters.api + '/notification/count', getters.authHeader).then(r => {
        state.notificationCount = r.data;
      })
    },
    // name and data 
    addCache({ state }, ...value) {
      value.forEach(v => {
        if (v.name == 'my_posts') {
          state.cacheData.my_posts = v.data;
        } else if (v.name == 'searchPage') {
          state.cacheData.searchPage = v.data
        }
      });
    },

    //same functions
    getData() {
      setTimeout(() => {
        this.dispatch('getFavCount');
        this.dispatch('getNotiCount');
      }, 1000);
    }

  },
  modules: {

  }
})
