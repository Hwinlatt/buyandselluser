<template>
    <div class="container-fluid" v-if="!pageLoading">
        <ActionBar :title="'Edit Post'"></ActionBar>
        <div class="row">
            <div class="col-md-1"></div>
            <div class="col-md-10 mt-2">
                <div class="card">
                    <div class="card-header">
                        Edit Post
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="previewImages d-flex  flex-wrap">
                                <!-- Old Images  -->
                                <div v-for="(image, index) in oldImages" :key="index" class="position-relative mx-2">
                                    <img :src="imagePath + image" alt="" srcset="">
                                    <button @click="oldImageRemove(index)"
                                        class="fs-6 round rounded-circle fw-bold position-absolute imageRemoveBtn btn btn-sm btn-link"><i
                                            class="fa-solid fa-xmark"></i></button>
                                </div>
                                <!-- New Image  -->
                                <span v-if="previewImages.length > 0" class="d-flex flex-wrap">
                                    <div v-for="(url, index) in previewImages" :key="index"
                                        class="position-relative mx-2">
                                        <img :src="url" alt="" srcset="">
                                        <button @click="removeImage(index)"
                                            class="fs-6 round rounded-circle fw-bold position-absolute imageRemoveBtn btn btn-sm btn-link"><i
                                                class="fa-solid fa-xmark"></i></button>
                                    </div>
                                </span>
                                <div>
                                    <button @click="imageAdd()" class="btn btn-outline-primary imageAddBtn"><i
                                            class="fa-solid fa-plus"></i></button>
                                </div>
                                <input @change="onFileChange" accept="image/*" type="file" multiple
                                    class="form-control d-none  imageAddFiles">
                            </div>
                            <span class="text-danger" v-if="formError.images">{{ formError.images }}</span>
                            <div class="form-group mt-2">
                                <label for="pName">Name</label>
                                <input v-model="formData.name" :class="{ 'is-invalid': formError.name }" id="pName"
                                    type="text" placeholder="Product name" class="form-control">
                                <span class="invalid-feedback">{{ formError.name }}</span>
                            </div>
                            <div class="form-group mt-2">
                                <label for="pCategory">Category</label>
                                <select v-model="formData.category_id" :class="{ 'is-invalid': formError.category_id }"
                                    class="form-select " id="pCategory">
                                    <option class="bg-dark text-light" value="">Please select ...</option>
                                    <option class="bg-dark text-light" :value="category.id"
                                        v-for="(category, index) in defaultVar.category" :key="index">
                                        {{ category.name }}
                                    </option>
                                </select>
                                <span class="invalid-feedback">{{ formError.category_id }}</span>
                            </div>
                            <div class="form-group col-6 mt-2">
                                <label for="pPrice">Price</label>
                                <input v-model="formData.price" :class="{ 'is-invalid': formError.price }" type="number"
                                    class="form-control" id="pPrice">
                                <span class="invalid-feedback">{{ formError.price }}</span>
                            </div>
                            <div class="form-group col-4 mt-2">
                                <label for="pPrice">MMK</label>
                                <select v-model="formData.mmk" class="form-control" id="pCategory">
                                    <option value="ကျပ်">ကျပ်</option>
                                    <option value="သိန်း (ကျပ်)">သိန်း (ကျပ်)</option>
                                </select>
                            </div>
                            <div class="form-group my-3 ms-2">
                                <div class="form-check ">
                                    <input v-model="formData.adjust_price" class="form-check-input" type="checkbox"
                                        id="flexCheckChecked" checked="" autocompleted="">
                                    <label class="form-check-label" for="flexCheckChecked">
                                        စျေးညှိနှိုင်းနိုင်ပါသည်
                                    </label>
                                </div>
                            </div>
                            <div class="row my-2" v-if="formData.category_id">
                                <hr>
                                <h5>Additional Information</h5>
                                <div class="form-group col-6 mt-2">
                                    <label for="pBrand">Brand</label>
                                    <input v-model="additional.brand" type="text" class="form-control"
                                        placeholder="Brand Name (Toyota , Samsung , ...)">
                                </div>
                                <div class="form-group col-6 mt-2">
                                    <label for="pModel">Model</label>
                                    <input v-model="additional.model" type="text" class="form-control"
                                        placeholder="Model Number">
                                </div>
                                <div class="form-group  col-6 mt-2">
                                    <label for="pModel">Type</label>
                                    <select v-model="additional.type" name="" id="" class="form-select">
                                        <option value="ရောင်းမည်">အရောင်း</option>
                                        <option value="ငှားမည်">အငှား</option>
                                    </select>
                                </div>
                                <div class="form-group  col-6 mt-2" v-if="needFashionType">
                                    <label for="pModel">Fashion Type</label>
                                    <select v-model="additional.fashionType" name="" id="" class="form-select">
                                        <option value="">Please Select</option>
                                        <option v-for="(type, index) in fashionTypes" :key="index" :value="type">{{
                                            type
                                        }}</option>
                                    </select>
                                </div>
                                <hr class="my-5">
                            </div>
                            <div class="form-group mt-2 mb-3">
                                <label for="pDesc">Description</label>
                                <textarea v-model="formData.description"
                                    :class="{ 'is-invalid': formError.description }" class="form-control" id="pDesc"
                                    rows="4"></textarea>
                                <span class="invalid-feedback">{{ formError.description }}</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="text-end">
                                <button @click="updateData()" class="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import { mapGetters, mapState } from 'vuex';
import useFunction from '@/src/js/custom'
import ActionBar from '@/components/ActionBar.vue';
import axios from 'axios';
export default {
    name: 'EditPostView',
    components: {
        ActionBar,
    },
    data() {
        return {
            previewImages: [],
            fashionTypes: ['Clothes', 'Footwear', 'Sportswear', 'Traditional', 'Other'],
            additional: {
                model: '',
                type: 'ရောင်းမည်',
                fashionType: '',
                brand: '',
            },
            oldImages: [],
            formData: {
                name: '',
                category_id: '',
                price: '',
                images: [],
                additional: '',
                mmk: 'ကျပ်',
                description: '',
                adjust_price: true
            },
            formError: {
                name: false,
                category_id: false,
                price: false,
                mmk: false,
                images: false,
                description: false,
                adjust_price: false
            },

        }
    },
    methods: {
        getPostData() {
            axios.get(this.api + '/post/edit/' + this.$route.params.id, this.authHeader).then(r => {
                let data = r.data[0];
                this.formData = {
                    name: data.name,
                    category_id: data.category_id,
                    price: data.price,
                    images: [],
                    mmk: data.mmk,
                    description: data.description,
                    adjust_price: data.adjust_price == 1 ? true : false
                }
                this.additional = data.additional;
                this.oldImages = data.images;
            }).catch(err => { useFunction.error(err, this.$swal) })
        },
        updateData() {
            this.formData.additional = JSON.stringify(this.additional);
            let data = this.formData;
            if (this.chooseCategoryName != 'ဖက်ရှင်') {
                this.additional.fashionType = ''
            }
            data.oldImages = this.oldImages;
            axios.post(this.api + '/post/update/' + this.$route.params.id, data, this.authHeader).then(r => {
                useFunction.alert(r.data, this.$swal);
                if (r.data.success) {
                    this.$router.go(-1);
                }
                this.errorsToFalse();
                if (r.data.error) {
                    r.data.error.forEach(error => {
                        this.errorShow(error);
                    });
                }
            }).catch(err => { useFunction.error(err, this.$swal) });
        },
        oldImageRemove(index) {
            console.log(index);
            this.oldImages.splice(index, 1);
        },
        imageAdd() {
            $('.imageAddFiles').click();
        },
        onFileChange(e) {
            const files = e.target.files;
            files.forEach(file => {
                this.formData.images.push(file);
            });
            this.getPreviewUploadImage();
        },
        removeImage(index) {
            this.formData.images.splice(index, 1);
            this.getPreviewUploadImage();
        },
        getPreviewUploadImage() {
            this.previewImages = [],
                this.formData.images.forEach(image => {
                    this.previewImages.push(URL.createObjectURL(image))
                })
        },
        //For Error Validation
        errorShow(error) {
            if (error.includes('name')) {
                this.formError.name = error;
            } else if (error.includes('category')) {
                this.formError.category_id = error;
            } else if (error.includes('price')) {
                this.formError.price = error;
            } else if (error.includes('images')) {
                this.formError.images = error;
            } else if (error.includes('description')) {
                this.formError.description = error;
            }
        },
        errorsToFalse() {
            this.formError = {
                name: false,
                category_id: false,
                price: false,
                mmk: false,
                images: false,
                description: false,
                adjust_price: false
            }
        }
    },
    computed: {
        ...mapState(['defaultVar','pageLoading']),
        ...mapGetters(['api', 'authHeader', 'imagePath']),
        chooseCategoryName() {
            if (this.formData.category_id) {
                let category_name = this.defaultVar.category.filter(e => { return e.id == this.formData.category_id });
                return category_name[0].name;
            }
            return '';
        },
        needFashionType() {
            if (this.chooseCategoryName == 'ဖက်ရှင်') {
                return true;
            }
            return false;
        }
    },
    mounted() {
        this.getPostData();
    },
}
</script>

<style lang="scss" scoped>
.previewImages img {
    width: 70px;
    height: 70px;
    margin: 2px;
}

.imageRemoveBtn {
    top: -14px;
    right: -16px;
    color: white;
}

.imageAddBtn {
    width: 70px;
    height: 70px;
    margin: 2px;
}
</style>