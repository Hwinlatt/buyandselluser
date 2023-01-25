<template>
    <div class="">
        <h5 class="text-center">Categories</h5>
        <div class="line-mf"></div>

        <div class="my-2">
            <Carousel :settings="settings" :breakpoints="breakpoints" :items-to-show="9">
                <Slide v-for="(category, index) in defaultVar.category" :key="index">
                    <div class="carousel__item my-2 p-1">
                        <div @click="showByCategory(category.id)" class="cursor-pointer">
                            <span v-html="category.icon"></span>
                            <div>{{ category.name }}</div>
                        </div>
                    </div>
                </Slide>

                <template #addons>
                    <Navigation />
                </template>
            </Carousel>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'
import { mapState } from 'vuex'

export default defineComponent({
    name: 'CategoryCarousel',
    components: {
        Carousel,
        Slide,
        Navigation,
    },
    data: () => ({
        // carousel settings
        settings: {
            transition: 300,
            itemsToShow: 1,
            snapAlign: 'center',
            autoplay: 4000,
            pauseAutoplayOnHover: true,
        },
        // breakpoints are mobile first
        // any settings not specified will fallback to the carousel settings
        breakpoints: {
            // 700px and up
            100: {
                itemsToShow: 3,
                snapAlign: 'center',
                itemsToScroll: 3,
            },
            700: {
                itemsToShow: 3.5,
                snapAlign: 'center',
                itemsToScroll: 3,
            },
            // 1024 and up
            1024: {
                itemsToShow: 5,
                snapAlign: 'start',
                itemsToScroll: 5,
            },
        },
    }),
    methods: {
        //Go To Category View FilerBy Category
        showByCategory(cId) {
            this.$router.push({name:'category',params:{id:cId}})
        }
    },
    computed: {
        ...mapState(['defaultVar'])
    },
})
</script>


<style lang="scss" scoped>

</style>
