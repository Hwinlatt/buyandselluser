<template>
    <keep-alive>
        <div class="container-fluid" :class="{ 'd-none': pageLoading }">
            <div class="row my-2">
                <div class="col-md-12">
                    <div class="row d-flex justify-content-center">
                        <div class="col-7">
                            <input @keypress.enter="searchPost()" @keydown="isAfterSearch = false" v-model="searchKey"
                                type="text" class="form-control" placeholder="Search in Buy&Sell">
                        </div>
                        <div class="col-1 p-0 m-0">
                            <button @click="searchPost()" class="btn btn-primary text-center"><i
                                    class="fa-solid fa-magnifying-glass"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md">
                    <span @click="removeRecentAll()"
                        class="text-light opacity-75 me-3 float-end cursor-pointer user-select-none">Clear</span>
                    <h6 class="ms-2">Your Recent Search</h6>
                    <div class="searchHistory">
                        <span v-for="(key, index) in recentSearch" :key="index"
                            class=" cursor-pointer fs-6 m-1 badge bg-gray p-2 fw-light history_text"><span
                                @click="searchMakeByRecent(key)">{{ key }}</span>
                            <i @click="removeRecent(index)" class="history_cross ms-2 fa-solid fa-xmark"></i></span>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-12">
                    <h6 class="ms-2">Filter By Categories</h6>
                    <div class="filterCategories">
                        <span @click="filterCategory('')"
                            class="badge fs-6 m-1 cursor-pointer bg-gray p-2 fw-light category_text"
                            :class="{ 'bg-primary': filterBy.category == '' }">
                            <i class="fa-solid fa-border-all"></i> All <span v-if="mainResult.length > 0"> . {{ mainResult.length }}</span></span>
                        <span @click="filterCategory(category.id)" v-for="(category, index) in defaultVar.category"
                            :key="index" :class="{ 'bg-primary': filterBy.category == category.id }"
                            class="badge fs-6 m-1 cursor-pointer bg-gray p-2 fw-light category_text">
                            <span v-html="category.icon"></span> {{ category.name }} 
                            <span class="" v-if="mainResult.length > 0"> . {{countPostWithCategory(category.id)}}</span></span>
                    </div>
                </div>
                <div class="col-md-12 mt-2" v-if="mainResult.length > 0">
                    <h6 class="ms-2">Filter By Location</h6>
                    <div class="ms-2">
                        <div class="row">
                            <div class="col-sm-3 mt-1">
                                <select v-model="filterBy.region" class="form-control text-capitalize">
                                    <option value="">All</option>
                                    <option class=" text-capitalize" :value="region.name"
                                        v-for="(region, index) in defaultVar.region" :key="index">
                                        {{ region.name }} (<span>{{ countPostWithRegion(region.name) }}</span>)
                                    </option>
                                </select>
                            </div>
                            <div class="col-sm-3 mt-1">
                                <select class="form-control text-capitalize" v-model="filterBy.city">
                                    <option value="">All</option>
                                    <option class="text-capitalize" :value="city.city"
                                        v-for="(city, index) in filterCity" :key="index">
                                        {{city.city}} (<span>{{ countPostWithCity(city.city) }}</span>)
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-3" v-if="filterResult.length > 0">
                <product-container :posts="filterResult"></product-container>
            </div>
            <div v-else>
                <h3 class="text-center mt-5 text-muted">{{ resultMessage }}</h3>
            </div>
            <div>
                <h3 class="text-center mt-5 text-muted">{{ filterResultMessage }}</h3>
            </div>
            <div class="my-6" v-if="users.length > 0">
                <h3 class="text-center">Users</h3>
                <div class=" line-mf mb-3"></div>
                <div class="row align-items-center justify-content-start">
                    <div class="col-md-3 p-1 rounded" @click=" goToProfile(user.id)" v-for="(user,index) in users" :key="index">
                        <div class=" d-flex bg-dark cursor-pointer bg-gradient">
                            <img class="img-70 rounded" v-if="user.profile_photo_path" :src="imagePath+profile_photo_path" alt="" srcset="">
                            <img class="img-70 rounded" v-else :src="user.profile_photo_url" alt="" srcset="">
                            <div class="ms-2">
                                <span>{{ user.name }}</span> <br>
                                <small class="text-muted"><i class="fa-solid fa-star"></i>{{ user.rating }}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </keep-alive>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import ProductContainer from '@/components/ProductContainer.vue';
import axios from 'axios';
export default {
    name: 'SearchView',
    components: {
        ProductContainer
    },
    data() {
        return {
            resultMessage: '',
            isAfterSearch: false,
            post_limit: 5,
            searchKey: '',
            filterBy: {
                category: '',
                city: '',
                region: '',
            },
            filterResultMessage: '',
            mainResult: [],
            recentSearch: [],
            users:[],
        }
    },
    methods: {
        searchPost() {
            this.backToStart();
            this.resultMessage = 'Searching ...'
            if (this.searchKey.length > 0) {
                this.storeRecentSearch();
                axios.get(this.api + '/posts/search/' + this.searchKey + '?limit=' + this.post_limit, this.authHeader).then(r => {
                    this.mainResult = r.data.posts;
                    this.users = r.data.users;
                    if (r.data.posts.length == 0) {
                        this.resultMessage = 'There is nothing to show';
                    } else {
                        this.resultMessage = ''
                    }
                    this.isAfterSearch = true;
                }).catch(err => {
                    this.isAfterSearch = true;
                    this.resultMessage = ''
                })
            } else {
                this.$swal.fire('Warning', 'At least two characters are required to search.', 'info');
                this.resultMessage = ''
            }
        },
        filterCategory(index) {
            this.filterBy.category = index
        },
        backToStart() {
            this.isAfterSearch = false;
            this.filterBy = {
                category: '',
                city: '',
                region: '',
            },
                this.mainResult = [];
        },
        storeRecentSearch(index) {
            if (!this.recentSearch.includes(this.searchKey) && !index) {
                this.recentSearch.unshift(this.searchKey);
            }
            localStorage.setItem('recentSearch', JSON.stringify(this.recentSearch))
        },
        removeRecent(index) {
            this.recentSearch.splice(index, 1);
            this.storeRecentSearch(true)
        },
        searchMakeByRecent(key) {
            this.searchKey = key;
            this.searchPost();
        },
        removeRecentAll() {
            this.recentSearch = [];
            this.storeRecentSearch(true);
        },
        countPostWithCategory(id) {
            let result = this.mainResult.filter(e => { return e.category_id == id });
            return result.length;
        },
        countPostWithRegion(region) {
            let result = this.mainResult.filter(e => { return e.region == region });
            return result.length;
        },
        countPostWithCity(city  ) {
            let result = this.mainResult.filter(e => { return e.city == city });
            return result.length;
        },
        goToProfile(uId){
            this.$router.push({name:'profile',params:{id:uId}})
        }
    },
    computed: {
        ...mapState(['defaultVar', 'pageLoading', 'cacheData']),
        ...mapGetters(['api', 'imagePath', 'authHeader']),
        filterResult() {
            let result = this.mainResult;
            if (this.filterBy.category != '') {
                result = this.mainResult.filter(e => { return e.category_id == this.filterBy.category })
            }
            if (this.filterBy.region != '') {
                result = result.filter(e => { return e.region == this.filterBy.region })
            }
            if (this.filterBy.city != '') {
                result = result.filter(e => { return e.city == this.filterBy.city })
            }
            return result;
        },
        filterCity() {
            if (this.filterBy.region != '') {
                let result = this.defaultVar.city.filter(e => { return e.region == this.filterBy.region })
                return result;
            }
            if (this.filterBy.region == '') {
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.filterBy.city = '';
            }
            return [];
        },
    },
    mounted() {
        this.$store.dispatch('activePage', 'search');
        if (!localStorage.getItem('recentSearch')) {
            localStorage.setItem('recentSearch', JSON.stringify([]))
        }
        // Restore Cache Data
        if (this.cacheData.searchPage.status) {
            let cache = this.cacheData.searchPage;
            this.isAfterSearch = cache.isAfterSearch;
            this.searchKey = cache.searchKey;
            this.filterBy = {
                category: cache.filterBy.category,
                city: cache.filterBy.city,
                region: cache.filterBy.region,
            },
                this.mainResult = cache.mainResult;
        }
        //get Recent Search
        this.recentSearch = JSON.parse(localStorage.getItem('recentSearch')).reverse();
    },
    unmounted() {
        let cloneData = {
            status: true,
            isAfterSearch: this.isAfterSearch,
            searchKey: this.searchKey,
            filterBy: {
                category: this.filterBy.category,
                city: this.filterBy.city,
                region: this.filterBy.region,
            },
            mainResult: this.mainResult,
        }
        this.$store.dispatch('addCache', { name: 'searchPage', data: cloneData });
    },
}
</script>

<style lang="scss" scoped>
.history_cross {
    opacity: 0.7;
}

.history_cross:hover {
    opacity: 1;
}

.history_text:hover,
.category_text:hover {
    background: var(--primary-color);
    color: black;
}
</style>