const renderGoodsItem = item => {
    const {
        vendorCode,
        name,
        imgSrc,
        price
    } = item;
    return `<div class="wrapProduct" data-vendor_code="${vendorCode}">
                <div class="addProduct">
                    Add to Cart
                </div>
                <div class="imgProduct">
                    <img src="${imgSrc}" alt="${vendorCode}">
                </div>
                <div class="textProduct">
                    <h6>${name}</h6>
                    <p>$${price.toFixed(2)}</p>
                </div>
            </div>`;
};

/*function sendRequest(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(JSON.parse(xhr.responseText));
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}*/

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200)
                    resolve(JSON.parse(xhr.responseText));
                else
                    reject(xhr.statusText);
            }
        }
    });
}

class GoodsList {
    constructor() {
        this.goods = [1];
    }

    getItems() {
        return new Promise((resolve, reject) => {
            const promise = sendRequest('http://localhost:3000/catalog.json');
            promise.then(
                (list) => {
                    this.goods = list.map(item => new ItemGoods(item));
                    resolve(this.goods);
                },
                (error) => {
                    reject(error);
                });
        });
    }

    renderGoodsList(list) {
        const goodsList = list.map(item => renderGoodsItem(item));
        document.querySelector('.displayProduct').innerHTML = goodsList.join('');
    }
}

class ItemGoods {
    constructor(item) {
        //const {...this} = item;
        this.name = item.name;
        this.price = item.price;
        this.imgSrc = item.imgSrc;
        this.vendorCode = item.vendorCode;
    }
}

class CartList {
    constructor() {
        this.items = [];
    }

    //Получение списка товаров
    getItems() {
        return new Promise((resolve, reject) => {
            const promise = sendRequest('http://localhost:3000/cart.json');
            promise.then(
                (items) => {
                    this.items = items.map(item => new ItemCart(item));
                    resolve(this.items);
                },
                (error) => {
                    reject(error);
                });
        });
    }

    //Отправка списка товаров
    postItems() {}

    //Добавить товар в корзину
    addItem(item) {
        this.items.push(new ItemCart(item));
    }

    //Удалить товар из корзины
    deleteItem(item) {}

    //Посчитать стоимость корзины
    getTotal() {
        let total = 0;
        for (let i = 0; i < this.items.length; i++)
            total += this.cart[i].getSubTotal();
        return total;
    }

    //Посчитать кол-во товаров
    getCount() {}

    //Вернуть кол-во наименований
    getCountList() {}

    //Проверка пустая корзина или нет
    isEmptyCart() {}

    //Сформировать верстку на страницу корзины
    renderCartList() {}

    //Возможно, сформировать верстку еще куда-нибудь
    renderCartShortList() {}
}

class ItemCart {
    constructor(item) {
        this.name = item.name;
        this.price = item.price;
        this.imgSrc = item.imgSrc;
        this.count = 1;
    }
    /* Это то, что мы счас используем. Вообще, наверное их должно быть больше
    И элемент корзины, и элемент каталога должны быть как то связаны? */

    //Установить количество
    setCount(count) {}

    //Вернуть количество
    getCount() {}

    //Посчитать субТотал
    getSubTotal() {
        return this.price * this.count;
    }

    //Сформировать верстку товара в корзине
    renderCartItem() {}

    //Также, возможно сформировать верстку для какой-нибудь всплывающей корзины
    renderCartShortItem() {}
}

function hundleShopClick(event) {

    if (event.target.offsetParent.className === 'wrapProduct') {
        console.log(event.target.offsetParent.dataset.vendor_code);
    }
}
