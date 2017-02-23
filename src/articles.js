'use strict';

const React = require('react');

const FieldValue = require('./field-value.js');

const Article = React.createClass({
  propTypes: {
    entry: React.PropTypes.object.isRequired
  },
  getChildContext: function () {
    return {getEntry: () => this.props.entry};
  },
  render: function () {
    return <div className="column">
      <div className="head">
        <div className="headline hl1">
          <FieldValue fieldId="title" />
        </div>
        <div className="headline hl2">
          <FieldValue fieldId="lead" />
        </div>
        <FieldValue fieldId="content" />
      </div>
    </div>;
  }
});

Article.childContextTypes = {
  getEntry: React.PropTypes.func
};

const Articles = ({entries}) => {
  if (Array.isArray(entries) && entries.length > 0) {
    return <div className="columns">
      {entries.map((entry, i) => <Article entry={entry} i={i} key={entry.sys.id} />)}
    </div>;
  } else {
    return <div>There are no articles yet.</div>;
  }
};

Articles.propTypes = {
  entries: React.PropTypes.array
};

module.exports = Articles;
