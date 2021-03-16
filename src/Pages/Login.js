import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { CssBaseline, AppBar, Toolbar, Typography, Grid, Button } from '@material-ui/core';

import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { withRouter } from 'react-router-dom';
import Axios from 'axios';

import store from 'store';
import jwtDecode from 'jwt-decode';

import Logo from '../Assets/iwa_logo_main.png';

import Constants from '../Constants';
import { CheckAuth } from './CheckAuth';

const styles = (theme) => ({
	root: {
		display: 'flex'
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	textField: {
		marginLeft: theme.spacing(),
		marginRight: theme.spacing(),
		width: 300
	},
	dense: {
		marginTop: 19
	},
	menu: {
		width: 200
	},
	button: {
		margin: theme.spacing(),
		width: 300
	},
	pickers: {
		flex: 1,
		justifyContent: 'space-around'
	},
	avatar: {
		margin: theme.spacing(1),
	}
});

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form_data: {
				username: '',
				password: ''
			}
		};
	}

	componentDidMount() {
		const pathname = CheckAuth(this.props.location.pathname);
		let token = store.get(Constants.AUTH_TOKEN);
		if (!token) {
			this.props.history.push("/login");
		} else {
			if (pathname !== this.props.location.pathname) this.props.history.push(pathname);
			const user = jwtDecode(token);
			this.setState({ user: user });
		}
	}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<CssBaseline />
				<AppBar position="static" style={{ backgroundColor: '#8f3535' }}>
					<Toolbar style={{ alignSelf: 'center' }}>
						<Typography variant="h6" color="inherit" >
							IWA Management System
						</Typography>
					</Toolbar>
				</AppBar>
				<Formik
					initialValues={this.state.form_data}
					validate={(values) => {
						let errors = {};

						if (!values.username) {
							errors.username = 'Required';
						}
						if (!values.password) {
							errors.password = 'Required';
						}
						return errors;
					}}
					onSubmit={(values, { setSubmitting }) => {
						this.setState({ form_data: values }, () => {
							let data = this.state.form_data;
							Axios.post(Constants.API_BASE_URL + 'user_login', data).then((res) => {
								setSubmitting(false);
								if (res.data.success) {
									store.set(Constants.AUTH_TOKEN, res.data.data);
									let path = '/';
									this.props.history.push(path);
								} else {
									toast.error('Wrong username/password.');
								}
							});
						});
					}}
					render={({ submitForm, isSubmitting, values, setFieldValue }) => (
						<Form style={{ margin: 10, marginTop: 100 }}>
							<Grid container direction="column" justify='center' alignItems='center' spacing={1}>
								<img src={Logo} alt="Logo" height='250' width='250' />
								{/* <Grid item xs={12}>
									<Typography component="h1" variant="h5" gutterBottom>
										Sign in
									</Typography>
								</Grid> */}
								<Grid item xs={12} >
									<Field
										type="text"
										name="username"
										label="Username"
										variant="outlined"
										component={TextField}
										className={classes.textField}
									></Field>
								</Grid>
								<Grid item xs={12}>
									<Field name="password" label="Password" value={this.state.password} type='password' variant="outlined" margin="normal" className={classes.textField} component={TextField} autoComplete="current-password" onKeyUp={event => {
										if (event.key === 'Enter') {
											event.preventDefault();
											submitForm()
										}
									}} />
								</Grid>
								<Grid item xs={12}>
									<Button variant="contained" color="primary" fullWidth className={classes.button} disabled={isSubmitting} onClick={submitForm}>Login</Button>
								</Grid>
							</Grid>
						</Form>
					)}
				/>
				<ToastContainer />
			</div >
		);
	}
}

Login.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(Login));
