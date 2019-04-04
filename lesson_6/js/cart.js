Vue.component('section-component', {
    props: ['items'],
    template: `<div><section v-for="item in items">
                    <div class="productDetails">
                        <img :src=item.imgSrc>
                        <div class="textProduct">
                            <h3>{{ item.name }}</h3>
                            <h5>Color: <span>Red</span></h5>
                            <h5>Size: <span>Xll</span></h5>
                        </div>
                    </div>
                    <div>\${{ item.price }}</div>
                    <div><input type="number" v-model="item.count" @change="$emit('on_change_count', item)"></div>
                    <div>FREE</div>
                    <div>$<output name="result">{{item.count * item.price}}</output></div>
                    <div>
                        <div class="deleteButton" @click="$emit('on_delete_item', item.id)"></div>
                    </div>
                </section></div>`,
    methods: {}
});

const app = new Vue({
    el: '#app',
    data: {
        cart: [],
        searchQuery: '',
    },
    mounted() {
        fetch(`${API_URL}/cart`)
            .then((response) => response.json())
            .then((items) => {
                this.cart = items;
            });
    },
    computed: {
        isEmptyCart() {
            return this.cart.length === 0;
        },

        totalCart() {
            return this.cart.reduce((acc, item) => acc+= item.count * item.price, 0);
        }

    },
    methods: {
        handleClickDelete(itemId) {
            fetch(`${API_URL}/cart/${itemId}`, {
                method: 'DELETE',
            }).then(() => {
                this.cart.splice(this.cart.findIndex((item) => item.id === itemId), 1);
            });
        },
        
        handleChangeInput(itemCart) {
            const vendorCode = itemCart.id;
            fetch(`${API_URL}/cart/${vendorCode}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({count: +itemCart.count}),
            }).then((response) => response.json())
              .then((updated) => {
                    const itemCartIdx = this.cart.findIndex((item) => item.id === vendorCode);
                    this.cart[itemCartIdx].count = updated.count;
            });
        },
        
        handleFindClick(searchQuery) {
            console.log('Search..');
        },
    }
});