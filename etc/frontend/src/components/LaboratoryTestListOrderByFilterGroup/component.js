import ListableFilterGroup from "../ListableFilterGroup/component";

/**
 * Ascending constant for property use when setting the group `props.selected`
 * value.
 *
 * @author Oliver Lillie
 * @type {string}
 */
const ASC = 'asc';

/**
 * Ascending constant for property use when setting the group `props.selected`
 * value.
 *
 * @author Oliver Lillie
 * @type {string}
 */
const DESC = 'desc';

/**
 * The filter group options list, set as a constant for exporting.
 *
 * @author Oliver Lillie
 * @type {*[]}
 */
const ORDER_BY = [
    {
        prop: ASC,
        label: 'Ascending',
    },
    {
        prop: DESC,
        label: 'Descending',
    },
];

/**
 * Creates a filter group that has "Order By" options, ie ASC/DESC.
 *
 * @author Oliver Lillie
 */
export default class LaboratoryTestListSortByFilterGroup extends ListableFilterGroup {
    static defaultProps = {
        sortRef: 'orderBy',
        label: 'Order By',
        options: ORDER_BY,
        selected: ASC
    };
};

export const defaultOption = ASC;
export const options = ORDER_BY;
export const props = {
    ASC,
    DESC
};