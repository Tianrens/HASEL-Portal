import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
import { isAdminType, isSuperAdminType } from './config/accountTypes';
import EditBooking from './views/pages/EditBooking/EditBooking';
import ViewWorkstations from './views/pages/ViewWorkstations/ViewWorkstations';
import ViewWorkstationBookings from './views/pages/ViewWorkstationBookings/ViewWorkstationBookings';
import ViewUsers from './views/pages/ViewUsers/ViewUsers';

function App() {
    const [idToken] = useDoc(idTokenDoc);
    const [user] = useDoc(userDoc);

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

    const SuperAdminRoutes = () => (
        <Switch>
            <Route path='/new-booking/workstation/:workstationId' component={NewBooking} />
            <Route exact path='/booking/:bookingId' component={EditBooking} />
            <Route exact path='/request/:requestId' component={SingleRequest} />
            <Route exact path='/requests' component={ViewRequests} />
            <Route
                exact
                path='/workstation/:workstationId/booking'
                component={ViewWorkstationBookings}
            />
            <Route exact path='/users' component={ViewUsers} />
            <Route exact path='/users/:userId' component={ViewProfile} />
            <Route exact path='/user' component={ProfilePage} />
            <Route component={ViewWorkstations} />
        </Switch>
    );

    const AdminRoutes = () => (
        <Switch>
            <Route exact path='/users' component={ViewUsers} />
            <Route exact path='/user' component={ProfilePage} />
            <Route exact path='/users/:userId' component={ViewProfile} />
            <Route path='/new-booking/workstation/:workstationId' component={NewBooking} />
            <Route exact path='/booking/:bookingId' component={EditBooking} />
            <Route
                exact
                path='/workstation/:workstationId/booking'
                component={ViewWorkstationBookings}
            />
            <Route component={ViewWorkstations} />
        </Switch>
    );

    const PendingApprovalRoutes = () => (
        <Switch>
            <Route exact path='/user' component={ProfilePage} />
            <Route component={PendingApproval} />
        </Switch>
    );

    const NoWorkstationAccessRoutes = () => (
        <Switch>
            <Route exact path='/user' component={ProfilePage} />
            <Route component={NewRequest} />
        </Switch>
    );

    const WorkstationAccessRoutes = () => (
        <Switch>
            <Route exact path='/booking/:bookingId' component={EditBooking} />
            <Route path='/new-booking/workstation/:workstationId' component={NewBooking} />
            <Route exact path='/user' component={ProfilePage} />
            <Route path='/' component={UserHomePage} />
            <Route component={UserHomePage} />
        </Switch>
    );

    function Routes() {
        // Not authenticated with Firebase
        if (!idToken) {
            return UnauthenticatedRoutes();
        }
        // Authenticated with Firebase but not submitted details
        if (idToken && !user) {
            return SignupRoutes();
        }
        // User is super admin
        if (isSuperAdminType(user?.type)) {
            return SuperAdminRoutes();
        }

        // User is admin
        if (isAdminType(user?.type)) {
            return AdminRoutes();
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
        return WorkstationAccessRoutes();
    }

    return <Router>{Routes()}</Router>;
}

export default App;
