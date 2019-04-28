const API_URL = 'http://localhost:3000';
const PAGE_COUNT = 6;
const regExpName = /^\w{5,}$/;
const regExpTel = /^\d{3,}$/;
const regExpEmail = /^\w*[.-]?\w*[@][a-zA-Z]*.[a-zA-Z]{2,4}$/;
const regExpCard = /^\d{16}$/;

function validationUser(user) {
    const wrongField = {};
    let wrong = false;
    if (user.name) {
        wrongField.user = !regExpName.test(user.name);
        wrong = !regExpName.test(user.name) || wrong;
    }
    if (user.lastName) {
        wrongField.lastName = !regExpName.test(user.lastName);
        wrong = !regExpName.test(user.lastName) || wrong;
    }
    if (user.phone) {
        wrongField.phone = !regExpTel.test(user.phone);
        wrong = !regExpTel.test(user.phone) || wrong;
    }
    if (user.creditCard) {
        wrongField.creditCard = !regExpCard.test(user.creditCard);
        wrong = !regExpCard.test(user.creditCard) || wrong;
    }
    if (user.email) {
        wrongField.email = !regExpEmail.test(user.email);
        wrong = !regExpEmail.test(user.email) || wrong;
    }
    wrongField.wrong = wrong;
    return wrongField;
}


Vue.component('search-wrap', {
    props: ['search_query'],
    template: `<div class="searchWrap">
                    <button class="browseBtn">
                        Browse <i class="fas fa-caret-down"></i>
                    </button>
                    <input type="text" placeholder="Search for item..." v-model="search_query">
                    <button class="findBtn" @click="$emit('on_search', search_query)">
                        <i class="fas fa-search"></i>
                    </button>
                </div>`,
});


Vue.component('account-component', {
    props: ['logged_in', 'btnClick'],
    template: `<div class="account">
                    <a class="headerCart" href="shoppingCart.html">
                        <img  src="images/cart.png" alt="headerCart" @click="handleClickCart">
                    </a>
                    <button class="accountBtn" :class="{ accountBtnLogged : isLogged}" @click="handleClickBtn">
                        My Account<i class="fas fa-caret-down"></i>
                    </button>

                    <profile-menu-component v-if="isLogged && btnClick" @on_logout="handleClickLogout">
                    </profile-menu-component>
                    
                    <authentication-component  v-if="!isLogged &&btnClick">
                    </authentication-component>
                    
               </div>`,

    computed: {
        isLogged() {
            return this.logged_in;
        },
    },

    mounted() {},
    
    methods: {
        handleClickBtn() {
            this.btnClick = !this.btnClick;
        },
        
        handleClickCart() {
            document.location.href = 'shoppingCart.html';
        },
        
        handleClickLogout() {
            this.logged_in = false;
            this.btnClick = false;
            localStorage.setItem('logged', false);
            localStorage.removeItem('uid');
            localStorage.removeItem('email');
            if (window.location.pathname = '/profile.html') {
                document.location.href = 'index.html';
            }
        }
    },
});

Vue.component('profile-menu-component', {
    template: `<div class="profileMenu">
                    <div class="userNickName">{{userEmail}}</div>
                    <div @click="handleClickMenu(1)">Personal data</div>
                    <div @click="handleClickMenu(2)">Feed back</div>
                    <div @click="handleClickMenu('exit')">Log out</div>
                </div>`,
    computed: {
        userEmail() {
            return localStorage.getItem('email');
        }
    },
    methods: {
        handleClickMenu(menu) {
            if (menu === 'exit') {
                this.$emit('on_logout');
            } else
                document.location.href = `profile.html#${menu}`;
        }
    }
});

Vue.component('authentication-component', {
    template: `<div class="authentication">
                    <div @click="handleClickMenu(1)">Log in</div>
                    <div @click="handleClickMenu(0)">Register</div>
                </div>`,
    methods: {
        handleClickMenu(menu) {
            document.location.href = `registration.html#${menu}`;
        }
    }
});


Vue.component('feedback-component', {
    props: [],
    data() {
        return {
            feedback: [],
            currentFeedback: 1,
        }
    },
    template: `<div v-if="feedback.length" class="messLeftSub">
                    <p>{{ feedback[currentFeedback].message }}</p>
                    <h5>{{ feedback[currentFeedback].user }}</h5>
                    <h6>Dhaka, Bd</h6>
                    <div class="scroll">
                        <a :class="{current: currentFeedback === 0}"
                            @click.prevent="handleOtherMes(0)" href="#">
                        </a>
                        <a :class="{current: currentFeedback === 1}"
                            @click.prevent="handleOtherMes(1)" href="#">
                        </a>
                        <a :class="{current: currentFeedback === 2}"
                            @click.prevent="handleOtherMes(2)" href="#">
                        </a>
                    </div>
                </div>`,
    mounted() {
        fetch(`${API_URL}/feedback/0`)
            .then((response) => response.json())
            .then((items) => {
                this.feedback = items;
            });
    },
    computed: {},
    methods: {
        handleOtherMes(mess) {
            this.currentFeedback = mess;
        }
    },
});
