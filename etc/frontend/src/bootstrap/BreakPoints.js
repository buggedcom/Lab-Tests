/**
 * Controls the breapoint classes, `html.lte-768` and `html-gt-768` etc, that
 * automatically get updated when the app's browser is resized.
 *
 * In a typical app this would be left down to media queries to sort out since
 * the resolution and browser size does not change, however for development
 * purposes this allows easy browser resizing to apply various breakpoint fixes.
 *
 * @author Oliver Lillie
 */
export default {
    defaults: {
        '(max-width: 320px)': 320,
        '(max-width: 375px)': 375,
        '(max-width: 425px)': 425,
        '(max-width: 500px)': 500,
        '(max-width: 600px)': 600,
        '(max-width: 650px)': 650,
        '(max-width: 768px)': 768,
        '(max-width: 950px)': 950,
        '(max-width: 1024px)': 1024,
    },

    /**
     * Binds the each of the breakpoints media query statements to
     * `handleBrowserResize` which in turn modifies the html.xxx breakpoint
     * classes.
     *
     * @author Oliver Lillie
     */
    setup() {
        Object.keys(this.defaults).forEach(
            (breakPoint) => {
                const matchQuery = window.matchMedia(breakPoint);
                matchQuery.addListener(this.handleBrowserResize.bind(this));

                this.handleBrowserResize(matchQuery);
            }
        );
    },

    /**
     * Handles the browser resize event and adds/removes the related breakpoint
     * classes.
     *
     * The event is NOT debounced since it is not really intensive. Although
     * arguably because it causes repaints it could be argued that it is
     * intensive, however given the size of this demo code it is not warranted.
     *
     * @author Oliver Lillie
     * @param {MediaQueryList} matchQuery
     */
    handleBrowserResize(matchQuery) {
        const breakPoint = this.defaults[matchQuery.media];
        const htmlNode = document.documentElement;
        htmlNode.classList.remove(`gt-${breakPoint}`, `lte-${breakPoint}`);
        htmlNode.classList.add(`${matchQuery.matches ? 'lte' : 'gt'}-${breakPoint}`);
    }
}
