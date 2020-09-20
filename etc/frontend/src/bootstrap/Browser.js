import { detect } from 'detect-browser';

/**
 * Sets up the html.os and html.browser-chrome etc base classes used for feature
 * tweaking and layout fixes.
 *
 * @author Oliver Lillie
 */
export default {
    setup() {
        const browser = detect();
        document.documentElement.classList.add(
            browser.os.toLowerCase().replace(/[^a-z0-9]+/, '-'),
            'browser-' + browser.name,
            'browser-' + browser.name + '-v' + parseInt(browser.version, 10)
        );
    }
}

