<template>
    <div class="container-fluid" v-if="!pageLoading">
        <ActionBar :title="'Profile'"></ActionBar>
        <div class="row">
            <div class="col-md-12 position-relative  coverPhoto"
                :style="{ 'background-image': `url(${backgroundImg})` }">
                <div class="position-absolute  mainProfileConatiner d-flex align-items-center">
                    <img v-if="info.user.profile_photo_path" class="mainProfile rounded rounded-circle"
                        :src="imagePath + info.user.profile_photo_path" alt="">
                    <img v-else class="mainProfile rounded rounded-circle" :src="info.user.profile_photo_url" alt="">
                    <div class="ms-3">
                        <span class="fs-3">{{ info.user.name }}</span> <router-link v-if="info.user.id == user.id"
                            :to="{ name: 'profileSetting' }" class="ms-2 fs-4"><i
                                class="fa-regular fa-pen-to-square"></i></router-link><br>
                        <div class="m-0 p-0 mt-2" v-if="info.user.id != user.id">
                            <a :href="server + '/chatify/' + info.user.id" target="_black"
                                class="btn btn-primary btn-rounded ms-2"><i class="fa-solid fa-message"></i>
                                Message</a>
                            <a :href="'tel:' + info.user.phone" v-if="info.user.phone"
                                class="btn btn-success btn-rounded ms-2 mt-2"><i class="fa-solid fa-phone-volume"></i>
                                Call</a>
                            <button v-if="info.user.id != user.id" data-mdb-toggle="modal"
                                data-mdb-target="#reportUserToAdmin"
                                class="btn btn-outline-warning btn-rounded ms-2 mt-2"><i
                                    class="fa-solid fa-triangle-exclamation"></i>
                                Report</button>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-top:165px" class="col-md-12">
                <div class="ms-3">
                    <table>
                        <tbody>
                            <tr>
                                <td><i class="fa-regular fa-calendar fw-lighter me-1"></i></td>
                                <td><span class="ms-2">Joined - {{ getDate(info.user.created_at) }}</span></td>
                            </tr>
                            <tr>
                                <td><i class="fa-solid fa-location-dot me-1"></i></td>
                                <td><span class="ms-2">{{ info.user.region }} / {{ info.user.city }}</span></td>
                            </tr>
                            <tr>
                                <td><i class="fa-solid fa-star me-1"></i></td>
                                <td><span @click="goToReviewPage()" class="ms-2 text-primary cursor-pointer"> {{ info.review.rating }}  . ({{ info.review.count }} Reviews)</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="line w-25"></div>
                    <span class="mt-2"> Bio</span><br>
                    <p style="word-wrap: break-word;" v-html="info.user.description"></p>
                </div>
                <h5 class="ms-4 text-center text-muted mt-4">Posts ( {{ info.total_post }} )</h5>
                <div class="line-mf mb-2"></div>
                <product-container :posts="posts"></product-container>
                <div class="row" v-if="canGetMorePost">
                    <div class="col-md-12 text-center my-3">
                        <a href="#" @click="postLimitUp">See more...</a>
                    </div>
                </div>
                <!-- Report Post to Admin  -->
                <!-- Modal -->
                <div class="modal top fade" id="reportUserToAdmin" tabindex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true" data-mdb-backdrop="true" data-mdb-keyboard="true">
                    <div class="modal-dialog  ">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Report User <i
                                        class="fa-solid fa-caret-right"></i> <i>{{ info.user.name }}</i></h5>
                                <button type="button" class="btn-close" data-mdb-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <select v-model="reportUserForm.type" class="form-select">
                                        <option value="">Select type ..</option>
                                        <option value="span">Span</option>
                                        <option value="fake account">Fake Account</option>
                                        <option value="fake account">Fake Name</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="form-group mt-2">
                                    <label class=" form-label">Description</label> <small class="text-danger"
                                        v-if="!reportSubmitBtn">Min 5 characters</small>
                                    <textarea v-model="reportUserForm.description" rows="3" class="form-control"
                                        placeholder="Please Enter Description"></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-dark reportUserModalCloseBtn"
                                    data-mdb-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" class="btn btn-primary" @click="reportUser()">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapState } from 'vuex';
import ProductContainer from '@/components/ProductContainer.vue';
import useFunction from '@/src/js/custom'
import ActionBar from '@/components/ActionBar.vue';
export default {
    name: "ProfileView",
    components: {
        ProductContainer, ActionBar
    },
    data() {
        return {
            post_limit: 12,
            info: {
                user: {},
                total_post: 0,
                categories: [],
                review:{
                    count:0,
                    rating:0.0,
                },
            },
            posts: [],
            reportUserForm: {
                type: '',
                description: ''
            }

        }
    },
    methods: {
        getPost(status, uId) {
            let id = this.$route.params.id;
            if (uId) {
                id = uId;
            }
            if (!status) {
                this.$store.dispatch('pageLoadingState', true)
            }
            axios.get(this.api + '/posts/user/' + id + '/' + this.post_limit, this.authHeader).then(r => {
                this.posts = r.data;
                this.$store.dispatch('pageLoadingState', false)
            }).catch(err => {
                this.$store.dispatch('pageLoadingState', false)
                useFunction.error(err, this.$swal)
            })
        },
        getProfileInfo(uId) {
            let id = this.$route.params.id;
            if (uId) {
                id = uId;
            }
            this.$store.dispatch('pageLoadingState', true)
            axios.get(this.api + '/profile/view/' + id, this.authHeader).then(r => {
                this.info = r.data;
                this.$store.dispatch('pageLoadingState', false)
            }).catch(err => {
                this.$store.dispatch('pageLoadingState', false)
                useFunction.error(err, this.$swal)
            })
        },
        postLimitUp(event) {
            event.preventDefault();
            if (this.canGetMorePost) {
                this.post_limit += 12;
                this.getPost(true);
            }
        },
        getDate(data) {
            let date = useFunction.getDate(data);
            return date
        },
        reportUser() {
            let data = {
                'report_id': this.info.user.id,
                'report_type': this.reportUserForm.type,
                'type': 'user',
                'description': this.reportUserForm.description,
            };
            axios.post(this.api + '/report/store', data, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
                if (r.data.success) {
                    this.reportUserForm = {
                        type: '',
                        description: ''
                    }
                    let btn = document.querySelector('.reportUserModalCloseBtn');
                    btn.click();
                }
            })
        },
        goToReviewPage(){
            this.$router.push({name:'profileReview',params:{id:this.$route.params.id}});
        }
    },
    computed: {
        ...mapState(['user', 'pageLoading', 'server']),
        ...mapGetters(['imagePath', 'api', 'authHeader']),
        canGetMorePost() {
            if (this.info.total_post > this.post_limit) {
                return true;
            }
            return false;
        },
        reportSubmitBtn() {
            if (this.reportUserForm.type == "" || this.reportUserForm.description.length <= 5) {
                return false;
            }
            return true;
        },
        backgroundImg() {
            if (this.info.user.background_img) {
                return this.imagePath + this.info.user.background_img;
            }
            return 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ff1e3a0b-d453-4f25-9d40-b639ea34eac6/d8b0e2q-c3445053-675a-4952-9be8-11884fd5c7d7.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2ZmMWUzYTBiLWQ0NTMtNGYyNS05ZDQwLWI2MzllYTM0ZWFjNlwvZDhiMGUycS1jMzQ0NTA1My02NzVhLTQ5NTItOWJlOC0xMTg4NGZkNWM3ZDcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TNA3OxHyji3j7IYYhoKKMv0Z9RkWkP-pcdTdxLU6h3E'
        }
    },
    mounted() {
        this.$store.dispatch('activePage', '');
        this.getPost();
        this.getProfileInfo();
    },
    beforeRouteUpdate(to, from, next) {
        this.getPost(false, to.params.id);
        this.getProfileInfo(to.params.id);
        next();
    }
}
</script>

<style lang="scss" scoped>
.coverPhoto {
    height: 300px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.mainProfile {
    width: 180px;
    height: 180px;
}

.mainProfileConatiner {
    bottom: -140px;
    padding: 10px;
}
</style>