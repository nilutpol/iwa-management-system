import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent, Button, FormControl, FormGroup, FormLabel, Tabs, Tab, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Fab, InputAdornment } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { CheckboxWithLabel } from 'formik-material-ui';

import _ from 'lodash';

import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import store from 'store';
import { withRouter } from 'react-router-dom';
import Constants from '../Constants';

import { CheckAuth } from './CheckAuth';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    button: {
        marginBottom: theme.spacing(1)
    },
    formControl: {
        margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(),
        marginRight: theme.spacing(),
        width: 200
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(9),
        right: theme.spacing(2),
    }
});

class Design extends Component {
    state = {
        is_fetching_data: true,
        data: [],
        weavers: [],
        selectedRow: null,
        tab_idx: 0,
        new_data: {
        },
        openNewLoom: false
    }

    componentDidMount() {
        const pathname = CheckAuth(this.props.location.pathname);
        if (pathname !== this.props.location.pathname) this.props.history.push(pathname);

        const token = store.get(Constants.AUTH_TOKEN);
        if (!token) {
            this.props.history.push("/login");
        } else {
            Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            this.getData();
        }
    }

    getData() {
        this.setState({ is_fetching_data: true }, () => {
            let get_data = Axios.get(Constants.API_BASE_URL + 'get_looms');
            let get_weavers = Axios.get(Constants.API_BASE_URL + 'get_weavers');
            Axios.all([get_data, get_weavers])
                .then(res => {
                    if (res[0].data.success) {
                        this.setState({
                            is_fetching_data: false,
                            data: res[0].data.data,
                            weavers: res[1].data.data,
                        })
                    } else {
                        this.setState({ is_fetching_data: false })
                        toast.error(res.data.data);
                    }
                })
                .catch(err => {
                    this.setState({ is_fetching_data: false })
                    toast.error(err.message);
                })
        });
    }

    handleCloseNewLoom = () => {
        this.setState({ openNewLoom: false })
    }

    render() {
        const { is_fetching_data, data, yarns, openNewLoom } = this.state;
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Grid container spacing={1} style={{ backgroundColor: '#f7f9fc' }}>
                    <Grid item xs={12} md={6}>
                        Looms
                    </Grid>
                    <Grid item >
                        <Fab color="primary" className={classes.fab} onClick={() => this.setState({ openNewLoom: true })}>
                            <AddIcon />
                        </Fab>
                    </Grid>
                </Grid>
                <Dialog open={openNewLoom} onClose={this.handleCloseNewLoom} disableBackdropClick maxWidth='md'>
                    <DialogTitle>Add New Loom</DialogTitle>
                    <DialogContent>
                        <Formik
                            enableReinitialize={true}
                            initialValues={this.state.new_data}
                            validateOnChange={false}
                            validateOnBlur={false}
                            validate={(values) => {
                                let errors = {};

                                if (!values.loom_no) {
                                    errors.loom_no = 'Required';
                                }

                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                // Send to Backend
                                let post_data = values;

                                Axios.post(Constants.API_BASE_URL + 'add_loom', post_data)
                                    .then((res) => {
                                        setSubmitting(false);
                                        this.handleCloseNewLoom();
                                        if (res.data.success) {
                                            Swal.fire(
                                                'Success',
                                                'Loom added successfully.',
                                                'success'
                                            )
                                        } else {
                                            Swal.fire(
                                                'Failed!',
                                                res.data.data,
                                                'error'
                                            )
                                        }
                                        this.getData();
                                    })
                                    .catch(err => {
                                        setSubmitting(false);
                                        Swal.fire(
                                            'Failed!',
                                            err,
                                            'error'
                                        )
                                        this.getData();
                                    });
                            }}
                        >
                            {({ handleSubmit, errors, isSubmitting }) => {
                                return (<Form >
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={4}>
                                            <Field name="loom_no" label="Loom No." margin="normal" className={classes.textField} component={TextField} variant='outlined' fullWidth error={errors.loom_no !== undefined} helperText={errors.loom_no} />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Field name="weaver" label="Weaver" margin="normal" className={classes.textField} component={TextField} variant='outlined' fullWidth error={errors.weaver !== undefined} helperText={errors.weaver} />
                                        </Grid>
                                    </Grid>
                                    {isSubmitting && <LinearProgress />}
                                    <br />
                                    <Button
                                        color="primary"
                                        onClick={this.handleCloseNewLoom}
                                    >Cancel</Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                    >Save</Button>
                                </Form>)
                            }}
                        </Formik>
                    </DialogContent>
                </Dialog>
                <ToastContainer />
            </React.Fragment >
        );
    }
}

Design.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(Design));