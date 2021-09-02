import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './views/pages/LandingPage/LandingPage';
import NewRequest from './views/pages/NewRequest/NewRequest';
import PendingApproval from './views/pages/PendingApproval/PendingApproval';
import SignupPage from './views/pages/SignupPage/SignupPage';
import { useDoc } from './state/state';
import { idTokenDoc } from './state/docs/idTokenDoc';

function App() {
    const [idToken] = useDoc(idTokenDoc);

    function AuthenticatedPaths() {
        return (
            <Switch>
                <Route exact path='/signup' component={SignupPage} />
                <Route path='/request' component={NewRequest} />
                <Route path='/pending' component={PendingApproval} />
                {/* Default path */}
                <Route component={SignupPage} />
            </Switch>
        );
    }

    function UnauthenticatedPaths() {
        return (
            <Switch>
                <Route exact path='/' component={LandingPage} />
                {/* Default path */}
                <Route component={LandingPage} />
            </Switch>
        );
    }

    return <Router>{idToken ? <AuthenticatedPaths /> : <UnauthenticatedPaths />}</Router>;
}

export default App;
