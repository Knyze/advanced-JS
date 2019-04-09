const API_URL = 'http://localhost:3000';

Vue.component('search-wrap', {
    props: ['search_query'],
    template: `<div class="searchWrap">
                    <button class="browseBtn">
                        Browse <i class="fas fa-caret-down"></i>
                    </button>
                    <input type="text" placeholder="Search for item..." v-model="search_query">
                    <button class="findBtn" @click="$emit('on_search', search_query)">
                        <i class="fas fa-search"></i>
                    </button>
                </div>`,
    /*methods: {
        handleFindClick(search_query) {
            this.$emit('on_search', search_query);
            console.log(search_query);
        }
    }*/
});
