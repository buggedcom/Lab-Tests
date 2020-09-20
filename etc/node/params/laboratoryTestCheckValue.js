import BigNumber from "bignumber.js";

/**
 * Parses the :laboratoryTest param and converts it to an instance of
 * LaboratoryTest if the object is found by that id, otherwise it sets the param
 * as `false`.
 *
 * @author Oliver Lillie
 * @param request
 * @param response
 * @param next
 * @param id
 */
export default function(request, response, next, id) {
    // note the importance of BigNumber here to preserver float/double
    // precision when working with very high precision
    BigNumber.config({ DECIMAL_PLACES: 24 });
    request.laboratoryTestCheckValue = new BigNumber(id).toExponential();
    next();
};