<template>
    <div class="container-fluid">
        <div class="row mt-3">
            <div class="col-md-2"></div>
            <div class="col-md-8 card mb-3">
                <div class="card-header text-center">
                    <img src="/img/b-logo.ico" class="rounded rounded-circle me-1" height="60" alt="MDB Logo" /> Register
                    Form
                </div>
                <div class="card-body">
                    <div class="row">
                        <!-- 2 column grid layout with text inputs for the first and last names -->
                        <div class="mb-3 col-sm-6">
                            <label class="form-label" for="nameInput" style="margin-left: 0px">Name</label>
                            <input :class="{ 'is-invalid': errors.name }" v-model="formData.name" type="text"
                                placeholder="Enter Name" id="nameInput" class="form-control" autocomplete="off">
                            <div class="invalid-feedback">{{ errors.name }}</div>
                        </div>

                        <!-- Email input -->
                        <div class="mb-3 col-sm-6">
                            <label class="form-label" for="form3Example3" style="margin-left: 0px">Email address</label>
                            <input :class="{ 'is-invalid': errors.email }" v-model="formData.email" type="email"
                                placeholder="Enter Email" id="form3Example3" class="form-control" autocomplete="off">
                            <div class="invalid-feedback">{{ errors.email }}</div>
                        </div>

                        <!-- Password input -->
                        <div class="mb-3 col-sm-6">
                            <label class="form-label" for="form3Example4" style="margin-left: 0px">Password</label>
                            <input :class="{ 'is-invalid': errors.password }" v-model="formData.password" type="password"
                                placeholder="Enter Password" id="form3Example4" class="form-control" autocomplete="off">
                            <div class="invalid-feedback">{{ errors.password }}</div>
                        </div>
                        <!-- Confirm Password input -->
                        <div class="mb-3 col-sm-6">
                            <label class="form-label" for="form3Example4" style="margin-left: 0px">Confirm Password</label>
                            <input :class="{ 'is-invalid': errors.confirmed_password }" placeholder="Enter Confirm Password"
                                v-model="formData.confirmed_password" type="password" id="form3Example5"
                                class="form-control" autocomplete="off">
                            <div class="invalid-feedback">{{ errors.confirmed_password }}</div>
                        </div>
                        <div class=" mb-2 col-sm-6">
                            <label class="form-label" for="regionSelect" style="margin-left: 0px">Region</label>
                            <select :class="{ 'is-invalid': errors.region }" v-model="formData.region"
                                @change="FilterCity()" id="regionSelect" class="form-control text-capitalize">
                                <option value="">Please Select</option>
                                <option :value="region.name" class="m-1 text-capitalize"
                                    v-for="(region, index) in defaultVar.region" :key="index">
                                    {{ region.name }}</option>
                            </select>
                            <div class="invalid-feedback">{{ errors.region }}</div>

                        </div>
                        <div class="mb-3 col-sm-6">
                            <label class="form-label" for="cityInput" style="margin-left: 0px">City</label>
                            <select :class="{ 'is-invalid': errors.city }" v-model="formData.city" id="cityInput"
                                class="form-control text-capitalize">
                                <option value="">Please Select Region</option>
                                <option :value="city.city" class="m-1 text-capitalize" v-for="(city, index) in filterCities"
                                    :key="index">
                                    {{ city.city }}
                                </option>
                            </select>
                            <div class="invalid-feedback">{{ errors.city }}</div>
                        </div>
                        <div class="mb-3 col-4">
                            <label>Gender</label>
                            <select v-model="formData.gender" class="form-control">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="rather not to say">Rather not to say</option>
                            </select>
                        </div>
                        <!-- Submit button -->
                        <button v-if="uiControl.loadingBtn" class="btn btn-primary btn-block my-3" type="button" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        <button @click="singUpProcess()" :disabled="!singUpBtnStatus" v-else type="submit"
                            class="btn btn-primary btn-block my-3">
                            Sign up
                        </button>
                        <!-- Register buttons -->
                        <div class="text-center">
                            Back to <router-link to="login">Login</router-link>
                            <!-- <p>or sign up with:</p>
                                <button type="button" class="btn btn-primary btn-floating mx-1">
                                    <i class="fab fa-facebook-f"></i>
                                </button>

                                <button type="button" class="btn btn-primary btn-floating mx-1">
                                    <i class="fab fa-google"></i>
                                </button>

                                <button type="button" class="btn btn-primary btn-floating mx-1">
                                    <i class="fab fa-twitter"></i>
                                </button>

                                <button type="button" class="btn btn-primary btn-floating mx-1">
                                    <i class="fab fa-github"></i>
                                </button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapState } from 'vuex'
import useFunction from '@/src/js/custom'
export default {
    name: 'RegisterView',
    data() {
        return {
            filterCities: [],
            uiControl: {
                loadingBtn: false,
            },
            errors: {
                name: false,
                email: false,
                password: false,
                confirmed_password: false,
                region: false,
                city: false,
            },
            formData: {
                name: '',
                email: '',
                password: '',
                confirmed_password: '',
                region: '',
                city: '',
                gender: 'male',
            },
        }
    },
    methods: {
        FilterCity() {
            if (this.formData.region) {
                const cities = this.defaultVar.city;
                let city = cities.filter(e => e.region.includes(this.formData.region));
                // eslint-disable-next-line no-undef
                const cityByIP = geoplugin_city().toLowerCase();
                for (let i = 0; i < this.defaultVar.city.length; i++) {
                    const element = this.defaultVar.city[i];
                    if (element.city.includes(cityByIP)) {
                        this.formData.city = element.city
                        break;
                    }else{
                        this.formData.city = city[0].city;
                    }
                }
                this.filterCities = city;
            } else {
                this.formData.city = '';
                this.filterCities = [];
            }
        },
        singUpProcess() {
            this.uiControl.loadingBtn = true;
            axios.post(this.api + '/register', this.formData).then(r => {
                useFunction.alert(r.data, this.$swal);
                this.uiControl.loadingBtn = false;
                this.errorToFalse();
                if (r.data.error) {
                    r.data.error.forEach(error => {
                        if (error.includes('name')) {
                            this.errors.name = error;
                        }
                        if (error.includes('email')) {
                            this.errors.email = error;
                        }
                        if (error.includes('password')) {
                            this.errors.password = error;
                        }
                        if (error.includes('confirmed_password')) {
                            this.errors.confirmed_password = error;
                        }
                        if (error.includes('city')) {
                            this.errors.city = error;
                        }
                        if (error.includes('region')) {
                            this.errors.region = error;
                        }
                    });
                }
                if (r.data.token) {
                    this.$store.dispatch('storeUser', r.data);
                    this.$router.push({ name: 'verification' });
                }
            })
        },
        errorToFalse() {
            this.errors = {
                name: false,
                email: false,
                password: false,
                confirmed_password: false,
                region: false,
                city: false,
            }
        },
        // Get Region And City By IP 
        getRegion() {
            // eslint-disable-next-line no-undef
            const regionByIP = geoplugin_region().toLowerCase();
            for (let i = 0; i < this.defaultVar.region.length; i++) {
                const element = this.defaultVar.region[i];
                if (element.name.includes(regionByIP)) {
                    this.formData.region = element.name
                    break
                }
            }
            this.FilterCity();
        }
    },
    computed: {
        ...mapState(['defaultVar']),
        ...mapGetters(['api']),
        singUpBtnStatus() {
            let data = this.formData;
            if (data.name == '' || data.email == '' || data.password == '' || data.confirmed_password == ''
                || data.region == '' || data.city == '') {
                return false;
            }
            return true;
        }
    },

    mounted() {
        setTimeout(() => {
            this.getRegion();
        }, 2000);
    },


}
</script>

<style lang="scss" scoped></style>