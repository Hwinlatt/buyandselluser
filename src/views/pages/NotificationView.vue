<template>
    <div class="container-fluid" v-if="!pageLoading">
        <action-bar title="Notification">
            <div>
                <span v-if="notificationCount > 0">
                    <button @click="getNotification()" class="btn btn-link btn-sm"><i class="fa-solid fa-rotate"></i></button>
                </span>
                <span class="mx-1" v-if="notis.length > 0">
                    <button @click="makeAllRead()" class="btn btn-secondary btn-sm">Make All Read</button>
                    <button @click="deleteNoti()" class="btn btn-danger ms-1 btn-sm">Delete All</button>
                </span>
            </div>
        </action-bar>
        <div class="row">
            <div class="col-md-12">
                <ul class="list-group list-group-light" v-if="notis.length > 0">
                    <li v-for="(noti, index) in notis" :key="index" class="list-group-item">
                        <button @click="deleteNoti(noti.id, index)" class="btn btn-danger float-end btn btn-sm"><i
                                class="fa-solid fa-trash"></i></button>
                        <i v-if="!noti.status" class="fa-solid fa-circle me-2 text-danger"></i> <span
                            v-html="noti.description"></span>
                        <small class="text-muted ms-3"><Timeago :datetime="new Date(noti.created_at)"></Timeago></small>
                    </li>
                </ul>
                <h5 v-else class="text-center text-muted mt-5">{{ get_noti_status }}</h5>
            </div>
        </div>
    </div>
</template>

<script>
import ActionBar from '@/components/ActionBar.vue'
import { mapGetters, mapState } from 'vuex'
import useFunction from '@/src/js/custom'
import axios from 'axios'
import {Timeago} from 'vue2-timeago'
export default {
    components: { ActionBar,Timeago },
    name: 'NotificationView',
    data() {
        return {
            notis: [],
            get_noti_status: '',
        }
    },
    methods: {
        getNotification() {
            this.get_noti_status = 'Please Wait ...'
            axios.get(this.api + '/notification', this.authHeader).then(r => {
                this.get_noti_status = 'There is nothing to show.'
                this.notis = r.data;
            }).catch(err => {
                useFunction.error(err, this.$swal);
            })
        },
        makeAllRead() {
            axios.get(this.api + '/notification/all_read', this.authHeader).then(r => {
                console.log(r.data);
                this.$store.dispatch('getNotiCount');
                if (r.data.success) {
                    this.notis.forEach(noti => {
                        noti.status = 'read'
                    });
                }
            })
        },
        deleteNoti(nId, index) {
            let data = {
                id: nId
            }
            axios.post(this.api + '/notification/destroy', data, this.authHeader).then(r => {
                if (r.data.success) {
                    if (index) {
                        this.notis.splice(index, 1);
                    } else {
                        this.getNotification()
                    }
                }
            })
        }
    },
    computed: {
        ...mapState(['user', 'pageLoading','notificationCount']),
        ...mapGetters(['api', 'authHeader']),
    },
    mounted() {
        this.getNotification();
    },
}
</script>

<style lang="scss" scoped>

</style>