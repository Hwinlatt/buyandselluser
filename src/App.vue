<template>
  <nav-bar></nav-bar>
  <div v-if="pageLoading" class="d-flex align-items-center justify-content-center" :style="{ 'height': loadingHeight }"
    style="z-index: 101;">
    <div>
      <scale-loader :color="'#1266F1'"></scale-loader>
    </div>
  </div>
  <!-- is not loading -->
  <div>
    <div v-if="!pageLoading">
      <div v-if="!isVerification" class="alert alert-warning" role="alert">
        Your Email is not verification! <router-link to="/verification">Verification Now</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters, mapState } from 'vuex';
import NavBar from './components/NavBar.vue';
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import $ from 'jquery'
export default {
  name: 'AppView',
  data() {
    return {
      loadingHeight: '',
      notification: '',
    }
  },
  components: { ScaleLoader, NavBar },
  computed: {
    ...mapGetters(['isLogin', 'api']),
    ...mapState(['pageLoading', 'user']),
    isVerification() {
      if (!this.user.email_verified_at && this.isLogin) {
        return false;
      }
      return true;
    }
  },
  methods: {
    getUser() {
      if (this.isLogin) {
        this.$store.dispatch('getUser');
      }
    },
    getDefaultApi() {
      axios.get(this.api + '/default/api').then(r => {
        this.$store.dispatch('getDefaultApi', r.data)
      })
    }, remainHeight() {
      let navHeight = $('.main_nav_bar').innerHeight();
      let windowHeight = window.innerHeight;
      this.loadingHeight = windowHeight - navHeight + 'px'
    },
    notiSection() {
      // eslint-disable-next-line no-undef
      var pusher = new Pusher('07ab30e1c3f6f92fbf9b', {
        cluster: 'ap1'
      });
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let this2 = this;
      var channel = pusher.subscribe('noti-channel');
      channel.bind('noti-user', function (data) {
        data = JSON.stringify(data);
        let message = JSON.parse(data);
        message = JSON.parse(message.message);
        if (message.user_id == this2.user.id) {
          this2.$store.dispatch('getNotiCount');
          Notification.requestPermission().then(permission => {
            if (permission == 'granted') {
              var notification = new Notification('Notification', {
                body: message.body,
                icon: 'path/to/icon.png'
              });
            }
          })
        }
      });
    }
  },
  created() {
    this.getUser();
    this.getDefaultApi();
  },
  mounted() {
    this.remainHeight();
    this.notiSection();
    if (this.isLogin) {
      this.$store.dispatch('getNotiCount')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>