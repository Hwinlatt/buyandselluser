<template>
    <Carousel :items-to-show="2.5" :wrap-around="true">
        <Slide v-for="(image, index) in images" :key="index">
            <div class="carousel__item">
                <a target="_black" :href="imagePath + image"><img  class="img-fluid w-100" style="height:30vh;object-fit: contain;" :src="imagePath + image" alt="" srcset=""></a>
            </div>
        </Slide>

        <template #addons>
            <Navigation />
            <Pagination/>
        </template>
    </Carousel>
</template>

<script>
import { defineComponent } from 'vue'
import { Carousel, Navigation,Pagination, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'
import { mapGetters } from 'vuex'

export default defineComponent({
    name: 'WrapAround',
    props: {
        images: {
            type: Array,
        },
    },
    computed: {
        ...mapGetters(['imagePath'])
    },
    components: {
        Carousel,
        Slide,
        Navigation,
        Pagination
    },
})
</script>

<style scoped>
.carousel__slide--active {
    margin : 0px;
    padding: 0px;
}
</style>
