'use strict';

const React = require('react');
const {Style} = require('radium');

module.exports = {Link, Ribbon};

function Link ({to, label}) {
  return <a
    href={to}
    target="_blank"
    style={{color: 'rgba(0, 0, 0, .5)'}}
    title={label}
  >
    {label}
  </a>;
}

Link.propTypes = {
  to: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired
};

function Ribbon ({pos, color, label, href, onClick}) {
  color = color || 'c00';
  const id = `ribbon-color-${color}`;
  const handler = onClick && (e => {
    e.preventDefault();
    onClick(e);
  });

  const style = <Style
    scopeSelector={`#${id}:before`}
    rules={{backgroundColor: `#${color}`}} />;

  const ribbon = <a
    id={id}
    className={`github-fork-ribbon ${pos}-top`}
    onClick={handler}
    href={handler ? '' : href}
    target={href && '_blank'}
    title={label}
  >
    {label}
  </a>;

  return <div>{style}{ribbon}</div>;
}

Ribbon.propTypes = {
  pos: React.PropTypes.string,
  color: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  href: React.PropTypes.string,
  onClick: React.PropTypes.func
};
