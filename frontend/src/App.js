import React, { useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './views/pages/LandingPage/LandingPage';
import { AppContext } from './AppContextProvider';
import NewRequest from './views/pages/NewRequest/NewRequest';
import PendingApproval from './views/pages/PendingApproval/PendingApproval';
import SignupPage from './views/pages/SignupPage/SignupPage';

function App() {
    const idToken = useContext(AppContext).firebaseUserIdToken;

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
