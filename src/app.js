'use strict';

const React = require('react');
const Radium = require('radium');

const client = require('./contentful.js');
const pubsub = require('./pubnub.js');
const style = require('./style.js').app;

const {Link, Ribbon} = require('./links.js');
const Articles = require('./articles.js');

const App = React.createClass({
  getInitialState: function () {
    return {loading: true, entries: null};
  },
  componentDidMount: function () {
    client.getList()
    .then(entries => {
      this.setState({loading: false, entries});
      pubsub.subscribe(e => this.setState(s => {
        return {entries: client.handleWebhookEntry(e, s.entries)};
      }));
    });
  },
  componentWillUnmount: function () {
    pubsub.off();
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
    client.createUpdater(updater => this.setState({updater}));
  },
  render: function () {
    if (this.state.loading) {
      return <div className="state-msg">Loading...</div>;
    }

    return <div style={style.container}>
      {!this.state.updater && <Ribbon pos="left" color="333" label="Edit this website" onClick={this.edit} />}
      {this.state.updater && <Ribbon pos="left" color="090" label="Click on text to edit" />}
      <Ribbon pos="right" label="Fork this project" href="https://github.com/contentful/gazette" />

      <h1 style={[style.heading, style.title]}>
        Contentful Gazette
      </h1>
      <div style={[style.heading, style.line]}>
        Berlin, Germany – {(new Date()).toDateString()}
      </div>

      <Articles entries={this.state.entries} />

      <div style={[style.footer, style.line]}>
        ♥ Built with <Link to="https://facebook.github.io/react/" label="React" />
        {', '}<Link to="https://www.contentful.com/" label="Contentful" />
        {' and '}<Link to="https://www.pubnub.com/" label="PubNub" />.
      </div>
    </div>;
  }
});

App.childContextTypes = {
  canUpdate: React.PropTypes.func,
  update: React.PropTypes.func
};

module.exports = Radium(App);
