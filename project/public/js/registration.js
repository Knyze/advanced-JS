Vue.component('reg-component', {
    props: ['user_form', 'email', 'password', 'error_msg'],

    template: `<form class="registration">
                <div class="titleWrap">
                    <div class="titleReg">{{ user_form_title }}</div>
                    <div class="error">{{ user_form_error }}</div>
                </div>
                <div class="loginPass">
                    <h5>EMAIL ADDRESS <span>*</span></h5>
                    <input type="email" required v-model="email">
                    <h5>PASSWORD <span>*</span></h5>
                    <input type="password" required v-model="password">
                    <h4>* Required Fileds</h4>
                </div>
                <input type="submit" :value="user_form_title" @click="handleClickSubmit">
                <div class="userForm">
                    <a href="#" @click="$emit('onchange_form')">{{ user_form_action }}</a>
                </div>
            </form>`,
    mounted() {
    },
    computed: {
        user_form_title() {
            return this.user_form.title.toUpperCase();
        },
        user_form_action() {
            return this.user_form.action;
        },
        user_form_error() {
            if (this.error_msg.error)
                return this.error_msg.errorMsg;
            else
                return '';
        },
    },
    methods: {
        handleClickSubmit(event) {
            event.preventDefault();
            this.$emit('on_login', this.email, this.password);
        }
    }
});

const app = new Vue({
    el: '#app',
    data: {
        loggedIn: false,
        user_form_active: 0,
        newUser: 0,
        user_form: [
            {
                title: 'Registration',
                action: 'Log in',
            },
            {
                title: 'Log in',
                action: 'Registration',
            },
        ],
        errorMsg: {
            error: false,
            errorMsg: '',
        },
    },

    mounted() {
        this.loggedIn = localStorage.getItem('logged') === 'true';
        if (this.loggedIn) {
            this.errorMsg = {error: true, errorMsg: 'Already registered!'};
        };
        
        if (window.location.hash === '#0') {
            this.user_form_active = 0;
            this.newUser = true;
        } else {
            this.user_form_active = 1;
            this.newUser = false;
        };
    },

    methods: {
        handleSubmitClick(email, password) {
            const wrongField = validationUser({email});
            if (wrongField.wrong) {
                this.errorMsg = {error: true, errorMsg: 'Wrong e-mail!'};
                return;
            }
            fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({ email, password, new: this.newUser}),
                }).then((response) => response.json())
                  .then((item) => {
                    if (item.error) {
                        this.errorMsg = item;
                        return;
                    }
                    localStorage.setItem('uid', item.user.id);
                    localStorage.setItem('email', item.user.email);
                    localStorage.setItem('logged', true);
                    document.location.href = `index.html`;
                });
        },
        
        handleChangeFormClick() {
            this.user_form_active = 1 - this.user_form_active;
            this.newUser = !this.newUser;
            if (this.loggedIn) {
                this.errorMsg = {error: true, errorMsg: 'Already registered!'};
            } else
            this.errorMsg.error = false;
        }
    },
});
