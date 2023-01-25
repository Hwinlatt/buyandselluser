<template>
    <div class="row my-1 action_bar">
        <div class="col-md-12 m-0 p-0 d-flex justify-content-between align-items-center">
            <div class="d-flex m-0 p-0 align-items-center">
                <button @click="$router.go(-1)" class="btn btn-link"><i
                        class="fa-solid fa-arrow-left fs-6"></i></button>
                <span>{{ title }}</span>
            </div>
            <div class="">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            height: ''
        }
    },
    name: 'ActionBar',
    props: {
        title: {
            type: String,
            default: ''
        },
    },
}
</script>

<style lang="scss" scoped>

</style>