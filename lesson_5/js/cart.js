const mainVue = new Vue({
    el: '#main',
    data: {
        cart: [],
    },
    mounted() {
        fetch('http://localhost:3000/cart')
            .then((response) => response.json())
            .then((items) => {
                items.map((item) => {
                    item.count = 1;
                })
                this.cart = items;
            });
    },
    computed: {
        isEmptyCart() {
            return this.cart.length === 0;
        },

        totalCart() {
            let total = 0;
            for (let i = 0; i < this.cart.length; i++)
                total +=this.cart[i].count * this.cart[i].price;
            return total;
        }

    },
    methods: {
        getIndexProductInCart(id) {
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === id) {
                    return i;
                }
            }
            return -1;
        },

        handleClickDelete(event) {
            const itemId = +event.target.dataset.id;
            fetch(`http://localhost:3000/cart/${itemId}`, {
                method: 'DELETE',
            }).then(() => {
                this.cart.splice(this.getIndexProductInCart(itemId), 1);
            });
        },
    }
});