import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LandingPage from './views/pages/LandingPage/LandingPage';
import UserHomePage from './views/pages/UserHomepage/UserHomePage';
import NewRequest from './views/pages/NewRequest/NewRequest';
import PendingApproval from './views/pages/PendingApproval/PendingApproval';
import SignupPage from './views/pages/SignupPage/SignupPage';
import NewBooking from './views/pages/NewBooking/NewBooking';
import ProfilePage from './views/pages/ProfilePage/ProfilePage';
import ViewProfile from './views/pages/ProfilePage/ViewProfile';
import { useDoc } from './state/state';
import { idTokenDoc } from './state/docs/idTokenDoc';
import { userDoc } from './state/docs/userDoc';
import ViewRequests from './views/pages/ViewRequests/ViewRequests';
import SingleRequest from './views/pages/SingleRequest/SingleRequest';
import { userIsAdmin, userIsSuperAdmin } from './config/accountTypes';
import EditBooking from './views/pages/EditBooking/EditBooking';
import ViewWorkstations from './views/pages/ViewWorkstations/ViewWorkstations';
import ViewWorkstationBookings from './views/pages/ViewWorkstationBookings/ViewWorkstationBookings';
import NewWorkstation from './views/pages/NewWorkstation/NewWorkstation';
import ViewUsers from './views/pages/ViewUsers/ViewUsers';
import EditWorkstation from './views/pages/EditWorkstation/EditWorkstation';
import HelpPage from './views/pages/Help/HelpPage';
import ProtectedRoute from './util/ProtectedRoute';

function App() {
    const [idToken] = useDoc(idTokenDoc);
    const [user] = useDoc(userDoc);
    const isSuperAdmin = userIsSuperAdmin();
    const isAdmin = userIsAdmin();

    const UnauthenticatedRoutes = () => (
        <Switch>
            <Route component={LandingPage} />
        </Switch>
    );

    const SignupRoutes = () => (
        <Switch>
            <Route component={SignupPage} />
        </Switch>
    );

    const PendingApprovalRoutes = () => (
        <Switch>
            <Route exact path='/help' component={HelpPage} />
            <Route exact path='/user' component={ProfilePage} />
            <Route exact path='/' component={PendingApproval} />
            <Route render={() => <Redirect to='/' />} />
        </Switch>
    );

    const NoWorkstationAccessRoutes = () => (
        <Switch>
            <Route exact path='/help' component={HelpPage} />
            <Route exact path='/user' component={ProfilePage} />
            <Route exact path='/' component={NewRequest} />
            <Route render={() => <Redirect to='/' />} />
        </Switch>
    );

    const FullRoutes = () => {
        // eslint-disable-next-line no-nested-ternary
        const defaultComponent = isSuperAdmin
            ? ViewRequests
            : isAdmin
                ? ViewWorkstations
                : UserHomePage;

        return (
            <Switch>
                <ProtectedRoute superAdmin exact path='/requests' component={ViewRequests} />
                <ProtectedRoute
                    superAdmin
                    exact
                    path='/requests/:requestId'
                    component={SingleRequest}
                />
                <ProtectedRoute admin exact path='/workstations' component={ViewWorkstations} />
                <ProtectedRoute admin exact path='/workstations/new' component={NewWorkstation} />
                <ProtectedRoute
                    admin
                    exact
                    path='/workstations/:workstationId/bookings'
                    component={ViewWorkstationBookings}
                />
                <ProtectedRoute
                    admin
                    exact
                    path='/workstations/:workstationId'
                    component={EditWorkstation}
                />
                <ProtectedRoute admin exact path='/users' component={ViewUsers} />
                <ProtectedRoute admin exact path='/users/:userId' component={ViewProfile} />
                <Route exact path='/bookings/new' component={NewBooking} />
                <Route exact path='/bookings/:bookingId' component={EditBooking} />
                <Route exact path='/user' component={ProfilePage} />
                <Route exact path='/help' component={HelpPage} />
                <Route exact path='/' component={defaultComponent} />
                <Route render={() => <Redirect to='/' />} />
            </Switch>
        );
    };

    function Routes() {
        // Not authenticated with Firebase
        if (!idToken) {
            return UnauthenticatedRoutes();
        }
        // Authenticated with Firebase but not submitted details
        if (idToken && !user) {
            return SignupRoutes();
        }

        // User is Admin or Super Admin so doesn't need a usage request
        if (isSuperAdmin || isAdmin) {
            return FullRoutes();
        }

        // User is a regular user but has pending approval
        if (user?.currentRequestId?.status === 'PENDING') {
            return PendingApprovalRoutes();
        }

        // User is a regular user but does not have active approval
        if (user?.currentRequestId?.status !== 'ACTIVE') {
            return NoWorkstationAccessRoutes();
        }

        // User with workstation access
        return FullRoutes();
    }

    return <Router>{Routes()}</Router>;
}

export default App;
