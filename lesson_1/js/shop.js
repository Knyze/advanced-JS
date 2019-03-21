function getRandomNumber(max) {
    return Math.trunc(Math.random() * (max + 1));
}

function countBasketPrice(cart) {
    var total = 0;
    var quantity = 0;
    for (var i = 0; i < cart.length; i++) {
        total += cart[i][0].price * cart[i][1];
        quantity += cart[i][1];
    }
    return [quantity, total];
}

function pluralize(number, words) {
    if ([11,12,13,14].includes(number % 100))
        return words[2];
    if (number % 10 === 1) {
        return words[0];
    }
    if ([2,3,4].includes(number % 10)) {
        return words[1]
    }
    return words[2];
}

function createRandomCatalog() {

    var catalog = [
        {
            vendorCode: 'product0',
            name: 'BLAZE LEGGINGS',
            imgSrc: 'images/BLAZE_LEGGINGS.png',
            },
        {
            vendorCode: 'product1',
            name: 'ALEXA SWEATER',
            imgSrc: 'images/ALEXA_SWEATER.png',
            },
        {
            vendorCode: 'product2',
            name: 'AGNES TOP',
            imgSrc: 'images/AGNES_TOP.png',
            },
        {
            vendorCode: 'product3',
            name: 'SYLVA SWEATER',
            imgSrc: 'images/SYLVA_SWEATER.jpg',
        }
    ]

    for (var i = 0; i < catalog.length; i++) {
        catalog[i].price = (getRandomNumber(16) + 4) * 5;
    }

    return catalog;
}

function bildShop(catalog) {

    var $wrapAttend = document.querySelector('.wrapAttend');
    var $wrapProduct = $wrapAttend.querySelector('.wrapProduct');

    for (var i = 0; i < catalog.length; i++) {
        var $product = $wrapProduct.cloneNode(true);
        $product.id = catalog[i].vendorCode;
        $product.classList.toggle('invisible');
        $product.querySelector('.imgProduct').children[0].src = catalog[i].imgSrc;
        $product.querySelector('.imgProduct').children[0].alt = catalog[i].name;
        $product.querySelector('.textProduct').children[0].textContent = catalog[i].name;
        $product.querySelector('.textProduct').children[1].textContent = '$' + catalog[i].price;
        $wrapAttend.insertBefore($product, $wrapAttend.children[i]);
    }
}

function hundleShopClick(event) {

    if (event.target.offsetParent.className === 'wrapProduct') {
        var vendorCode = event.target.offsetParent.id;
        addProductToCart(vendorCode);
        buildShoppingCart();
    }
}

function getIndexProductInCart(vendorCode) {

    for (var i = 0; i < cart.length; i++) {
        if (cart[i][0].vendorCode === vendorCode) {
            return i;
        }
    }
    return -1;
}

function getProductInCatalogByVendorCode(vendorCode) {

    for (var i = 0; i < catalog.length; i++) {
        if (catalog[i].vendorCode === vendorCode) {
            return catalog[i];
        }
    }
}

function addProductToCart(vendorCode) {

    var indexProductInCart = getIndexProductInCart(vendorCode);
    if (indexProductInCart === -1) {
        cart.push([getProductInCatalogByVendorCode(vendorCode), 1]);
    } else {
        cart[indexProductInCart][1] += 1;
    }
}

function buildShoppingCart() {
    var $shopping = document.querySelector('.shopping');

    //очистка корзины
    while ($shopping.children.length > 4) {
        $shopping.removeChild($shopping.children[3]);
    }

    $shopping.classList.remove('invisible');

    for (var i = 0; i < cart.length; i++) {
        var $section = $shopping.children[2].cloneNode(true);
        $section.classList.toggle('invisible');

        $section.lastElementChild.children[0].alt = cart[i][0].vendorCode;
        $section.querySelector('.productDetails').children[0].src = cart[i][0].imgSrc;
        $section.querySelector('.textProduct').children[0].textContent = cart[i][0].name;
        $section.children[1].textContent = cart[i][0].price;
        $section.children[2].children[0].value = cart[i][1];
        $section.children[4].children[0].value = cart[i][0].price * cart[i][1];
        $shopping.insertBefore($section, $shopping.children[i + 3]);
    }
    
    var total = countBasketPrice(cart);

    $shopping.lastElementChild.children[1].textContent = 'В корзине ' +
        total[0] + ' ' + pluralize(total[0], ['товар','товара','товаров']) + ' на сумму $' + total[1];
    hundleBackClick();
}

function hundleClearButtonClick() {
    cart = [];
    var $shopping = document.querySelector('.shopping');
    $shopping.classList.add('invisible');
}

function hundleClearClick(event) {
    cart.splice(getIndexProductInCart(event.alt), 1);
    buildShoppingCart();
}

function hundleNumberChange(event) {
    var $section = event.parentElement.parentElement;
    var indexChangeCart = getIndexProductInCart($section.lastElementChild.children[0].alt);
    cart[indexChangeCart][1] = +event.value;
    buildShoppingCart();
}

function hundleImageShoppingClick(event) {
    if (event.target.classList.contains('image')) {
        var $overlay = document.querySelector('.overlay');
        $overlay.children[0].src = event.target.src;
        $overlay.classList.remove('invisible');
    }
}

function hundleOverlayClick(event) {
    if (!event.target.classList.contains('modalImage')) {
        var $overlay = document.querySelector('.overlay');
        $overlay.classList.add('invisible');
    }
}

function hundleFurtherClick() {
    var $comment = document.querySelector('.comment');
    var $shopping = document.querySelector('.shopping');
    $shopping.classList.add('invisible');
    $comment.classList.remove('invisible');
}

function hundleBackClick() {
    var $comment = document.querySelector('.comment');
    var $shopping = document.querySelector('.shopping');
    $shopping.classList.remove('invisible');
    $comment.classList.add('invisible');
}

