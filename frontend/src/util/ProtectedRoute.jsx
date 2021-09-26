import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useDoc } from '../state/state';
import { userDoc } from '../state/docs/userDoc';
import { isAdminType, isSuperAdminType } from '../config/accountTypes';

const ProtectedRoute = ({ component: Component, superAdmin, admin, ...restOfProps }) => {
    const [user] = useDoc(userDoc);
    const isSuperAdmin = isSuperAdminType(user?.type);
    const isAdmin = isAdminType(user?.type);
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
