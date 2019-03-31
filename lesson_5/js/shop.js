const mainVue = new Vue({
    el: '#main',
    data: {
        catalog: [],
        cart: [],
    },
    mounted() {
        fetch('http://localhost:3000/catalog.json')
            .then((response) => response.json())
            .then((items) => {
                this.catalog = items;
            });
        fetch('http://localhost:3000/cart')
            .then((response) => response.json())
            .then((items) => {
                this.cart = items;
            });
    },
    computed: {

    },
    methods: {
        getProductInCatalogByVendorCode(vendorCode) {
            for (var i = 0; i < this.catalog.length; i++)
                if (this.catalog[i].vendorCode === vendorCode)
                    return this.catalog[i];
        },

        getIndexProductInCartByVendorCode(Code) {
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i].vendorCode === Code) {
                    return i;
                }
            }
            return -1;
        },

        hundleShopClick(event) {
            if (event.target.offsetParent.className !== 'wrapProduct')
                return;
            const vendorCode = event.target.offsetParent.dataset.vendor_code;
            
            const indexProductInCart = this.getIndexProductInCartByVendorCode(vendorCode);

            if (indexProductInCart !== -1) {
                alert('Товар уже добавлен в корзину');
                return;
            }

            const item = this.getProductInCatalogByVendorCode(vendorCode);
            fetch('http://localhost:3000/cart', {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(() => {
                this.cart.push(item);
            });
        },
    }
});
