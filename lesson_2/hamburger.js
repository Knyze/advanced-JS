class Hamburger {
    constructor(size, stuffing) {
        this.size = size;
        this.stuffing = stuffing;
        this.toppings = [];
    }
    
    addTopping(topping) {
        this.toppings.push(topping);
    }
    
    removeTopping(topping) {
        for (let i = 0; i < this.toppings.length; i++) {
            if (this.toppings[i] === topping)
                this.toppings.splice(i, 1);
        }
    }
    
    getToppings(topping) {
        return this.toppings;
    }
    
    getSize() {
        return this.size;
    }
    
    getStuffing() {
        return this.stuffing;
    }
    
    calculatePrice() {
        let totalPrice = 0;
        totalPrice += (this.size === 'big') ? 100 : 50;
        switch(this.stuffing) {
            case 'cheese': totalPrice += 10;
                break;
            case 'salad': totalPrice += 20;
                break;
            case 'potato': totalPrice += 15;
        }
        for (let i = 0; i < this.toppings.length; i++) {
            totalPrice += (this.toppings[i] === 'flavouring') ? 15 : 0;
            totalPrice += (this.toppings[i] === 'mayo') ? 20 : 0;
        }
        return totalPrice;
    }
    
    calculateCalories() {
        let totalCalories = 0;
        totalCalories += (this.size === 'big') ? 40 : 20;
        switch(this.stuffing) {
            case 'cheese': totalCalories += 20;
                break;
            case 'salad': totalCalories += 5;
                break;
            case 'potato': totalCalories += 10;
        }
        for (let i = 0; i < this.toppings.length; i++) {
            totalCalories += (this.toppings[i] === 'mayo') ? 5 : 0;
        }
        return totalCalories;
    }
}
