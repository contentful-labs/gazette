'use strict';

const color = '#2f2f2f';
const border = `1px solid ${color}`;

const app = {
  container: {
    margin: '10px'
  },
  heading: {
    lineHeight: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    margin: '40px 0',
    fontFamily: '"Playfair Display", serif',
    fontWeight: 900,
    fontSize: '6vw'
  },
  line: {
    borderStyle: 'solid',
    borderWidth: '2px 0',
    borderColor: color,
    padding: '12px'
  },
  footer: {
    marginTop: '-1px',
    fontSize: '12px',
    textAlign: 'right',
  }
};

const articles = {
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  article: {
    padding: '30px 30px 50px',
    width: '33.33%',
    '@media (max-width: 800px)': {
      width: '100%',
      borderRight: 0
    }
  },
  articleBorder: i => ({borderBottom: border, borderRight: i%3 !== 2 && border}),
  heading: {
    padding: '10px 0',
    textAlign: 'center',
    fontFamily: '"Playfair Display", serif'
  },
  title: {
    fontWeight: 400,
    fontSize: '30px',
    textTransform: 'uppercase',
    fontStyle: 'italic'
  },
  titleVariant: i => [
    {fontWeight: 700, fontStyle: 'normal'},
    {fontSize: '36px', textTransform: 'none'},
    {fontSize: '42px'}
  ][i%3],
  leadBeforeAfter: {
    width: '100px',
    borderTop: border,
    margin: '5px auto'
  }
};

module.exports = {app, articles};
