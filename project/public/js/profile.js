const app = new Vue({
    el: '#app',
    data: {
        searchQuery: '',
        user : {},
        loggedIn: false,
        message: '',
        moderator: false,
        comments: [],
        openDetails: 1,
        wrongField: {},
    },
    mounted() {
        this.loggedIn = localStorage.getItem('logged') === 'true';
        
        if (this.loggedIn) {
            const uid = localStorage.getItem('uid');
            
            fetch(`${API_URL}/users/${uid}`)
                .then((response) => response.json())
                .then((item) => {
                    this.user = item;
                });
            
            fetch(`${API_URL}/feedback/${uid}`)
                .then((response) => response.json())
                .then((item) => {
                    this.message = item.message;
                    this.moderator = item.moderator;
                    this.comments = item.comments;
                });
            
            if (window.location.hash === '#2') {
                this.openDetails = 2;
            } else {
                this.openDetails = 1;
            }
        }
        
    },
    computed: {
        isLogged() {
            return this.loggedIn === 'true';
        },
        
        isWrongField() {
            return this.wrongField;
        },
    },
    methods: {
        handleFindClick(searchQuery) {
            this.searchQuery = searchQuery;
        },
        
        handleSaveChange() {
            this.wrongField = validationUser(this.user);
            if (this.wrongField.wrong) {
                return;
            }
            
            const uid = localStorage.getItem('uid');
            fetch(`${API_URL}/users`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({...this.user, id: uid}),
            }).then((response) => response.json())
              .then((updated) => {
                    this.user = updated;
                    localStorage.setItem('email', updated.email);
              });
        },
        
        handleClickSend() {
            const uid = localStorage.getItem('uid');
            fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({id: uid, message: this.message}),
                }).then((response) => response.json())
                  .then((created) => {
                    this.message = created.message;
                  });
        },
        
        handleClickDelete() {
            const uid = localStorage.getItem('uid');
            fetch(`${API_URL}/feedback/${uid}`, {
                method: 'DELETE',
            }).then(() => {
                this.message = '';
            });
        },
        
        handleClickApprove(item, method) {
            const uid = localStorage.getItem('uid');
            fetch(`${API_URL}/feedback/${uid}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({comment: item, method}),
            }).then((response) => response.json())
              .then((updated) => {
                    this.comments = updated;
              });
        },
        
    },
})
