import React, { Component } from 'react';
import {ErrorMessage, Field} from "formik";
import PropTypes from "prop-types";

/**
 * Provides a component that contains a Formik Field component. It puts the
 * input into a <tr> with a <td class="label"> and <td class="input">.
 *
 * It allows an input to hold various different properties to aid in completion
 * of a form.
 *
 * @author Oliver Lillie
 */
export default class FormTableRow extends Component {

    static propTypes = {
        /** The value of the field. **/
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /** From Formik. Any error that the field currently has. **/
        error: PropTypes.string,
        /** From Formik. If the field has been "touched" by the user, ie focus
            in then blur. **/
        touched: PropTypes.bool,
        /** Used to signal if the form input should be force shown as errored
            due to an issue with formik and validation being called outside of
            the main formik form (as with formiks in modals) **/
        forceShowError: PropTypes.bool,
        /** Used to signal that the form containing the input is submitting (ie
            being processed) **/
        isSubmitting: PropTypes.bool,
        /** The field object. **/
        field: PropTypes.shape({
            /** The `input[name]` attribute of the field. **/
            name: PropTypes.string.isRequired,
            /** The content of the label that is created for the field. **/
            label:  PropTypes.string.isRequired,
            /** The type of the field being created. It would typically be
                extended with other types - however we have no other types at
                the moment. **/
            type:  PropTypes.oneOf(['text', 'number', 'select']),
            /** Used for `props.field.type = "select"` only and is an array of
                option objects. **/
            options:  PropTypes.arrayOf(PropTypes.shape({
                /** The value of the select option. **/
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                /** The label of the select option. **/
                label: PropTypes.string.isRequired
            })),
            /** A input hint that is put into the `td.input` column under the
                input that is being created. It should be used to provide short
                consice help and is not for verbose instructions. **/
            hint: PropTypes.string,
            /** Used to set `input[minlength]` attributes. **/
            minLength: PropTypes.number,
            /** Used to set `input[maxlength]` attributes. **/
            maxLength: PropTypes.number,
            /** Used to set `input[required]` attributes, but in addition when a
                field is required the `td.label` gets an indicator that this
                field is reqired. **/
            required: PropTypes.bool,
            /** Used to set `input[pattern]` attributes. **/
            pattern: PropTypes.string
        }).isRequired,
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        value: '',
        touched: false,
        forceShowError: false,
        isSubmitting: false,
        error: null,
        onBlur: () => {},
        onChange: () => {},
    };

    /**
     * Creates a list of classes to be given to the `<tr>` element.
     *
     * If the input has an error then the row is also given an `"errored"`
     * class.
     *
     * @author Oliver Lillie
     * @return {string}
     */
    getDerivedRowClassName() {
        let classes = [this.props.field.name];

        if(!!this.props.error && (this.props.touched === true || this.props.forceShowError === true)) {
            classes.push('errored');
        }

        return classes.join(' ');
    }

    /**
     * Creates the required indicator element added to `tr.label` when the
     * `props.field.required = true`.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedRowRequired() {
        if(this.props.field.required === true) {
            return (
                <p className="required">Required</p>
            );
        }

        return null;
    }

    /**
     * Creates the formik select element but wrapped in a `div.select-wrapper`
     * for styling purposes.
     *
     * @author Oliver Lillie
     * @return {Element}
     */
    getDerivedSelect() {
        return (
            <div className="select-wrapper">
                <Field component="select"
                       name={this.props.field.name}
                       value={this.props.value}
                       readOnly={this.props.isSubmitting}
                >
                    {this.props.field.options.map((option) => (<option value={option.value} key={option.value}>{option.label}</option>))}
                </Field>
            </div>
        );
    }

    /**
     * Creates the formik Field component for the input.
     *
     * @author Oliver Lillie
     * @return {Field}
     */
    getDerivedTextInput() {
        // required is purposefully not added here because we don't want to use the
        // html error messages
        return (
            <Field name={this.props.field.name}
                   type={this.props.field.type}
                   value={this.props.value}
                   minLength={this.props.field.minLength}
                   maxLength={this.props.field.maxLength}
                   pattern={this.props.field.pattern}
                   autoComplete="off"
                   readOnly={this.props.isSubmitting}
            />
        );
    }

    /**
     * Returns the formik field.
     *
     * @author Oliver Lillie
     * @return {Element|Field}
     */
    getDerivedField() {
        if(this.props.field.type === 'select') {
            return this.getDerivedSelect();
        }

        return this.getDerivedTextInput();
    }

    /**
     * If `props.field.hint` is given then it is created and any line breaks are
     * turned into `<br>` elements.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedFieldHint() {
        if(this.props.field.hint) {
            return (
                <p className="hint">{this.props.field.hint.split(/(?:\r\n|\r|\n)/g).map((item, key) => {
                    return <span key={key}>{item}<br/></span>
                })}</p>
            );
        }
        return null;
    }

    render() {
        return (
            <tr className={this.getDerivedRowClassName()}>
                <td className="label"><label htmlFor={this.props.field.name}>{this.props.field.label}</label>
                    {this.getDerivedRowRequired()}
                </td>
                <td className="input">{this.getDerivedField()}
                    <p className="error"><ErrorMessage name={this.props.field.name}/></p>
                    {this.getDerivedFieldHint()}
                </td>
            </tr>
        );
    }

}

