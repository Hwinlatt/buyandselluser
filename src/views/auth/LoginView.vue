<template>
    <div class="container-fluid">
        <div class="row mt-5">
            <div class="col-md-4"></div>
            <div class="col-md-4 mb-4 card">
                <div class="card-header text-center">
                    <img src="/img/b-logo.ico" class="rounded rounded-circle me-2" height="60" alt="MDB Logo"
                        loading="lazy" />
                    Login Form
                </div>
                <span class="card-body">
                    <!-- Email input -->
                    <div class="form-outline mt-4 mb-4">
                        <input v-model="formData.email" type="email" id="form2Example1" class="form-control"
                            autocomplete="off" />
                        <label class="form-label" for="form2Example1" style="margin-left: 0px">Email address</label>
                        <div class="form-notch">
                            <div class="form-notch-leading" style="width: 9px"></div>
                            <div class="form-notch-middle" style="width: 88.8px"></div>
                            <div class="form-notch-trailing"></div>
                        </div>
                        <div class="form-notch">
                            <div class="form-notch-leading" style="width: 9px"></div>
                            <div class="form-notch-middle" style="width: 88.8px"></div>
                            <div class="form-notch-trailing"></div>
                        </div>
                    </div>

                    <!-- Password input -->
                    <div class="form-outline mb-4">
                        <input @keypress.enter="loginProcess()" v-model="formData.password" type="password"
                            id="form2Example2" class="form-control" autocomplete="off" />
                        <label class="form-label" for="form2Example2" style="margin-left: 0px">Password</label>
                        <div class="form-notch">
                            <div class="form-notch-leading" style="width: 9px"></div>
                            <div class="form-notch-middle" style="width: 64px"></div>
                            <div class="form-notch-trailing"></div>
                        </div>
                        <div class="form-notch">
                            <div class="form-notch-leading" style="width: 9px"></div>
                            <div class="form-notch-middle" style="width: 64px"></div>
                            <div class="form-notch-trailing"></div>
                        </div>
                    </div>

                    <!-- 2 column grid layout for inline styling -->
                    <div class="row mb-4">
                        <div class="col-md-12 text-end">
                            <!-- Simple link -->
                            <a href="#" @click="forgotPassword">Forgot password?</a>
                        </div>
                    </div>

                    <!-- Submit button -->
                    <button v-if="btnLoading" class="btn btn-primary btn-block" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                    <button v-else @click="loginProcess()" :disabled="!loginBtn" type="submit"
                        class="btn btn-primary btn-block mb-4">
                        Sign in
                    </button>

                    <!-- Register buttons -->
                    <div class="text-center">
                        <p>
                            Not a member? <router-link to="/register">Register</router-link>
                        </p>
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
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import useFunction from '@/src/js/custom'
import axios from "axios";
export default {
    name: "LoginView",
    data() {
        return {
            formData: {
                email: "",
                password: "",
            },
            btnLoading:false,
        };
    },
    methods: {
        loginProcess() {
            this.btnLoading = true;
            axios.post(this.api + '/login', this.formData).then(r => {
                this.btnLoading = false;
                useFunction.alert(r.data, this.$swal)
                if (r.data.error) {
                    this.formData.password = '';
                }
                if (r.data.success) {
                    this.$router.push('/');
                    let data = {
                        token: r.data.data.token,
                        user: r.data.data.user,
                    }
                    this.$store.dispatch('storeUser', data),this.$store.dispatch('getNotiCount');
                    // window.location.reload();
                }
            }).catch(err=>{
                useFunction.error(err,this.$swal)
                this.btnLoading = false;
            });
        },
        forgotPassword(e) {
            e.preventDefault();
            const data = {
                email: this.formData.email
            }
            axios.post(this.api + '/user/reset_password', data, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
            }).catch(err => { useFunction.alert(err, this.$swal) })
        }
    },
    computed: {
        ...mapGetters(["isLogin", "api"]),
        loginBtn() {
            if (this.formData.email.length < 3 || this.formData.password.length < 6)
                return false;
            else return true;
        },
    },
    mounted() {
        this.$store.dispatch("activePage", "login");
    },
};
</script>

<style lang="scss" scoped>

</style>
