import ListableFilterGroup from "../ListableFilterGroup/component";

/**
 * "name" constant for property use when setting the group `props.selected`
 * value.
 *
 * @author Oliver Lillie
 * @type {string}
 */
const NAME = 'name';

/**
 * "abbrv" constant for property use when setting the group `props.selected`
 * value.
 *
 * @author Oliver Lillie
 * @type {string}
 */
const ABBRV = 'abbrv';

/**
 * "dateUpdated" constant for property use when setting the group
 * `props.selected` value.
 *
 * @author Oliver Lillie
 * @type {string}
 */
const DATE_UPDATED = 'dateUpdated';

/**
 * The filter group options list, set as a constant for exporting.
 *
 * @author Oliver Lillie
 * @type {*[]}
 */
const SORT_BY = [
    {
        prop: NAME,
        label: 'Name',
    },
    {
        prop: ABBRV,
        label: 'Abbreviation',
    },
    {
        prop: DATE_UPDATED,
        label: 'Date Last Updated',
    },
];

/**
 * Creates a filter group that has "Sort By" options, ie name/abbrv/dateUpdated.
 *
 * @author Oliver Lillie
 */
export default class LaboratoryTestListSortByFilterGroup extends ListableFilterGroup {
    static defaultProps = {
        sortRef: 'sortKey',
        label: 'Sort By',
        options: SORT_BY,
        selected: NAME
    };
};

export const defaultOption = NAME;
export const options = SORT_BY;