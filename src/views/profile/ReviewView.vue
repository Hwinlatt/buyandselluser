<template>
    <div class="container-fluid">
        <ActionBarVue :title="'Reviews of (' + infoUser.name + ') | rating - ' +user_rating"></ActionBarVue>
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <div class="py-2">
                    <div class="card" v-if="ui.review_question">
                        <div class="card-body">
                            <p class="text-center">
                                Do You recommend {{ infoUser.name }} ?
                            </p>
                            <div class="d-flex justify-content-center">
                                <button @click="giveRating(5)"
                                    class="btn btn-outline-dark btn-sm btn-rounded text-light">Yes</button>
                                <button @click="giveRating(1)"
                                    class="btn btn-outline-dark btn-sm btn-rounded text-light ms-4">No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="reviews.length > 0" class="my-4">
                    <div class="card my-2" v-for="(review, index) in reviews" :key="index">
                        <div class="card-header">
                            <div class="float-end">
                                <span v-for="index in 5" :key="index">
                                <i class="fa-solid fa-star  text-warning" v-if="index <= review.rating"></i>
                                <i class="fa-regular fa-star " v-else></i>
                            </span>
                            </div>
                            <div class="d-flex align-items-center" v-if="status != 'Please Wait ...'">
                                <img :src="imagePath + review.profile_photo_path" v-if="review.profile_photo_path"
                                    class="img-40 rounded rounded-circle img-fluid" alt="">
                                <img :src="getDefaultProfileUrl(review.name)" v-else
                                    class="img-40 rounded rounded-circle img-fluid" alt="">
                                <div class="ms-2">
                                    {{ review.name }}
                                    <small class="d-block text-muted">
                                        <Timeago :datetime="new Date(review.created_at)"></Timeago>
                                    </small>
                                </div>
                                <div class="text-end ms-2" v-if="user.id == review.user_id">
                                    <div class="dropdown cursor-pointer">
                                        <span class="text-light  dropdown-toggle" id="commentAction"
                                            data-mdb-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis text-primary"></i>
                                        </span>
                                        <ul class="dropdown-menu" aria-labelledby="commentAction">
                                            <li @click="editReview(review)"><span  class="dropdown-item cursor-pointer">
                                                    <i class="fa-solid fa-pen-to-square"></i>
                                                    Edit</span>
                                            </li>
                                            <li @click="deleteReview(index, review.id)"><span
                                                    class="dropdown-item cursor-pointer"><i
                                                        class="fa-solid fa-trash"></i>
                                                    Delete</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <p class=" card-text">
                                {{ review.description }}
                            </p>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <h5 class="text-center my-5 text-muted">{{ status }}</h5>
                </div>
            </div>
        </div>
        <!-- Review Modal Start  -->
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary giveRatingBtn d-none" data-mdb-toggle="modal"
            data-mdb-target="#reviewFormModal">
            Launch demo modal
        </button>
        <!-- Modal -->
        <div class="modal fade" id="reviewFormModal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Give Review to {{ infoUser.name }}</h5>
                        <button type="button" class="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex justify-content-around cursor-pointer mb-3">
                            <span v-for="index in 5" :key="index" @click="changeRating(index)">
                                <i class="fa-solid fa-star fs-2 text-warning" v-if="index <= reviewForm.rating"></i>
                                <i class="fa-regular fa-star fs-2" v-else></i>
                            </span>
                        </div>
                        <textarea v-model="reviewForm.description" id="" class="form-control"
                            placeholder="Enter Description" rows="10"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary reviewUserFromCloseBtn"
                            data-mdb-dismiss="modal">Close</button>
                        <button type="button" @click="reviewAddToUser()" class="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Review Modal End  -->
    </div>
</template>

<script>
import ActionBarVue from '@/components/ActionBar.vue';
import axios from 'axios';
import useFunction from '@/src/js/custom'
import { Timeago } from 'vue2-timeago'
import $ from 'jquery'
import { mapGetters, mapState } from 'vuex';
export default {
    name: 'ReviewView',
    data() {
        return {
            infoUser: {},
            reviews: [

            ],
            status: 'Please Wait ...',
            user_rating:0,
            reviewForm: {
                rating: 1,
                description: '',
                rate_user_id: this.$route.params.id
            },
            ui: {
                review_question: false,
            }
        }
    },
    components: {
        ActionBarVue, Timeago
    },
    methods: {
        getReviews() {
            axios.get(this.api + '/profile/view/review/' + this.$route.params.id, this.authHeader).then(r => {
                this.reviews = r.data.reviews;
                this.infoUser = r.data.infoUser;
                this.user_rating = r.data.rating;
                this.status = 'There is nothing to show.';
                if (r.data.is_reviewed == 0) {
                    this.ui.review_question = true;
                }
            })
        },
        reviewAddToUser() {
            axios.post(this.api + '/profile/add/review', this.reviewForm, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
                if (r.data.success) {
                    $('.reviewUserFromCloseBtn').click();
                }
                this.ui.review_question = false;
                this.getReviews();
            }).catch(err => { useFunction.error(err, this.$swal) })
        },
        editReview(review){
            $('.giveRatingBtn').click();
            this.reviewForm = {
                rating: review.rating,
                description: review.description,
                rate_user_id: this.$route.params.id
            }
        },
        deleteReview(index, rId) {
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
                    axios.get(this.api + '/profile/remove/review/' + rId, this.authHeader).then(r => {
                        if (r.data.success) {
                            this.reviews.splice(index,1);
                            this.ui.review_question = true;
                        }
                    })
                }
            })
        },
        changeRating(n) {
            this.reviewForm.rating = n;
        },
        giveRating(num) {
            this.changeRating(num);
            $('.giveRatingBtn').click();
        },
        getDefaultProfileUrl(name) {
            return useFunction.getProfileImage(name);
        }
    },
    computed: {
        ...mapGetters(['api', 'authHeader', 'imagePath']),
        ...mapState(['user']),
    },
    mounted() {
        this.getReviews();
    },
}
</script>

<style lang="scss" scoped>
.dropdown-toggle::after {
    content: none;
}
</style>