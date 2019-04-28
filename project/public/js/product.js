Vue.component('pagination', {
    props: ['pages', 'current_page'],
    template: `<div class="paginationWrap">
                <div class="pagination">
                    <a href="#" @click="$emit('on_click_page', backPage)">&lt;</a>
                    <a v-for="page in getArrayPages" href="#" @click="$emit('on_click_page', page)" :class="{currentPage:(page === current_page)}">
                        {{ page }}
                    </a>
                    <span v-if="isSpan">...</span>
                    <a v-if="isSpan" href="#" @click="$emit('on_click_page', pages)">{{ pages }}</a>
                    <a href="#" @click="$emit('on_click_page', forwardPage)">&gt;</a>
                </div>
                <button>View All</button>
               </div>`,

    computed: {
        getArrayPages() {
            const arrayPages = [this.current_page,];
            const curPage = this.current_page;
            const pages = this.pages + 1;

            for (let i = 1; i < PAGE_COUNT; i++) {
                if ((curPage + i) < pages) {
                    arrayPages.push(curPage + i);
                };
                if (arrayPages.length === PAGE_COUNT) {
                    break;
                };
                if ((curPage - i) > 0) {
                    arrayPages.unshift(curPage - i);
                };
                if (arrayPages.length === PAGE_COUNT) {
                    break;
                };
            };
            return arrayPages;
        },
        
        isSpan() {
            return (this.pages > PAGE_COUNT) && (this.pages > (this.current_page + PAGE_COUNT/2));
        },
        
        backPage() {
            if (this.current_page <= 1)
                return 1
            else
                return this.current_page - 1;
        },
        
        forwardPage() {
            if (this.current_page >= this.pages)
                return 1
            else
                return this.current_page + 1;
        },
        
    },

    mounted() {
        
    },
    
    methods: {
        
    },
});


const app = new Vue({
    el: '#app',
    data: {
        catalog: [],
        cart: [],
        searchQuery: '',
        loggedIn: false,
        filterProduct: {
            size: {
                sizeXXS : false,
                sizeXS : false,
                sizeS : false,
                sizeM : false,
                sizeL : false,
                sizeXL : true,
                sizeXXL : true,
            }
        },
        sortProduct: 'Name',
        showProduct: '09',
        pageProduct: 1,
        totalPages: 1,
    },
    mounted() {
        fetch(`${API_URL}/catalog/${this.pageProduct}`)
            .then((response) => response.json())
            .then((items) => {
                this.totalPages = items.totalPages;
                this.catalog = items.catalog;
            });
        fetch(`${API_URL}/cart`)
            .then((response) => response.json())
            .then((items) => {
                this.cart = items;
            });
        this.loggedIn = localStorage.getItem('logged') === 'true';
    },
    computed: {
        filteredItems() {
            const regExp = new RegExp(this.searchQuery, 'i');
            return this.catalog.filter((item) => regExp.test(item.name));
        }

    },
    methods: {
        handleShopClick(itemClicked) {
            fetch(`${API_URL}/cart`)
                .then((response) => response.json())
                .then((items) => {
                    this.cart = items;
                    const vendorCode = itemClicked.id;
                    const itemCartIdx = this.cart.findIndex((item) => item.id === vendorCode);

                    if (itemCartIdx !== -1) {
                        fetch(`${API_URL}/cart/${vendorCode}`, {
                            method: 'PATCH',
                            headers: {'Content-Type': 'application/json',},
                            body: JSON.stringify({count: (this.cart[itemCartIdx].count + 1)}),
                        }).then((response) => response.json())
                          .then((updated) => this.cart[itemCartIdx].count = updated.count);
                    } else {
                        const item = this.catalog.find((item) => item.id === vendorCode);
                        fetch(`${API_URL}/cart`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json',},
                                body: JSON.stringify({ ...item, count: 1}),
                            }).then((response) => response.json())
                              .then((created) => this.cart.push(created));
                    };
                });
        },
        handleFindClick(searchQuery) {
            this.searchQuery = searchQuery;
            //console.log('Search..');
        },
        
        handleClickPage(page) {
            fetch(`${API_URL}/catalog/${page}`)
            .then((response) => response.json())
            .then((items) => {
                this.totalPages = items.totalPages;
                this.pageProduct = page;
                this.catalog = items.catalog;
            });
        },
        
    }

});
