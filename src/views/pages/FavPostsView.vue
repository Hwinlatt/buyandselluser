<template>
    <div class="container-fluid" v-if="!pageLoading">
        <ActionBar title="Favorite posts"></ActionBar>
        <div class="row">
            <div class="col-md-2"></div>
            <div class="col-md-8">
                <ul class="list-group list-group-light" v-if="favPosts.length > 0">
                    <li style="background:#262626" class="list-group-item" v-for="(post, index) in favPosts"
                        :key="index">
                        <div class="d-flex flex-wrap justify-content-between align-items-center">
                            <div @click="gotoPostInfo(post.post_id)" class="d-flex align-items-center cursor-pointer">
                                <img class="favPostImage"
                                    :src="imagePath+post.images[0]"
                                    alt="">
                                <div class="ms-3">
                                    <span>{{ post.name }}</span><br>
                                    <small class="opacity-75 fs-sm">
                                        Post . {{ post.images.length }} Photo . {{ post.username }}<br>
                                        Liked <Timeago :datetime="new Date(post.created_at)"></Timeago>
                                    </small>
                                </div>
                            </div>
                            <div class="my-1 text-end w-100">
                                <button :class="{ 'd-none': !post.removeBtn }" class="btn btn-danger"
                                    @click="removeFav(post, index)" title="remove from favorite">Remove</button>
                                <button :class="{ 'd-none': post.removeBtn }" class="btn btn-danger" type="button"
                                    disabled>
                                    <span class="spinner-border spinner-border-sm" role="status"
                                        aria-hidden="true"></span>
                                    Removing...
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="" v-else>
                    <h5 class=" text-muted text-center mt-5 user-select-none">There is nothing to show</h5>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapState } from 'vuex'
import useFunction from '@/src/js/custom'
import { Timeago } from 'vue2-timeago'
import ActionBar from '@/components/ActionBar.vue'
export default {
    name: 'FavPostsView',
    components: {
        ActionBar, Timeago
    },
    data() {
        return {
            favPosts: [],
        }
    },
    methods: {
        getFavPost() {
            this.$store.dispatch('pageLoadingState', true)
            axios.get(this.api + '/like/byUser/get', this.authHeader).then(r => {
                this.$store.dispatch('pageLoadingState', false)
                this.favPosts = r.data
            }).catch(err => {
                useFunction.error(err, this.$swal)
                this.$store.dispatch('pageLoadingState', false)
            })
        },
        gotoPostInfo(pId) {
            this.$router.push({ name: 'postInfo', params: { id: pId } })
        },
        removeFav(post, index) {
            post.removeBtn = false;
            axios.get(this.api + '/like/like_unlike/' + post.post_id, this.authHeader).then(r => {
                this.$store.dispatch('getFavCount');
                if (r.data.status == 'unlike') {
                    this.favPosts.splice(index, 1);
                }
            }).catch(err => {
                useFunction.error(err, this.$swal);
                post.removeBtn = false;
            })
        }
    },
    computed: {
        ...mapState(['pageLoading']),
        ...mapGetters(['api', 'authHeader', 'imagePath'])
    },
    mounted() {
        this.getFavPost();
    },
}
</script>

<style lang="scss" scoped>
.favPostImage {
    height: 120px;
    width: 120px;
}
</style>