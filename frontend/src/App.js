import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './views/pages/LandingPage/LandingPage';
import NewRequest from './views/pages/NewRequest/NewRequest';
import PendingApproval from './views/pages/PendingApproval/PendingApproval';
import SignupPage from './views/pages/SignupPage/SignupPage';
import NewBooking from './views/pages/NewBooking/NewBooking';
import { useDoc } from './state/state';
import { idTokenDoc } from './state/docs/idTokenDoc';
import { userDoc } from './state/docs/userDoc';
import ViewRequests from './views/pages/ViewRequests/ViewRequests';

function App() {
    const [idToken] = useDoc(idTokenDoc);
    const [user] = useDoc(userDoc);

    function SignupPaths() {
        return (
            <Switch>
                <Route component={SignupPage} />
            </Switch>
        );
    }
    function AuthenticatedPaths() {
        return (
            <Switch>
                <Route path='/request' component={NewRequest} />
                <Route path='/pending' component={PendingApproval} />
                <Route path='/new-booking' component={NewBooking} />
                <Route path='/view-requests' component={ViewRequests} />
                {/* Default path */}
                <Route component={NewRequest} />
            </Switch>
        );
    }

    function UnauthenticatedPaths() {
        return (
            <Switch>
                <Route component={LandingPage} />
            </Switch>
        );
    }

    function Paths() {
        // Not authenticated with Firebase
        if (!idToken) {
            return UnauthenticatedPaths();
        }
        // Authenticated with Firebase but not submitted details
        if (idToken && !user) {
            return SignupPaths();
        }
        // Authenticated with Firebase and submitted details
        return AuthenticatedPaths();
    }

    return <Router>{Paths()}</Router>;
}

export default App;
