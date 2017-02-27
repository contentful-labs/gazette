'use strict';

const React = require('react');
const sanitizeHtml = require('sanitize-html');

const FieldValue = React.createClass({
  propTypes: {
    fieldId: React.PropTypes.string.isRequired,
    html: React.PropTypes.bool
  },
  getInitialState: function () {
    return {editing: false};
  },
  edit: function () {
    if (this.context.canUpdate()) {
      this.setState({editing: true}, () => this.el.focus());
    } else {
      // eslint-disable-next-line no-console
      console.log('Cannot edit w/o CMA token.');
    }
  },
  sanitize: function (value) {
    const allowedTags = this.props.html ? ['b', 'strong', 'i', 'em', 'div', 'br'] : [];
    return sanitizeHtml(value, {allowedTags, allowedAttributes: []});
  },
  save: function () {
    this.setState({editing: false});
    if (this.context.canUpdate()) {
      this.context.update(
        this.context.getEntry().sys.id,
        this.props.fieldId,
        this.sanitize(this.el.innerHTML)
      );
    }
  },
  getSanitizedValue: function () {
    const entry = this.context.getEntry();
    const value = entry.fields[this.props.fieldId];
    return {__html: this.sanitize(value)};
  },
  render: function () {
    const props = {
      style: {padding: '10px', backgroundColor: this.state.editing && '#fff'},
      ref: el => this.el = el,
      onClick: this.edit,
      onBlur: this.save,
      suppressContentEditableWarning: true,
      contentEditable: this.context.canUpdate() && this.state.editing,
      dangerouslySetInnerHTML: this.getSanitizedValue()
    };

    return <div {...props} />;
  }
});

FieldValue.contextTypes = {
  getEntry: React.PropTypes.func,
  canUpdate: React.PropTypes.func,
  update: React.PropTypes.func
};

module.exports = FieldValue;
