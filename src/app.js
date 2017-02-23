'use strict';

const React = require('react');

const client = require('./contentful.js');
const pubsub = require('./pubnub.js');
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
    return <div className="head">
      <header>
        Contentful Gazette
        {!this.state.updater && <button onClick={this.edit}>edit!</button>}
      </header>
      <div className="subhead">
        Berlin, Germany - {(new Date()).toDateString()}
      </div>
      <div className="content">
        {this.state.loading && <div>Loading...</div>}
        {!this.state.loading && <Articles entries={this.state.entries} />}
      </div>
    </div>;
  }
});

App.childContextTypes = {
  canUpdate: React.PropTypes.func,
  update: React.PropTypes.func
};

module.exports = App;
