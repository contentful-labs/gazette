'use strict';

const React = require('react');
const Radium = require('radium');

const client = require('./contentful.js');
const pubsub = require('./pubnub.js');
const style = require('./style.js').app;
const Articles = require('./articles.js');

const App = React.createClass({
  getInitialState: function () {
    return {loading: true, entries: null};
  },
  componentDidMount: function () {
    client.getList()
    .then((entries) => {
      this.setState({loading: false, entries});
      pubsub.subscribe(e => this.setState(s => {
        return {entries: s.entries.map(ee => ee.sys.id === e.sys.id ? e : ee)};
      }));
    });
  },
  getChildContext: function () {
    return {
      canUpdate: () => this.hasUpdater(),
      update: (eid, fid, val) => this.hasUpdater() && this.state.updater(eid, fid, val)
    };
  },
  hasUpdater: function () {
    return typeof this.state.updater === 'function';
  },
  edit: function () {
    const previous = sessionStorage.getItem('cmaToken') || '';
    const cmaToken = prompt('Please provide your CMA token:', previous);

    client.createUpdater(cmaToken).then(updater => {
      this.setState({updater});
      sessionStorage.setItem('cmaToken', cmaToken);
    }, () => alert('Something went wrong. Is your token valid?')
    );
  },
  render: function () {
    if (this.state.loading) {
      return <div className="state-msg">Loading...</div>;
    }

    const linkProps = {target: '_blank', style: {color: 'rgba(0, 0, 0, .5)'}};

    return <div style={style.container}>
      <h1 style={[style.heading, style.title]}>
        Contentful Gazette
        {!this.state.updater && <button onClick={this.edit}>edit!</button>}
      </h1>
      <div style={[style.heading, style.line]}>
        Berlin, Germany – {(new Date()).toDateString()}
      </div>
      <Articles entries={this.state.entries} />
      <div style={[style.footer, style.line]}>
        ♥ Built with <a href="https://facebook.github.io/react/" {...linkProps}>React</a>,
        {' '}<a href="https://www.contentful.com/" {...linkProps}>Contentful</a>
        {' '}and <a href="https://www.pubnub.com/" {...linkProps}>PubNub</a>
      </div>
    </div>;
  }
});

App.childContextTypes = {
  canUpdate: React.PropTypes.func,
  update: React.PropTypes.func
};

module.exports = Radium(App);
