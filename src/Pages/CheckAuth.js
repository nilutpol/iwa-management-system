import store from 'store';
import jwtDecode from 'jwt-decode';

import Constants from '../Constants';

export const CheckAuth = (pathname) => {
    let Paths = {
        'admin': [
            // '/',
            '/inventory',
            '/design',
            '/loom',
            '/stock'
        ],
        'manager': [
            // '/',
            '/inventory',
            '/design',
            '/loom',
            '/stock',
        ]
    }
    let token = store.get(Constants.AUTH_TOKEN);
    if (!token) {
        return '/login';
    } else {
        const user = jwtDecode(token);
        return user.user_access ? (Paths[user.user_access].includes(pathname)) ? pathname : Paths[user.user_access][0] : '/login';
    }
}