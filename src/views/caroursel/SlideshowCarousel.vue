<template>
  <Carousel v-if="images">
    <Slide v-for="(slide, index) in images" :key="index">
      <div class="carousel__item position-relative" style="width:100%">
        <a :href="slide.link" class="w-100">
          <img class="img-fluid w-100" :src="imagePath + slide.image" alt="" srcset="">
        </a>
        <div class="imageText">
          <h4>{{ slide.title }}</h4>
        </div>
      </div>
    </Slide>
    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<script>
import { defineComponent } from 'vue'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'SlideshowCarousel',
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  props: {
    images: {
      type: Array,
    },
  },
  computed: {
    ...mapGetters(['imagePath'])
  },
})
</script>





<style>
.imageText {
  position: absolute;
  padding: 10px;
  bottom: 30px;
  /* From https://css.glass */
  background: rgba(45, 33, 33, 0.26);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.carousel__item img {
  min-height: 200px;
  max-height: 500px;
  /* object-fit: contain; */
}

.carousel__item {
  min-height: 200px;
  max-height: 500px;
  width: 100%;
  background-color: var(--vc-clr-primary);
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 10px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: none;
  color: white;
}

.carousel__prev:hover,
.carousel__next:hover {
  color: white;
}
</style>
