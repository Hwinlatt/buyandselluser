<template>
    <div v-if="!pageLoading" class="container-fluid my-5">
        <div class="row mt-4">
            <div class="col-md-3"></div>
            <div class="col-md-6 d-flex">
                <input type="search" v-model="searchKey" class="form-control" placeholder="Search My Posts"
                    @keypress.enter="getPost()">
                <button @click="getPost()" class="btn ms-1 btn-primary" title="search"><i
                        class="fa-solid fa-magnifying-glass"></i></button>
                <button data-mdb-toggle="modal" data-mdb-target="#filterMyPostModal" class="btn ms-1 btn-secondary"
                    title="filter"><i class="fa-solid fa-filter"></i></button>
            </div>
        </div>
        <div class="row mt-2" v-if="posts.length > 0">
            <div class="col-md-4  p-2" v-for="(post, index) in posts" :key="index">
                <div class="card m-2 ">
                    <div class="row  m-0 p-0">
                        <div class="col-4 m-0 p-0">
                            <div class="bg-image hover-zoom  shadow-3-primary">
                                <img :src="imagePath + post.images[0]" class="img-fluid w-100"
                                    style="width:150px;height:150px;" alt="">
                            </div>
                        </div>
                        <div class="col m-0 p-2">
                            <h6>{{ post.name }}</h6>
                            <hr>
                            <table>
                                <tr>
                                    <td><small><i class="fa-solid fa-barcode"></i></small></td>
                                    <td><small>PID-{{ post.id }}</small></td>
                                </tr>
                                <tr>
                                    <td><small><i class="fa-solid fa-dollar-sign me-1"></i> </small></td>
                                    <td><small>{{ post.price }} {{ post.mmk }}</small></td>
                                </tr>
                                <tr>
                                    <td><small><i class="fa-solid fa-eye me-1"></i></small></td>
                                    <td><small class="badge bg-primary">{{ post.view }} views</small></td>
                                </tr>
                                <tr>
                                    <td><small><i class="fa-solid fa-heart"></i></small></td>
                                    <td><small><span class="text-primary cursor-pointer" data-mdb-toggle="modal"
                                                data-mdb-target="#whoLikePost" @click="getLikeUser(post.id)">{{
                                                    post.post_like_count
                                                }}</span></small>
                                    </td>
                                </tr>
                            </table>
                            <!-- <small><i class="fa-solid fa-barcode"></i> - (PID-{{ post.id }})</small><br>
                            <small><i class="fa-solid fa-dollar-sign me-1"></i> - {{ post.price }} {{
                                post.mmk
                            }}</small><br>
                            <small><i class="fa-solid fa-eye me-1"></i> - {{ post.view }} views</small><br> -->
                        </div>
                    </div>
                    <div class="row m-0 p-0" style="background:#424242">
                        <div class="col m-0 p-0">
                            <button @click="deletePost(post.id)" class="btn btn-link w-100"><i
                                    class="fa-solid fa-trash"></i> <br> Delete</button>
                        </div>
                        <div class="col m-0 p-0">
                            <button v-if="post.status == '1'" @click="soldOut(post)" class="btn btn-link w-100">
                                <i class="fa-solid fa-handshake"></i> <br>
                                Soldout</button>
                            <button v-else @click="reSold(post)" class="btn btn-link w-100">
                                <i class="fa-solid fa-arrow-rotate-left"></i> <br>
                                Resold</button>
                        </div>
                        <div class="col m-0 p-0">
                            <button @click="morePostInfo(post.id)" class="btn btn-link w-100"><i
                                    class="fa-solid fa-ellipsis"></i> <br> More</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center my-3" v-if="canGetMorePost">
                <a href="#" class="w-100" @click="morePost">...More</a>
            </div>
        </div>
        <div class="row mt-4" v-else>
            <h4 class="text-center text-muted">{{ posts_status }}</h4>
        </div>
        <div v-if="isLogin" id="sellBtn" class=" position-fixed">
            <router-link to="/addPost" class="btn btn-primary"><i class="fa-solid fa-camera"></i>
                ရောင်းမည်</router-link>
        </div>
        <!-- Filter Modal -->
        <div class="modal fade" id="filterMyPostModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Filter</h5>
                        <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row ">
                            <div class="col-3 d-flex align-items-center"><i class="fa-solid fa-filter me-1"></i> Status
                            </div>
                            <select v-model="filter.status" class="form-select col">
                                <option value="">All</option>
                                <option value="1">In stock</option>
                                <option value="0">Sold out</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary closeFilterBtn"
                            data-mdb-dismiss="modal">Close</button>
                        <button @click="getPost('moreData')" type="button" class="btn btn-primary">Filter</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Who Like Your Post Modal -->
        <div class="modal fade" id="whoLikePost" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Liked Users</h5>
                        <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <ul v-if="like_users.length > 0" class="list-group list-group-light list-group-small">
                                <li @click="goToProfile(u.user_id)" v-for="(u, index) in like_users" :key="index"
                                    class="list-group-item cursor-pointer">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <img v-if="u.profile_photo_path" :src="imagePath + u.profile_photo_path"
                                                class="img-40" alt="">
                                            <img v-else :src="defaultProfile(u.name)"
                                                class="img-40 rounded rounded-circle" alt="">
                                        </div>
                                        <span class="d-block ms-2">{{ u.name }}</span> <small class="text-muted ms-3">  <i class="fa-solid fa-clock"></i> <Timeago :datetime="new Date(u.created_at)"></Timeago></small>
                                    </div>
                                </li>
                            </ul>
                            <h5 v-else class="text-muted text-center my-4">{{ like_users_get_status }}</h5>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary closeWhoLikePostBtn"
                            data-mdb-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapState } from 'vuex'
import useFunction from '@/src/js/custom'
import {Timeago} from 'vue2-timeago'
import $ from 'jquery'
export default {
    name: 'MyPostView.vue',
    components: {
        Timeago,
    },
    data() {
        return {
            limit: 9,
            searchKey: '',
            like_users: [],
            like_users_get_status: '',
            filter: {
                status: ''
            },
            totalPosts: 0,
            posts: [],
            posts_status: ''
        }
    },
    methods: {
        getPost(status) {
            this.posts_status = 'Please Wait ...';
            if (status != 'moreData') {
                this.$store.dispatch('pageLoadingState', true);
            }
            axios.get(this.api + '/post/my_posts?limit=' + this.limit + '& search=' + this.searchKey + '& status=' + this.filter.status
                , this.authHeader).then(r => {
                    this.totalPosts = r.data.total;
                    this.posts_status = 'There is nothing to show';
                    this.posts = r.data.posts;
                    if (!status != 'moreData') {
                        this.$store.dispatch('addCache', { name: 'my_posts', data: r.data.posts })
                    }
                    this.$store.dispatch('pageLoadingState', false);
                }).catch(err => {
                    useFunction.error(err, this.$swal);
                    if (!status != 'moreData') {
                        this.$store.dispatch('pageLoadingState', false);
                    }
                })
        },
        morePostInfo(postId) {
            this.$router.push({ name: 'postInfo', params: { id: postId } })
        },
        morePost(e) {
            if (this.canGetMorePost) {
                e.preventDefault();
                this.limit += 9;
                this.getPost('moreData')
            }
        },
        deletePost(pid) {
            this.$swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.get(this.api + '/post/delete/' + pid, this.authHeader).then(r => {
                        useFunction.alert(r.data, this.$swal);
                        if (r.data.success) {
                            this.getPost('moreData');
                        }
                    }).catch(err => {
                        useFunction.error(err, this.$swal)
                    })
                }
            })
        },
        soldOut(post) {
            axios.get(this.api + '/post/soldout/' + post.id, this.authHeader).then(r => {
                post.status = r.data.status;
            }).catch(err => { useFunction.alert(err, this.$swal) });
        },
        reSold(post) {
            axios.get(this.api + '/post/resold/' + post.id, this.authHeader).then(r => {
                post.status = r.data.status;
            }).catch(err => { useFunction.alert(err, this.$swal) });
        },
        getLikeUser(id) {
            this.like_users = [];
            this.like_users_get_status = "Please Wait ...";
            axios.get(this.api + '/like/who_like/' + id, this.authHeader).then(r => {
                this.like_users = r.data;
                this.like_users_get_status = "There is nothing to show.";
            }).catch(err => {
                useFunction.error(err, this.$swal);
            })

        },
        defaultProfile(name) {
            return useFunction.getProfileImage(name)
        },
        goToProfile(uId) {
            $('.closeWhoLikePostBtn').click();
            this.$router.push({ name: 'profile', params: { id: uId } })
        }
    },
    computed: {
        ...mapGetters(['api', 'authHeader', 'imagePath', 'isLogin']),
        ...mapState(['cacheData', 'pageLoading']),
        canGetMorePost() {
            return this.totalPosts > this.limit
        },

    },
    mounted() {
        this.$store.dispatch('activePage', 'my_posts');
        // if (this.cacheData.my_posts) {
        //     this.posts = this.cacheData.my_posts
        // } else {
        this.getPost();
        // }
    },
}
</script>

<style lang="scss" scoped>

</style>