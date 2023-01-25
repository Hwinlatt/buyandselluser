<template>
    <div class="container-fluid">
        <action-bar-vue :title="'Category By '+ category"></action-bar-vue>
        <product-container v-if="posts.length > 0" :posts="posts"></product-container>
        <div class="row" v-if="pageStart">
            <div class="col-md-12">
                <h4 class="text-muted my-5 text-center">Please Wait ... </h4>
            </div>
        </div>
        <div class="row" v-if="noData">
            <div class="col-md-12">
                <h4 class="text-muted my-5 text-center">There is nothing to show.</h4>
            </div>
        </div>
    </div>
</template>

<script>
import ProductContainer from '@/components/ProductContainer.vue';
import ActionBarVue from '@/components/ActionBar.vue';
import axios from 'axios';
import { mapGetters, mapState } from 'vuex';
    export default {
        name:'CategoryView',
        components: {
            ProductContainer,ActionBarVue
        },
        data() {
            return {
                pageStart:true,
                posts: [],
                total_post:0,
                category:'',
                limit:8,
            }
        },
        methods: {
            getByCategory() {
                this.pageStart = true;
                axios.get(this.api+'/posts/category/'+this.$route.params.id+'?limit='+this.limit,this.authHeader).then(r=>{
                    this.posts = r.data.posts;
                    this.total_post = r.data.total;
                    this.category = r.data.category.name
                    this.pageStart = false;
                })
            },
            seeMore(e){
                e.preventDefault();
                if (this.total_post >  this.limit) {
                    this.limit+=8;
                    this.getByCategory();
                }
            }
        },
        computed: {
            ...mapGetters(['api','authHeader']),
            ...mapState(['defaultVar']),
            noData(){
                if (!this.pageStart && this.posts.length == 0) {
                    return true;
                }
                return false;
            }
        },
        mounted () {
            this.getByCategory();
        },
    }
</script>

<style lang="scss" scoped>

</style>