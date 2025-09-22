import React, { Component, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications'; // Importa NotificationContainer

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import SimpleLayout from './layout/SimpleLayout';
import routes from "../route";

const AdminLayout = React.lazy(() => import('./layout/AdminLayout'));

class App extends Component {
    render() {
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
                    <SimpleLayout>
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
                    </SimpleLayout>
                </ScrollToTop>
            </Aux>
        );
    }
}

export default App;
