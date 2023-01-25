<template>
    <div class="container-fluid" v-if="!pageLoading">
        <div class="row mb-4">
            <action-bar title="Profile Setting"></action-bar>
            <div class="col-md-2"></div>
            <div class="col-md-8 card mt-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="line_mf"></div>
                            <div class="position-relative  profileImage m-auto">
                                <img v-if="user.profile_photo_path" class="profileImage  rounded  img-fluid "
                                    :src="imagePath + user.profile_photo_path" alt="" srcset="">
                                <img v-else class="profileImage  rounded  img-fluid " :src="user.profile_photo_url"
                                    alt="" srcset="">
                                <button onclick="document.querySelector('.inputProfilePageImage').click()"
                                    class="btn btn-sm btn-primary position-absolute  bottom-0 end-0"><i
                                        class="fa-solid fa-pen-to-square"></i></button>
                                <input @change="updatePpImg" type="file" class="d-none inputProfilePageImage"
                                    accept="image/*">
                            </div>
                            <small class="d-block my-1 text-muted text-center">{{ user.email }}</small>
                            <div class="my-3">
                                <ul class="list-group list-group-light list-group-small">
                                    <li :class="{ active: ui.activeView == 'account' }"
                                        @click="activeViewChange('account')" class="list-group-item cursor-pointer"><i
                                            class="fa-solid fa-puzzle-piece"></i>
                                        Account</li>
                                    <li :class="{ active: ui.activeView == 'security' }"
                                        @click="activeViewChange('security')" class="list-group-item cursor-pointer"><i
                                            class="fa-solid fa-lock"></i> Security
                                    </li>
                                    <!-- <li class="list-group-item">Notification</li> -->
                                </ul>
                            </div>
                        </div>
                        <!-- Account Setting  -->
                        <div class="col-sm" v-if="ui.activeView == 'account'">
                            <Transition>
                                <small v-if="ui.pageStatus != ''" v-html="ui.pageStatus"
                                    class="float-end opacity-75"></small>
                            </Transition>
                            <h4 class="mb-3">Account Setting</h4>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-group mb-2">
                                        <label for="inputName" class=" form-label">Name</label>
                                        <input v-model="profileFrom.name" id="inputName"
                                            :class="{ 'is-invalid': profileFromError.name }" type="text"
                                            class="form-control" placeholder="Your Name">
                                        <span class="invalid-feedback">{{ profileFromError.name }}</span>
                                    </div>
                                    <div class=" position-relative">
                                        <img v-if="user.background_img" class="cover_image img-fluid rounded"
                                            :src="imagePath+user.background_img"
                                            alt="">
                                        <img v-else class="cover_image img-fluid rounded"
                                            src="https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569__480.jpg"
                                            alt="">
                                        <button onclick="document.querySelector('.inputCoverImg').click()"
                                            class="btn btn-sm btn-primary position-absolute  bottom-0 end-0"><i
                                                class="fa-solid fa-pen-to-square"></i> Change Cover Photo</button>
                                        <input @change="chgCoverImg" type="file" class="inputCoverImg d-none">
                                    </div>
                                    <div class="form-group mb-2">
                                        <label for="">Gender</label>
                                        <select v-model="profileFrom.gender" class="form-control">
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="rather not to say">Rather not to say</option>
                                        </select>
                                    </div>
                                    <div class="form-group mb-2">
                                        <label for="inputRegion" class="form-label">Region</label>
                                        <select v-model="profileFrom.region"
                                            :class="{ 'is-invalid': profileFromError.region }" @change="filterCity()"
                                            class="form-select text-capitalize" id="inputRegion">
                                            <option class=" text-capitalize"
                                                v-for="(region, index) in defaultVar.region" :key="index"
                                                :value="region.name">{{ region.name }}</option>
                                        </select>
                                        <span class="invalid-feedback">{{ profileFromError.region }}</span>
                                    </div>
                                    <div class="form-group mb-2">
                                        <label for="inputCity" class=" form-label">City</label>
                                        <select id="inputCity" :class="{ 'is-invalid': profileFromError.city }"
                                            v-model="profileFrom.city" class=" form-select text-capitalize">
                                            <option class="text-capitalize" v-for="(city, index) in filterCities"
                                                :key="index" :value="city.city">{{ city.city }}</option>
                                        </select>
                                        <span class="invalid-feedback">{{ profileFromError.city }}</span>
                                    </div>
                                    <div class="form-group mb-2">
                                        <label for="inputPhone" class=" form-label">Phone</label>
                                        <input v-model="profileFrom.phone"
                                            :class="{ 'is-invalid': profileFromError.phone }" type="text"
                                            id="inputPhone" class="form-control" placeholder="Enter Phone">
                                        <span class="invalid-feedback">{{ profileFromError.phone }}</span>
                                    </div>
                                    <div class="form-group mb-2">
                                        <label for="inputBio" class=" form-label">Bio</label>
                                        <textarea class="form-control" rows="3"
                                            :class="{ 'is-invalid': profileFromError.description }"
                                            v-model="profileFrom.description"></textarea>
                                        <span class="invalid-feedback">{{ profileFromError.description }}</span>
                                    </div>
                                    <div class="text-end">
                                        <button @click="updateProfile()" :disabled="!profileUpdateBtn"
                                            class="btn btn-primary" title="save profile">Save profile</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Security Setting  -->
                        <div class="col-sm" v-if="ui.activeView == 'security'">
                            <h4 class="mb-4">Security Setting</h4>
                            <div class="row">
                                <div class="col-sm-12 mb-2">
                                    <h6><i class="fa-solid fa-key"></i> Password</h6>
                                    <div class="mb-1">
                                        <div class="form-group">
                                            <small class=" form-label">Old Password</small>
                                            <input v-model="passwordForm.old_password" type="password"
                                                placeholder="Enter Old Password" class="form-control">
                                        </div>
                                        <div class="form-group">
                                            <small class=" form-label">New Password</small>
                                            <input v-model="passwordForm.new_password" type="password"
                                                placeholder="Enter New Password" class="form-control">
                                        </div>
                                        <div class="text-end mt-2">
                                            <button @click="passwordChange()" class="btn btn-sm btn-primary"
                                                :disabled="!passChangeBtn">Change</button>
                                        </div>
                                    </div>
                                    <div class="mb-1">
                                        <button class="btn btn-link" @click="passwordReset()" href="">Forget
                                            Password</button>
                                    </div>
                                </div>
                                <hr>
                                <div class="col-sm-12 mb-2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import ActionBar from '@/components/ActionBar.vue'
import useFunction from '@/src/js/custom'
import axios from 'axios';
import $ from 'jquery'
export default {
    name: 'ProfileSettingView',
    data() {
        return {
            ui: {
                pageStatus: '',
                status: {
                    success: 'Success <i class="fa-solid fa-check"></i>',
                    save: 'Save <i class="fa-solid fa-check"></i>',
                    loading: 'Loading...',
                    updating: 'Updating...',
                    error: 'Error <i class="fa-solid fa-triangle-exclamation"></i>',
                },
                activeView: 'account',
            },
            filterCities: [],
            profileFrom: {
                name: '',
                region: '',
                city: '',
                phone: '',
                description: '',
                gender: '',
            },
            profileFromError: {
                name: false,
                region: false,
                city: false,
                phone: false,
                description: false,
            },
            passwordForm: {
                new_password: '',
                old_password: '',
            }
        }
    },
    methods: {
        updatePpImg(e) {
            let data = {
                image: e.target.files[0],
            }
            axios.post(this.api + '/user/update/profileImage', data, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
                if (r.data.success) {
                    this.$store.dispatch('storeUser', r.data);
                    $('.inputProfilePageImage').val('')
                }
            }).catch(err => {
                useFunction.error(err, this.$swal);
                $('.inputProfilePageImage').val('')

            })
        },
        chgCoverImg(e){
            let data = {
                image: e.target.files[0],
            }
            axios.post(this.api + '/user/update/coverImage', data, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
                if (r.data.success) {
                    this.$store.dispatch('storeUser', r.data);
                    $('.inputProfilePageImage').val('')
                }
            }).catch(err => {
                useFunction.error(err, this.$swal);
                $('.inputProfilePageImage').val('')
            })
        },
        filterCity() {
            if (this.profileFrom.region) {
                const cities = this.defaultVar.city;
                let city = cities.filter(e => e.region.includes(this.profileFrom.region));
                let isUserCity = false;
                city.forEach(c => {
                    if (c.city.includes(this.user.city)) {
                        isUserCity = true;
                    }
                });
                if (isUserCity) {
                    this.profileFrom.city = this.user.city;

                } else {
                    this.profileFrom.city = city[0].city;
                }
                this.filterCities = city;
            } else {
                this.profileFrom.city = '';
                this.filterCities = [];
            }
        },
        getUserData() {
            this.profileFrom = {
                name: this.user.name,
                region: this.user.region,
                city: this.user.city,
                phone: this.user.phone,
                description: this.user.description,
                gender: this.user.gender,
            };
            this.filterCity();
            if (this.isLogin && !this.user.name) {
                this.profileChangeStatus(this.ui.status.loading);
                setTimeout(() => {
                    this.getUserData();
                    this.profileChangeStatus(this.ui.status.success);
                }, this.serverDelayTime);
            }
        },
        profileChangeStatus(status) {
            this.ui.pageStatus = status;
            if (status != 'Loading...' || status == 'Updating...') {
                setTimeout(() => {
                    this.ui.pageStatus = '';
                }, 3000);
            }
        },
        activeViewChange(view) {
            this.ui.activeView = view;
        },
        updateAccount() {
            console.log('jello');
        },
        updateProfile() {
            this.profileChangeStatus(this.ui.status.updating);
            this.profileErrorFalse();
            axios.post(this.api + '/user/update', this.profileFrom, this.authHeader).then(r => {
                console.log(r.data);
                if (r.data.error) {
                    this.profileChangeStatus(this.ui.status.error);
                    r.data.error.forEach(err => {
                        if (err.includes('name')) {
                            this.profileFromError.name = err
                        } else if (err.includes('region')) {
                            this.profileFromError.region = err
                        } else if (err.includes('city')) {
                            this.profileFromError.city = err
                        } else if (err.includes('phone')) {
                            this.profileFromError.phone = err
                        } else if (err.includes('description')) {
                            this.profileFromError.description = err
                        }
                    });
                }
                if (r.data.success) {
                    this.profileChangeStatus(this.ui.status.save);
                    this.$store.dispatch('storeUser', r.data);
                }
            })
        },
        profileErrorFalse() {
            this.profileFromError = {
                name: false,
                region: false,
                city: false,
                phone: false,
                description: false,
            }
        },
        passwordChange() {
            axios.post(this.api + '/user/update/password', this.passwordForm, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
                this.passwordForm = {
                    new_password: '',
                    old_password: '',
                }
            })
        },
        passwordReset() {
            const data = {
                email: this.user.email
            }
            axios.post(this.api + '/user/reset_password', data, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
            }).catch(err => { useFunction.alert(err, this.$swal) })
        }
    },
    computed: {
        ...mapState(['user', 'defaultVar', 'serverDelayTime','pageLoading']),
        ...mapGetters(['isLogin', 'api', 'authHeader', 'imagePath']),
        profileUpdateBtn() {
            let data = this.profileFrom;
            if (data.name == '') {
                return false;
            }
            return true;
        },
        passChangeBtn() {
            if (this.passwordForm.new_password.length < 6 || this.passwordForm.old_password < 6) {
                return false
            }
            return true;
        }
    },
    mounted() {
        this.$store.dispatch('activePage', 'profile');
        this.getUserData();
    },
    components: {
        ActionBar,
    },
}
</script>

<style lang="scss" scoped>
.profileImage {
    width: 100px;
    height: 100px;
}

.cover_image {
    height: 20vh;
    width: 100%;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>