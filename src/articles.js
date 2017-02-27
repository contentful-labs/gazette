'use strict';

const React = require('react');
const Radium = require('radium');

const style = require('./style.js').articles;
const FieldValue = require('./field-value.js');

const Article = React.createClass({
  propTypes: {
    entry: React.PropTypes.object.isRequired,
    i: React.PropTypes.number.isRequired
  },
  getChildContext: function () {
    return {getEntry: () => this.props.entry};
  },
  render: function () {
    return <div style={[style.article, style.articleBorder(this.props.i)]}>
      <h2 style={[style.heading, style.title, style.titleVariant(this.props.i)]}>
        <FieldValue fieldId="title" html={false} />
      </h2>

      <h3 style={style.heading}>
        <div style={style.leadBeforeAfter} />
        <FieldValue fieldId="lead" html={false} />
        <div style={style.leadBeforeAfter} />
      </h3>

      <FieldValue fieldId="content" html={true} />
    </div>;
  }
});

Article.childContextTypes = {
  getEntry: React.PropTypes.func
};

const StyledArticle = Radium(Article);

const Articles = ({entries}) => {
  if (Array.isArray(entries) && entries.length > 0) {
    return <div style={style.grid}>
      {entries.map((entry, i) => {
        return <StyledArticle entry={entry} i={i} key={entry.sys.id} />;
      })}
    </div>;
  } else {
    return <div className="state-msg">There are no articles yet.</div>;
  }
};

Articles.propTypes = {
  entries: React.PropTypes.array
};

module.exports = Radium(Articles);
