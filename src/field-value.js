'use strict';

const React = require('react');

const FieldValue = React.createClass({
  propTypes: {
    fieldId: React.PropTypes.string.isRequired
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
  save: function () {
    this.setState({editing: false});
    if (this.context.canUpdate()) {
      this.context.update(
        this.context.getEntry().sys.id,
        this.props.fieldId,
        this.getHTMLContent()
      );
    }
  },
  getHTMLContent: function () {
    // TODO a lot of bad markup here
    return this.el.innerHTML;
  },
  getSanitizedValue: function () {
    // TODO it's not sanitized!
    return {__html: this.context.getEntry().fields[this.props.fieldId]};
  },
  render: function () {
    const props = {
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
