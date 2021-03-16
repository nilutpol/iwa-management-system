import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './index.css';
import Auth from './Auth';
import * as serviceWorker from './serviceWorker';


const theme = createMuiTheme({
  palette: {
    primary: {
      // main: '#8f3535'
      main: '#bb5a5a'
      // main: '#eda686'
    }
  },
  typography: {
    fontFamily: [
      'Open Sans',
      // 'Lato',
      'Roboto',
    ].join(','),
    // fontSize: 12,
    useNextVariants: true
  }
});

ReactDOM.render(
  <Router>
    <MuiThemeProvider theme={theme}>
      <Auth />
    </MuiThemeProvider>
  </Router>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
