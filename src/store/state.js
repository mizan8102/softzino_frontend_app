export default {
    user: {
        token: localStorage.getItem('TOKEN'),
        data: {}
    },
    toast: {
        show: false,
        message: '',
        delay: 5000
    },
    categories:{
        data: {},
        loading: false,
    }
}