const app = new Vue({
    el: '#app',
    data: {
        searchQuery: '',
        loggedIn: false,
    },
    mounted() {
        this.loggedIn = localStorage.getItem('logged') === 'true';
    },
    
    computed: {
        
    },
    
    methods: {
        handleFindClick(searchQuery) {
            this.searchQuery = searchQuery;
        },
        
        handleClickContinue() {
            document.location.href = 'registration.html#0';
        },
    },
})
