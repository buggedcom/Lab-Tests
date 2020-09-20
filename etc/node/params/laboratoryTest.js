import LaboratoryTest from '../models/LaboratoryTest';

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
    id = parseInt(id, 10);
    request.laboratoryTest = LaboratoryTest.findById(id);
    next();
};