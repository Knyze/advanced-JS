const catalog = [
    {
        vendorCode: 'product1',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product1.jpg',
    },
    {
        vendorCode: 'product2',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product2.jpg',
    },
    {
        vendorCode: 'product3',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product3.jpg',
    },
    {
        vendorCode: 'product4',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product4.jpg',
    },
    {
        vendorCode: 'product5',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product5.jpg',
    },
    {
        vendorCode: 'product6',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product6.jpg',
    },
    {
        vendorCode: 'product7',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product7.jpg',
    },
    {
        vendorCode: 'product8',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product8.jpg',
    },
    {
        vendorCode: 'product9',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product9.jpg',
    },/*
    {
        vendorCode: 'product10',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product1.jpg',
    },
    {
        vendorCode: 'product11',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product2.jpg',
    },
    {
        vendorCode: 'product12',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product3.jpg',
    },
    {
        vendorCode: 'product13',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product4.jpg',
    },
    {
        vendorCode: 'product14',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product5.jpg',
    },
    {
        vendorCode: 'product15',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product6.jpg',
    },
    {
        vendorCode: 'product16',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product7.jpg',
    },
    {
        vendorCode: 'product17',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product8.jpg',
    },
    {
        vendorCode: 'product18',
        name: 'MANGO PEOPLE T-SHIRT',
        imgSrc: 'images/product/product9.jpg',
    },*/
];

function getRandomNumber(max) {
    return Math.trunc(Math.random() * (max + 1));
}

// Создаю массив товаров с рандомной ценой
// Как это попроще сделать?
const goods = catalog.map(item => {
    const {...product} = item;
    product.price = (getRandomNumber(16) + 4) * 5;
    return product;
})

const renderGoodsItem1 = item => {
    const {vendorCode, name, imgSrc, price} = item;
    return `<div class="wrapProduct"></div>`;
};

const renderGoodsItem = item => {
    const {vendorCode, name, imgSrc, price} = item;
    return `<div class="wrapProduct" data-id="${vendorCode}">
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

const renderGoodsList = (list) => {
    let goodsList = list.map(item => renderGoodsItem(item));
    document.querySelector('.displayProduct').innerHTML = goodsList.join('');
}