<template>
    <!-- Navbar -->
    <nav class="navbar main_nav_bar navbar-expand-lg navbar-dark bg-dark position-sticky top-0" style="z-index:100">
        <!-- Container wrapper -->
        <div class="container-fluid">
            <!-- Toggle button -->
            <button class="navbar-toggler toggleNavBar" @click="mobileMenuSH()" type="button">
                <i class="fas fa-bars"></i>
            </button>
            <!-- Collapsible wrapper -->
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <!-- Navbar brand -->
                <a class="navbar-brand mt-2 mt-lg-0" href="#">
                    <img src="/img/b-logo.png" class="rounded rounded-circle" width="40" height="40" alt="MDB Logo"
                        loading="lazy" />
                </a>
                <!-- Left links -->
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link :class="{ active: activePage == 'home' }" class="nav-link"
                            to="/">Home</router-link>
                    </li>
                    <li class="nav-item" v-if="isLogin">
                        <a class="nav-link" :href="server + '/chatify'">Message</a>
                    </li>
                    <li class="nav-item" v-if="isLogin">
                        <router-link :class="{ active: activePage == 'my_posts' }" class="nav-link"
                            :to="{ name: 'my_posts' }">My Posts</router-link>
                    </li>
                    <li class="nav-item" v-if="isLogin">
                        <router-link :class="{ active: activePage == 'search' }" class="nav-link"
                            :to="{ name: 'search' }">Search</router-link>
                    </li>
                </ul>
                <!-- Left links -->
            </div>
            <!-- Collapsible wrapper -->

            <!-- Right elements -->
            <div class="d-flex align-items-center">
                <!-- Icon -->
                <!-- <div class="dropdown me-2">
                    <a class="dropdown-toggle d-flex align-items-center hidden-arrow" href="#"
                        id="navbarDropdownMenuLanguage" role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-globe me-1"></i> <span class=" text-uppercase">{{ lang }}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLanguage">
                        <li>
                            <span class="dropdown-item cursor-pointer" @click="chgLanguage('en')">
                                English
                            </span>
                        </li>
                        <li>
                            <span class="dropdown-item cursor-pointer" @click="chgLanguage('mm')">
                                Myanmar
                            </span>
                        </li>
                    </ul>
                </div> -->
                <router-link v-if="isLogin" title="favorite" class="text-reset me-3" :to="{ name: 'favoritePost' }">
                    <span><i class="fa-solid fa-heart"></i></span> {{ favCount }}
                </router-link>
                <!-- Notifications -->
                <div class="dropdown" v-if="isLogin">
                    <a class="text-reset me-3 dropdown-toggle hidden-arrow" href="#" id="navbarDropdownNotification"
                        role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-bell"></i>
                        <span v-if="notificationCount > 0" class="badge rounded-pill badge-notification bg-danger">{{
                            notificationCount
                        }}</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownNotification">
                        <li>
                            <router-link :to="{ name: 'notification' }" class="dropdown-item">See all</router-link>
                        </li>
                    </ul>
                </div>

                <!-- Avatar -->
                <div>
                    <div v-if="!isLogin">
                        <router-link to="/login" class="me-2"><i class="fa-solid fa-arrow-right-to-bracket"></i>
                            Login</router-link>
                        <router-link to="/register" class="ms-2">Register</router-link>
                    </div>
                </div>
                <div class="dropdown" v-if="isLogin">
                    <a class="dropdown-toggle d-flex align-items-center hidden-arrow" href="#"
                        id="navbarDropdownMenuAvatar" role="button" data-mdb-toggle="dropdown" aria-expanded="false">
                        <img v-if="user.profile_photo_path" :src="imagePath + user.profile_photo_path"
                            class="rounded-circle img-30"  alt="Profile" />
                        <img v-else :src="user.profile_photo_url" class="rounded-circle img-30"  alt="Profile" />
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuAvatar">
                        <li>
                            <span class="dropdown-item cursor-pointer" @click="goToMainProfile()"><i
                                    class="fa-solid fa-circle-user"></i>
                                {{ user.name }}
                            </span>
                        </li>
                        <li>
                            <router-link to="/profile" class="dropdown-item"><i class="fa-solid fa-sliders"></i>
                                Profile Settings
                            </router-link>
                        </li>
                        <li>
                            <a @click="logoutProcess()" class="dropdown-item" href="#"><i
                                    class="fa-solid fa-power-off"></i> Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Right elements -->
        </div>
        <!-- Container wrapper -->
    </nav>
    <div class="position-fixed w-100" :class="{ 'd-none': !mobileMenu }" style="z-index:100">
        <ul class="list-group list-group-light">
            <router-link @click="mobileMenuSH()" to="/" class="list-group-item px-3"
                :class="{ 'text-muted': activePage != 'home' }">
                <i class="fa-solid fa-house"></i> Home
            </router-link>
            <a v-if="isLogin" target="_black" @click="mobileMenuSH()" :href="server + '/chatify'"
                class="list-group-item px-3" :class="{ 'text-muted': activePage != 'chat' }">
                <i class="fa-solid fa-message"></i> Message
            </a>
            <router-link v-if="isLogin" @click="mobileMenuSH()" :to="{ name: 'my_posts' }" class="list-group-item px-3"
                :class="{ 'text-muted': activePage != 'my_posts' }">
                <i class="fa-regular fa-credit-card"></i> My Posts</router-link>
            <router-link v-if="isLogin" @click="mobileMenuSH()" :to="{ name: 'search' }"
                :class="{ 'text-muted': activePage != 'search' }" class="list-group-item px-3"><i
                    class="fa-solid fa-magnifying-glass"></i> Search</router-link>
        </ul>
    </div>
    <!-- Navbar -->
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import axios from 'axios';
export default {
    name: 'NavBar',
    data() {
        return {
            mobileMenu: false,
            lang: localStorage.getItem('language'),
        }
    },
    computed: {
        ...mapState(['activePage', 'user', 'favCount', 'server', 'notificationCount']),
        ...mapGetters(['isLogin', 'api', 'authHeader', 'imagePath']),
    },
    methods: {
        logoutProcess() {
            axios.post(this.api + '/logout', {}, this.authHeader).then(r => {
                if (r.data.success) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.reload();
                }
            })
        },
        mobileMenuSH() {
            if (this.mobileMenu) {
                this.mobileMenu = false;
                return;
            }
            this.mobileMenu = true;
        },
        goToMainProfile() {
            this.$router.push({ name: 'profile', params: { id: this.user.id } })
        },
        chgLanguage(lang) {
            localStorage.setItem('language', lang);
            window.location.reload();
        }
    },
    mounted() {
        this.$store.dispatch('getFavCount');
    },
}
</script>

<style lang="scss" scoped>
.list-group-item {
    border: 1px solid #262626;
    border-bottom: 1px ridge #303030;
    background: #262626;
}
</style>