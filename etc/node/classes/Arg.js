import ow from 'ow';

/**
 * This is a simple function wrapper for ow so that it can be disabled depending
 * on the environment variable calling it.
 *
 * @author Oliver Lillie
 */
export default function() {
    // using ow to validate arguments is extremely costly in terms of
    // performance and therefore we disable the validation in production because
    // typically the classes and functions would be mutation tested with ow
    // enabled and therefore do not need validation in production.
    if(process.env.NODE_ENV === 'production') {
        return;
    }

    ow.apply(null, arguments);
}