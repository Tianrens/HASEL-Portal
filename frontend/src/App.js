import React, { useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './views/pages/LandingPage/LandingPage';
import { AppContext } from './AppContextProvider';
import NewRequest from './views/pages/NewRequest/NewRequest';

function App() {
    const idToken = useContext(AppContext).firebaseUserIdToken;

    function AuthenticatedPaths() {
        return (
            <Switch>
                <Route exact path='/' component={NewRequest} />
                {/* Default path */}
                <Route component={NewRequest} />
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

    return (
        <Router>
            {idToken ? <AuthenticatedPaths /> : <UnauthenticatedPaths />}
        </Router>
    );
}

export default App;
