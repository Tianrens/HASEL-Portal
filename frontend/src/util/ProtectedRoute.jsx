import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { userIsSuperAdmin, userIsAdmin } from '../config/accountTypes';

const ProtectedRoute = ({ component: Component, superAdmin, admin, ...restOfProps }) => {
    const isSuperAdmin = userIsSuperAdmin();
    const isAdmin = userIsAdmin();
    const isValidUser = (admin && isAdmin) || (superAdmin && isSuperAdmin);
    return (
        <Switch>
            <Route
                {...restOfProps}
                render={(props) => (isValidUser ? <Component {...props} /> : <Redirect to='/' />)}
            />
        </Switch>
    );
};

export default ProtectedRoute;
