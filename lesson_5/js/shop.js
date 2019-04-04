const API_URL = 'http://localhost:3000';

const mainVue = new Vue({
    el: '#main',
    data: {
        catalog: [],
        cart: [],
    },
    mounted() {
        fetch(`${API_URL}/catalog`)
            .then((response) => response.json())
            .then((items) => {
                this.catalog = items;
            });
        fetch(`${API_URL}/cart`)
            .then((response) => response.json())
            .then((items) => {
                this.cart = items;
            });
    },
    computed: {

    },
    methods: {
        hundleShopClick(itemClicked) {
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
        }

    }

});
