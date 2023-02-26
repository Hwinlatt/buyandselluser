<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-4 card my-4" v-if="!user.email_verified_at">
                <div class="card-header text-center">
                    <img src="/img/b-logo.ico" class="rounded rounded-circle" height="60"
                        alt="B&S Logo" /> Email verification
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="inputOtp">Please Enter Otp Code</label>
                        <input v-model="formData.otp_code" placeholder="000000" type="text" class="form-control"
                            id="inputOtp">
                    </div>
                    <div class="mt-4">
                        <button @click="submitOtp()" :disabled="formData.otp_code.length != 6"
                            class="btn btn-primary btn-block">Submit</button>

                        <div class="mt-4 text-end">
                            <button @click="resentNewOtp()" :disabled="countStatus"
                                :class="{ 'text-light': countStatus }" class="btn btn-link">Request New Otp
                                <span v-if="countStatus"> ( {{ countTime }} )</span></button>
                        </div>
                        <small class="opacity-75 mt-5">The verification mail will sent to <i>{{ user.email }}</i></small>
                    </div>
                </div>
            </div>
            <div class="col-md-4 card my-4" v-if="!!user.email_verified_at">
                <div class="card-body">
                    <h5>Your Email is Already Verification</h5>
                    <router-link to="/">Go to Home page</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapState } from 'vuex';
import useFunction from '@/src/js/custom'
export default {
    name: 'VerificationView',
    data() {
        return {
            countTime: 10,
            formData: {
                otp_code: ''
            },
            verificationCheckTime: 0,
        }
    },
    methods: {
        startCount(time) {
            if (time) {
                this.countTime = time;
            }
            let count = setInterval(() => {
                this.countTime--;
                if (this.countTime == 0) {
                    clearInterval(count);
                }
            }, 1000);
        },
        submitOtp() {
            axios.post(this.api + '/email/verification-notification', this.formData, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
                this.formData.otp_code = '';
                if (r.data.success) {
                    this.$router.push('/');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            })
        },
        resentNewOtp() {
            this.startCount(20)
            axios.get(this.api + '/email/verification-notification', this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal)
            })
        },
    },
    computed: {
        ...mapGetters(['api', 'authHeader']),
        ...mapState(['user', 'serverDelayTime']),
        countStatus() {
            if (this.countTime > 0) {
                return true;
            }
            return false;
        }
    },
    mounted() {
        this.startCount();
    },
}
</script>

<style lang="scss" scoped>

</style>