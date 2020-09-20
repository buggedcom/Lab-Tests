import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import * as serviceWorker from './serviceWorker';

import './bootstrap/Polyfill';
import Browser from './bootstrap/Browser';
import BreakPoints from './bootstrap/BreakPoints';

import App from './components/App/component';

// bootstrap the apps browser and breakpoint html classes so both css and
// javascript have access to the breakpoints.
Browser.setup();
BreakPoints.setup();

// Wrap the rendering in a function:
const render = () => {
    ReactDOM.render(
        // Wrap App inside AppContainer
        <AppContainer>
            <App />
        </AppContainer>,
        document.getElementById('root')
    );
};

serviceWorker.unregister();

// Render once
render();

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./components/App/component', () => {
        render();
    });
}