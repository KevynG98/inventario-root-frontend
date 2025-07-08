import React, { Component, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { NotificationContainer } from 'react-notifications'; // Importa NotificationContainer

import '../../node_modules/font-awesome/scss/font-awesome.scss';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";

const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});

class App extends Component {
    render() {
        const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

        const userPermissions = user?.roles?.map(role => role.id) || [];

        const menu = routes.map((route, index) => {
            return (route.component) ? (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                        <route.component {...props} />
                    )} />
            ) : (null);
        });

        return (
            <Aux>
                {/* Agregar NotificationContainer aquí */}
                <NotificationContainer />
                <ScrollToTop>
                    <Suspense fallback={<Loader />}>
                        <Switch>
                            {menu}

                            {/* Redirige desde raíz */}
                            <Route exact path="/">
                                <Redirect to="/auth/signin-1" />
                            </Route>

                            {/* Solo rutas dashboard */}
                            <Route path="/dashboard" component={AdminLayout} />

                            {/* Opcional: si quieres manejar otras rutas */}
                            <Route path="*" render={() => <Redirect to="/auth/signin-1" />} />
                        </Switch>

                    </Suspense>
                </ScrollToTop>
            </Aux>
        );
    }
}

export default App;