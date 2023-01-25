<template>
  <div class="container-fluid">
    <div class="row d-flex  justify-content-center myPostContainer m-0 p-0">
      <div class="card product_card position-relative rounded   m-1  p-0" v-for="(post, index) in posts" :key="index">
        <img class="image-fluid rounded" :src="imagePath + post.images[0]" alt="post image" srcset="">
        <div @click="goToInfoPage(post.id)" class="card-body bg-gray-glass overflow-hidden">
          <div class="">
            <span class="card-title">{{ post.name }}</span>
            <div class="opacity-75 fs-sm">
              <i class="fa-solid fa-clock me-1"></i>
              <Timeago :datetime="new Date(post.created_at)"></Timeago>
              <small class="float-end"><i class="fa-solid fa-eye ms-3"></i> {{ post.view }}</small>
            </div>
          </div>
          <p class=" card-text">
            <i class="fa-solid fa-dollar-sign"></i> - {{ post.price }} {{ post.mmk }}
          </p>
        </div>
        <div class=" position-absolute top-0 end-0">
          <button v-if="post.like" @click="likeUnlike(post)" class="unFav-btn fs-6"><i
              class="fa-solid fa-heart"></i></button>
          <button v-else @click="likeUnlike(post)" class="fav-btn fs-6"><i class="fa-solid fa-heart"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapState } from 'vuex'
import { Timeago } from 'vue2-timeago'
export default {
  name: 'ProductContainer',
  components: {
    Timeago,
  },
  props: {
    posts: {
      type: Array,
    },
  },
  methods: {
    goToInfoPage(pId) {
      this.$router.push({ name: 'postInfo', params: { id: pId } });
    },
    likeUnlike(post) {
      if (post.like == 1) {
        post.like = 0
      } else {
        post.like = 1
      }
      axios.get(this.api + '/like/like_unlike/' + post.id, this.authHeader).then(r => {
        if (r.data.status == 'like') {
          post.like = true
        } else {
          post.like = false;
        }
        this.$store.dispatch('getFavCount')
      })
    }
  },
  computed: {
    ...mapGetters(['imagePath', 'api', 'authHeader']),
  },
}
</script>

<style lang="scss" scoped>
.myPostContainer img {
  height: 200px;
}
</style>