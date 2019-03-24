/* Хорошие наименования я потом у вас спишу )) */

class CartList {
    constructor() {
        this.cart = [];
    }
    
    //Получение списка товаров
    getItems() {}
    
    //Отправка списка товаров
    postItems() {}
    
    //Добавить товар в корзину
    addItem(item) {}
    
    //Удалить товар из корзины
    deleteItem(item) {}
    
    //Посчитать стоимость корзины
    getTotal() {
        let total = 0;
        for (let i = 0; i < this.cart.length; i++)
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
    constructor(name, price, count, imgSrc) {}
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