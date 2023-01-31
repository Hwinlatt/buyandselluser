<template>
    <div class="container-fluid" v-if="!pageLoading">
        <action-bar-vue :title="'Post Description'">
            <div class="dropdown me-3" v-if="user.id == sellUser.id">
                <span class="btn btn-link btn-sm  dropdown-toggle" type="button" id="postAction"
                    data-mdb-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fs-5 fa-ellipsis"></i>
                </span>
                <ul class="dropdown-menu" aria-labelledby="postAction">
                    <li><router-link class="dropdown-item cursor-pointer"
                            :to="{ name: 'editPost', params: { id: post.id } }"><i
                                class="fa-solid fa-pen-to-square"></i>
                            Edit</router-link></li>
                    <li><span class="dropdown-item cursor-pointer" @click="deletePost(post.id)" href="#"><i
                                class="fa-solid fa-trash"></i> Delete</span>
                    </li>
                </ul>
            </div>
            <div class="me-2" v-else>
                <span class="btn btn-link btn-sm" data-mdb-toggle="modal" data-mdb-target="#reportPostToAdmin"><i
                        class="fa-solid fa-triangle-exclamation"></i> Report
                    Post</span>
            </div>
        </action-bar-vue>
        <images-carousel v-if="post.images" :images="post.images"></images-carousel>
        <div class="row mt-2">
            <div class="col-md-1"></div>
            <div class="col-md-10">
                <div class="card rounded shadow ">
                    <div class="card-header glassEffect">
                        <!-- More Action Btn -->
                        <div class="float-end d-flex">
                            <div class="">
                                <button v-if="post.like" @click="likeUnlike(post)" class="unFav-btn fs-6"><i
                                        class="fa-solid fa-heart"></i></button>
                                <button v-else @click="likeUnlike(post)" class="fav-btn fs-6"><i
                                        class="fa-solid fa-heart"></i></button>
                                <small class="ms-1 text-muted">{{ post.post_like_count }}</small>
                            </div>
                        </div>
                        <div>
                            <div>
                                {{ post.name }}
                                <span v-if="post.status == '1'" class="badge bg-success ms-2">Available</span>
                                <span v-else class="badge bg-danger ms-2">Soldout</span>
                            </div>
                            <div>
                                <small class="text-muted"><i class="fa-solid fa-clock"></i> <Timeago :datetime="new Date(post.created_at)"></Timeago></small>
                            </div>
                        </div>

                    </div>
                    <div class="card-body position-relative">
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><i class="fa-solid fa-barcode"></i></td>
                                        <td><span class="ms-2">PID-{{ post.id }}</span></td>
                                    </tr>
                                    <tr>
                                        <td><i class="fa-solid fa-dollar-sign"></i></td>
                                        <td><span class="ms-2">{{ post.price }} {{ post.mmk }}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="my-3" v-if="post.additional">
                                <h6 for="">Other Information</h6>
                                <tbody>
                                    <tr v-if="post.additional.brand">
                                        <td>Brand</td>
                                        <td><span class="ms-2">{{ post.additional.brand }}</span></td>
                                    </tr>
                                    <tr v-if="post.additional.model">
                                        <td>Model</td>
                                        <td>
                                            <span class="ms-2">
                                                {{ post.additional.model }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="post.additional.type">
                                        <td>Type</td>
                                        <td><span class="ms-2 badge bg-primary">{{ post.additional.type }}</span></td>
                                    </tr>
                                    <tr v-if="post.additional.fashionType">
                                        <td>Type</td>
                                        <td><span class="ms-2 badge bg-primary">{{ post.additional.fashionType }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </div>
                            <label class="fw-bold mt-3"> Description</label>
                            <p class="text-muted">
                                <small v-html="post.description"></small>
                            </p>
                        </div>
                        <small class=" float-end opacity-75"><i class="fa-solid fa-eye"></i> {{ post.view }}</small>
                        <!-- <button v-if="post.adjust_price > 0" class="btn btn-sm btn-dark btn-rounded">Adjust the
                            price</button> -->
                    </div>
                </div>
            </div>
            <div class="col-md-1"></div>
            <div class="col-md-1"></div>
            <div class="col-md-10 my-3">
                <div class="d-flex align-items-md-center cursor-pointer" @click="goToProfile(this.sellUser.id)">
                    <img v-if="sellUser.profile_photo_path" :src="imagePath + sellUser.profile_photo_path"
                        class="rounded-circle img-70" alt="Profile" />
                    <img v-else :src="sellUser.profile_photo_url" class="rounded-circle img-70" alt="Profile" />
                    <div class="ms-3">
                        <span class="fw-bold">{{ sellUser.name }}</span><br>
                        <small><i class="fa-regular fa-calendar fw-lighter me-1"></i> Joined - {{
                            getDate(sellUser.created_at)
                        }}</small> <br>
                        <small class="text-capitalize"><i class="fa-solid fa-location-dot me-1"></i> {{
                            sellUser.region
                        }} / {{ sellUser.city }}
                        </small>
                    </div>
                </div>
                <div class="mt-2" v-if="user.id != sellUser.id">
                    <a :href="server + '/chatify/' + sellUser.id" target="_black" class="btn btn-primary btn-rounded"><i
                            class="fa-solid fa-message"></i> Message</a>
                    <a v-if="sellUser.phone" :href="'tel:' + sellUser.phone" class="btn btn-success btn-rounded ms-2"><i
                            class="fa-solid fa-phone-volume"></i>
                        Call</a>
                </div>
                <hr>
            </div>
        </div>

        <!-- Comment Process  -->
        <div class="row mt-3 mb-5">
            <div class="col-md-12 mb-3">
                <h5 class=" text-center">Comments <span class="text-muted">({{ comments.length }})</span></h5>
                <div class="line-mf"></div>
            </div>
            <div class="col-md-1"></div>
            <div class="col-md-5 mt-3">
                <textarea v-model="cmtDesc" class="form-control" placeholder="Enter Comment" rows="2"></textarea>
                <div class="text-end mt-2">
                    <button @click="submitComment()" class="btn  btn-primary"><i class="fa-solid fa-comment"></i>
                        Submit</button>
                </div>
            </div>
            <div class="col-md-5 my-3">
                <div class="card mb-1" v-for="(comment, index) in comments" :key="index" style="background:#303030">
                    <div class="card-header position-relative">
                        <div class="d-flex align-items-center">
                            <img v-if="comment.profile_photo_path" @click="goToProfile(comment.user_id)"
                                :src="imagePath + comment.profile_photo_path" alt=""
                                class="rounded img-fluid rounded-circle" style="height:35px;width:35px">
                            <img v-else @click="goToProfile(comment.user_id)" :src="getProfilePhoto(comment.name)"
                                alt="" class="rounded img-fluid rounded-circle" style="height:35px;width:35px">
                            <div class="ms-2">
                                <span class="d-block" @click="goToProfile(comment.user_id)">{{ comment.name }}</span>
                                <small class="d-block opacity-75">
                                    <Timeago :datetime="new Date(comment.created_at)" />
                                </small>
                            </div>
                            <!-- Comment Action Btns  -->
                            <div class="text-end ms-2">
                                <div class="dropdown cursor-pointer" v-if="comment.user_id == user.id">
                                    <span class="text-light  dropdown-toggle" id="commentAction"
                                        data-mdb-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-solid fa-ellipsis text-primary"></i>
                                    </span>
                                    <ul class="dropdown-menu" aria-labelledby="commentAction">
                                        <li><span class="dropdown-item cursor-pointer"
                                                @click="deleteComment(comment.id, index)"><i
                                                    class="fa-solid fa-trash"></i>
                                                Delete</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body glassEffect">
                        <p class=" card-text">{{ comment.description }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Report Post to Admin  -->
        <!-- Modal -->
        <div class="modal top fade" id="reportPostToAdmin" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true" data-mdb-backdrop="true" data-mdb-keyboard="true">
            <div class="modal-dialog  ">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Report Post</h5>
                        <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <select v-model="reportPostForm.type" class="form-select">
                                <option value="">Select type ..</option>
                                <option value="span">Span</option>
                                <option value="unauthorized sales">Unauthorized sales</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group mt-2">
                            <label class=" form-label">Description</label> <small class="text-danger"
                                v-if="!reportSubmitBtn">Min 6 characters</small>
                            <textarea v-model="reportPostForm.description" rows="3" class="form-control"
                                placeholder="Please Enter Description"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark reportPostModalCloseBtn" data-mdb-dismiss="modal">
                            Close
                        </button>
                        <button @click="reportPost()" :disabled="!reportSubmitBtn" type="button"
                            class="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import useFunction from '@/src/js/custom'
import { mapGetters, mapState } from 'vuex';
import ImagesCarousel from '../caroursel/ImagesCarousel.vue'
import ActionBarVue from '@/components/ActionBar.vue';
import { Timeago } from 'vue2-timeago'
export default {
    name: 'PostInfoView',
    data() {
        return {
            pageStart: true,
            post: {
                id: '',
            },
            sellUser: {},
            cmtDesc: '',
            comments: [],
            reportPostForm: {
                type: '',
                description: ''
            }
        }
    },
    methods: {
        getPost() {
            if (this.pageStart == true) {
                this.$store.dispatch('pageLoadingState', true);
            }
            axios.get(this.api + '/posts/info/' + this.$route.params.id, this.authHeader).then(r => {
                this.post = r.data.post[0];
                // this.post.additional = JSON.parse(r.data.post[0].additional);
                this.sellUser = r.data.user;
                this.$store.dispatch('pageLoadingState', false);
                this.pageStart = false;
            }).catch(err => {
                this.$store.dispatch('pageLoadingState', false);
                useFunction.error(err, this.$swal)
                this.pageStart = false;
            })
        },
        getDate(data) {
            let date = useFunction.getDate(data);
            return date
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
                            this.$router.go(-1);
                        }
                    }).catch(err => {
                        useFunction.error(err, this.$swal)
                    })
                }
            })
        },
        goToProfile(uId) {
            this.$router.push({ name: 'profile', params: { id: uId } })
        },
        likeUnlike(post) {
            if (post.like == 1) {
                post.like = 0
                post.post_like_count--;
            } else {
                post.like = 1
                post.post_like_count++;
            }
            axios.get(this.api + '/like/like_unlike/' + post.id, this.authHeader).then(r => {
                if (r.data.status == 'like') {
                    post.like = true
                } else {
                    post.like = false;
                }
                this.$store.dispatch('getFavCount')
            })
        },
        // Comments Control
        getComment() {
            axios.get(this.api + '/comment/get/' + this.$route.params.id, this.authHeader).then(r => {
                this.comments = r.data;
            }).catch(err => { useFunction.error(err, this.$swal) })
        },
        submitComment() {
            let data = {
                post_id: this.post.id,
                description: this.cmtDesc,
            }
            axios.post(this.api + '/comment/add', data, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
                if (r.data.success) {
                    this.cmtDesc = ''
                    this.getComment();
                }
            }).catch(err => { useFunction.err(err) })
        },
        deleteComment(cId, index) {
            axios.get(this.api + '/comment/delete/' + cId, this.authHeader).then(r => {
                if (r.data.success) {
                    this.comments.splice(index, 1);
                }
            }).catch(err => { useFunction.error(err, this.$swal) })
        },
        //Report Post
        reportPost() {
            let data = {
                'report_id': this.post.id,
                'report_type': this.reportPostForm.type,
                'type': 'post',
                'description': this.reportPostForm.description,
            };
            console.log(data);
            axios.post(this.api + '/report/store', data, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
                if (r.data.success) {
                    this.reportPostForm = {
                        type: '',
                        description: ''
                    }
                    let btn = document.querySelector('.reportPostModalCloseBtn');
                    btn.click();
                }
            })
        },
        getProfilePhoto(name) {
            return useFunction.getProfileImage(name);
        }
    },
    mounted() {
        this.getPost();
        this.getComment();
    },
    computed: {
        ...mapState(['user', 'pageLoading', 'server']),
        ...mapGetters(['api', 'imagePath', 'authHeader']),
        reportSubmitBtn() {
            if (this.reportPostForm.type == "" || this.reportPostForm.description.length <= 5) {
                return false;
            }
            return true;
        }
    },
    components: {
        ActionBarVue, ImagesCarousel, Timeago
    },
}
</script>

<style lang="scss" scoped>
.dropdown-toggle::after {
    content: none;
}
</style>