/**
 * Simple whitespace validation for the `ow` schema validation.
 *
 * @author Oliver Lillie
 */
export default function(string) {
   return String(string).match(/\s+/) === null || `No whitespace is allowed.`;
}