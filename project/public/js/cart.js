const app = new Vue({
    el: '#app',
    data: {
        cart: [],
        searchQuery: '',
        loggedIn: false,
    },
    mounted() {
        fetch(`${API_URL}/cart`)
            .then((response) => response.json())
            .then((items) => {
                this.cart = items;
            });
        this.loggedIn = localStorage.getItem('logged') === 'true';
        
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
        handleClickDelete(event) {
            const itemId = event.target.dataset.id;
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
        
        handleClickProceed() {
            document.location.href = 'checkout.html';
        },
        
        handleClickContinueShopping() {
            document.location.href = 'product.html';
        },
        
        handleClickClearCart() {
            
        },
    }
});