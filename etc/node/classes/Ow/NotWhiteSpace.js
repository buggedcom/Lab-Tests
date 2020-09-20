/**
 * Simple whitespace validation for the `ow` schema validation.
 *
 * @author Oliver Lillie
 */
export default function(string) {
   const matches = String(string).match(/\s+/);
   return matches === null || matches[0] !== string || `Cannot be only white space.`;
}