<template>
  <div v-if="!pageLoading" class="container-fluid mb-5 pb-5">

    <!-- Slideshows  -->
    <slideshow-carousel :images="slides"></slideshow-carousel>

    <!-- Search  -->
    <div class="row my-2">
      <div class="col-md-12">
        <div class="row d-flex justify-content-center">
          <div class="col-7">
            <input type="text" @click="goSearchView()" class="form-control" placeholder="Search in OneKyat">
          </div>
          <div class="col-1 p-0 m-0">
            <button @click="goSearchView()" class="btn btn-primary text-center"><i
                class="fa-solid fa-magnifying-glass"></i></button>
          </div>
        </div>
      </div>
    </div>
    <!-- Category List  -->
    <category-carousel v-if="defaultVar.category.length > 0"></category-carousel>

    <!-- Popular Posts  -->
    <div class="row mt-4" v-if="popularPosts.length > 0">
      <h5 class="text-center"><i class="fa-solid fa-fire"></i> Popular Posts</h5>
      <div class="line-mf mb-2"></div>
      <product-container :posts="popularPosts"></product-container>
    </div>
    <!-- Just For You Posts  -->
    <div class="row mt-4" v-if="forYou.length > 0">
      <h5 class="text-center"> Just For You</h5>
      <div class="line-mf mb-2"></div>
      <product-container :posts="forYou"></product-container>
    </div>
    <!-- Suggest things  -->
    <div v-if="isLogin" id="sellBtn" class=" position-fixed">
      <router-link to="/addPost" class="btn btn-primary"><i class="fa-solid fa-camera"></i>
        ရောင်းမည်</router-link>
    </div>
  </div>
</template>


<script>
import SlideshowCarousel from './caroursel/SlideshowCarousel.vue';
import CategoryCarousel from './caroursel/CategoryCarousel.vue';
import ProductContainer from '../components/ProductContainer.vue'
import { mapGetters, mapState } from 'vuex';
import axios from 'axios';
export default {
  name: 'HomeView',
  data() {
    return {
      slides: [],
      popularPosts: [],
      forYou: [],
    }
  },
  methods: {
    goSearchView() {
      this.$router.push('/search');
    },
    getHomeData() {
      let recentSearch = JSON.parse(localStorage.getItem('recentSearch'));
      if (recentSearch) {
        let data = {
          'recentSearch': recentSearch.slice(Math.max(recentSearch.length - 10, 0)),
        }
        axios.post(this.api + '/home/view/for_you', data, this.authHeader).then(r => {
          this.forYou = r.data.for_you;
        });
      }
      axios.get(this.api + '/home/view', this.authHeader).then(r => {
        this.slides = r.data.slides;
        this.popularPosts = r.data.popular_posts;
      })
    }
  },
  computed: {
    ...mapState(['user', 'defaultVar', 'pageLoading']),
    ...mapGetters(['isLogin', 'api', 'authHeader'])
  },
  components: {
    CategoryCarousel, SlideshowCarousel, ProductContainer
  },
  mounted() {
    this.$store.dispatch('activePage', 'home');
    this.getHomeData();
  },
}
</script>

<style lang="scss" scoped>

</style>