<template>
    <div class="h-100">
        <div class="flex items-center justify-between mb-3">
            <h1 v-if="!loading" class="text-3xl font-semibold">
                Create new Product
            </h1>
        </div>
        <div class="bg-white rounded-lg shadow animate-fade-in-down">
            <Spinner v-if="loading"
                class="absolute left-0 top-0 bg-white right-0 bottom-0 flex items-center justify-center z-50" />
            <form v-if="!loading" @submit.prevent="onSubmit">
                <div class="grid grid-cols-3 gap-8 p-3">
                    <div>
                        <label for="field1" :class="[v$.name.$error ? 'text-red-500' : 'text-gray-600']"
                            class="block text-sm font-medium ">Name <span class="text-red-500">*</span></label>
                        <input v-model="product.name" type="text" id="field1" name="field1" placeholder="Enter name" :class="[
                            v$.name.$error ? 'border-red-500 ' : 'border-gray-300',
                        ]"
                            class="block w-full px-3 py-2 border  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">

                    </div>

                    <div>
                        <label for="field1" :class="[v$.price.$error ? 'text-red-500' : 'text-gray-600']"
                            class="block text-sm font-medium text-gray-600">Price <span
                                class="text-red-500">*</span></label>
                        <input v-model="product.price" :class="[
                            v$.price.$error ? 'border-red-500 ' : 'border-gray-300',
                        ]" type="number" id="field1" name="field1" placeholder="Price"
                            class="block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                    </div>

                    <div>
                        <label :class="[v$.category_id.$error ? 'text-red-500' : 'text-gray-600']" for="field1"
                            class="block text-sm font-medium ">Category <span class="text-red-500">*</span></label>
                        <select v-model="product.category_id" :class="[
                            v$.category_id.$error ? 'border-red-500 ' : 'border-gray-300',
                        ]" id="field1" name="field1" placeholder="Select Category"
                            class="block w-full px-3 py-2 border  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                            <option v-for="data in categories" :key="data" :value="data.id">{{ data.name }}</option>
                        </select>
                    </div>

                    <div>
                        <label for="field1" :class="[v$.image.$error ? 'text-red-500' : 'text-gray-600']"
                            class="block text-sm font-medium ">Image <span class="text-red-500">*</span></label>
                        <input :class="[
                            v$.image.$error ? 'border-red-500' : 'border-gray-300',
                        ]" @change="handleImageChange" type="file" id="field1" name="field1"
                            placeholder="Select Category"
                            class="block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                    </div>


                    <div>
                        <label for="field2" class="block text-sm font-medium text-gray-600">Description <span
                                class="text-red-500">*</span></label>
                        <textarea v-model="product.description" name="field2"
                            class="block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sml"></textarea>


                    </div>
                </div>

                <footer class="bg-gray-50 rounded-b-lg px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="submit" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                            text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500">
                        Save
                    </button>
                    <button type="button" @click="onSubmit($event, true)" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                            text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500">
                        Save & Close
                    </button>

                </footer>
            </form>
        </div>
    </div>
</template>
  
<script setup>
import { computed, ref } from 'vue';
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import store from "../../store/index.js";
import Spinner from "../../components/core/Spinner.vue";
import { useRoute, useRouter } from "vue-router";
import axiosClient from "../../axios.js";

const route = useRoute()
const router = useRouter()
store.dispatch('categories')
const categories = ref([]);

const product = ref({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: null
})

const rules = computed(() => {
    return {
        name: { required },
        price: { required },
        category_id: { required },
        image: { required },
    };
});

const v$ = useVuelidate(rules, product.value);
const errors = ref({});

const loading = ref(false)

async function onSubmit($event) {

    const result = await v$.value.$validate();
    if (!result) {
        return;
    }

    loading.value = true
    errors.value = {};
    axiosClient.post('/product', product.value)
        .then((res) => {
            console.log(res.data)
        }).catch((err) => {
            return err;
        })

}

const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    product.value.image = selectedFile;
}



initCategory();
function initCategory() {
    loading.value = true;

    axiosClient.get('/category')
        .then((res) => {
            categories.value = res.data.data;
        })
        .catch((err) => {

        })
        .finally(() => {
            loading.value = false;
        });
}



</script>