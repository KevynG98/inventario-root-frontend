import React from 'react';

const SignUp1 = React.lazy(() => import('./Demo/Authentication/SignUp/Index'));
const Signin1 = React.lazy(() => import('./Demo/Authentication/SignIn/Index'));
const Cajero = React.lazy(() => import('./pages/cajero/Index'));

const route = [
    { path: '/auth/signup-1', exact: true, name: 'Signup 1', component: SignUp1 },
    { path: '/auth/signin-1', exact: true, name: 'Signin 1', component: Signin1 },
    { path: '/caja', exact: true, name: 'Cajero', component: Cajero }
];

export default route;