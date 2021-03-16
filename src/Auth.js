import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import store from 'store';
import Constants from './Constants';
import App from './Pages/App';
import Login from './Pages/Login';

class Auth extends Component {
	componentDidMount() {
		let token = store.get(Constants.AUTH_TOKEN);
		if (!token) {
			this.props.history.push("/login");
		}
	}

	render() {
		return (
			<div>
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/*" component={App} />
				</Switch>
			</div>
		)
	}
}

export default withRouter(Auth);
