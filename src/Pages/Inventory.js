import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardHeader, CardContent, CardMedia, Button, LinearProgress, Dialog, DialogTitle, DialogContent, MenuItem, Fab, CircularProgress } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
// import RemoveIcon from '@material-ui/icons/Remove';

import { Formik, Form, Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';

import _ from 'lodash';

import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import store from 'store';
import { withRouter } from 'react-router-dom';
import Constants from '../Constants';

import { CheckAuth } from './CheckAuth';

import Mulberry from '../Assets/mulberry.webp';
import Zari from '../Assets/zari.png';
import Tassar from '../Assets/tassar2.jpg';
import Muga from '../Assets/muga.jpg';
import Ghicha from '../Assets/ghicha.jpg';
import Cotton from '../Assets/cotton.jpg';
import Acrylic from '../Assets/acrylic.jpg';
import Eri from '../Assets/eri.jpg';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    media: {
        // height: 0,
        paddingTop: '46.25%', // 16:9,
        // marginTop: '30'
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
        position: 'fixed',
        bottom: theme.spacing(8),
        right: theme.spacing(2),
    },
    fabRemove: {
        position: 'fixed',
        bottom: theme.spacing(8),
        right: theme.spacing(10),
    }
});

class Design extends Component {
    state = {
        is_fetching_data: true,
        data: null,
        yarn_list: [],
        selectedRow: null,
        tab_idx: 0,
        openNewInventory: false,
        new_data: {}
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
            let get_data = Axios.get(Constants.API_BASE_URL + 'get_inventory_summary');
            let get_yarn_list = Axios.get(Constants.API_BASE_URL + 'get_yarn_list');
            Axios.all([get_data, get_yarn_list])
                .then(res => {
                    if (res[0].data.success) {
                        this.setState({
                            is_fetching_data: false,
                            data: res[0].data.data,
                            yarn_list: res[1].data.data,
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

    handleCloseNewInventory = () => {
        this.setState({ openNewInventory: false })
    }

    getImage = yarn => {
        switch (yarn) {
            case 'Mulberry':
                return Mulberry;
            case 'Zari':
                return Zari;
            case 'Tassar':
                return Tassar;
            case 'Muga':
                return Muga;
            case 'Ghicha':
                return Ghicha;
            case 'Cotton':
                return Cotton;
            case 'Acrylic':
                return Acrylic;
            case 'Eri':
                return Eri;
            default:
                return Mulberry;
        }
    }

    render() {
        const { is_fetching_data, data, yarn_list, openNewInventory } = this.state;
        const { classes } = this.props;

        if (!data) return <CircularProgress />;

        let yarns = _.groupBy(data, i => i._id.yarn)

        return (
            <React.Fragment>
                <Grid container spacing={1} justify="center" alignItems="center" style={{ backgroundColor: '#f7f9fc', padding: 10, marginBottom: 112 }}>
                    <Typography variant='h4' gutterBottom>Inventory</Typography>
                    <Grid item container spacing={1} >
                        {_.map(yarns, (item, yarn) => {
                            let yarn_types = _.groupBy(item, i => i._id.type)
                            return (
                                <Grid key={yarn} item xs={12} md={3}>
                                    <Card>
                                        <CardHeader title={yarn} style={{ backgroundColor: '#bccbde' }} />
                                        <CardMedia
                                            className={classes.media}
                                            image={this.getImage(yarn)}
                                            title="Mulberry Yarn"
                                        />
                                        <CardContent style={{ backgroundColor: '#e6e9f0' }}>
                                            <Grid container spacing={4}>
                                                {_.map(yarn_types, (item, type) => {
                                                    let yarn_type_colors = (_.groupBy(item, i => i._id.color + ' (' + i._id.count + ')'))
                                                    return (
                                                        <Grid key={type} item xs={6}>
                                                            <Typography variant='h6' gutterBottom>{type}</Typography>
                                                            <Grid container spacing={1}>
                                                                {_.map(yarn_type_colors, (item3, color) => {
                                                                    return (
                                                                        <Grid key={color} container >
                                                                            <Grid item xs={6}>
                                                                                <Typography>{color}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={6} style={{ textAlign: 'right' }}>
                                                                                <Typography>{Number(item3[0].weight).toFixed(0)}g</Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    )
                                                                })}
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                })}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>
                    <Grid item >
                        <Fab color="primary" className={classes.fab} onClick={() => this.setState({ openNewInventory: true })}>
                            <AddIcon />
                        </Fab>
                        {/* <Fab color="primary" className={classes.fabRemove} onClick={() => this.setState({ openNewInventory: true })}>
                            <RemoveIcon />
                        </Fab> */}
                    </Grid>
                </Grid>
                <Dialog open={openNewInventory} onClose={this.handleCloseNewInventory} disableBackdropClick maxWidth='md'>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                    <DialogContent>
                        <Formik
                            enableReinitialize={true}
                            initialValues={this.state.new_data}
                            validateOnChange={false}
                            validateOnBlur={false}
                            validate={(values) => {
                                let errors = {};

                                if (!values.yarn) {
                                    errors.yarn = 'Required';
                                }
                                if (!values.type) {
                                    errors.type = 'Required';
                                }
                                if (!values.color) {
                                    errors.color = 'Required';
                                }
                                if (!values.count) {
                                    errors.count = 'Required';
                                }
                                if (!values.weight) {
                                    errors.weight = 'Required';
                                }
                                if (!Number(values.weight)) {
                                    errors.weight = 'Please enter valid Weight in grams.';
                                }
                                if (!values.cost) {
                                    errors.cost = 'Required';
                                }
                                if (!Number(values.cost)) {
                                    errors.cost = 'Please enter valid Cost in numbers.';
                                }

                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                // Send to Backend
                                let post_data = values;

                                Axios.post(Constants.API_BASE_URL + 'add_inventory', post_data)
                                    .then((res) => {
                                        setSubmitting(false);
                                        this.handleCloseNewInventory();
                                        if (res.data.success) {
                                            Swal.fire(
                                                'Success',
                                                'Item added to Inventory successfully.',
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
                            {({ handleSubmit, values, errors, isSubmitting }) => {
                                return (<Form >
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={4}>
                                            <Field type="text" name="yarn" label="Yarn" select component={TextField} fullWidth variant='outlined' error={errors.yarn !== undefined} helperText={errors.yarn}>
                                                {_.map(yarn_list, item => <MenuItem key={item.type} value={item.type}>{item.type}</MenuItem>)}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Field type="text" name="type" label="Type" select component={TextField} fullWidth variant='outlined' error={errors.type !== undefined} helperText={errors.type}>
                                                {_.map(['Warp', 'Weft'], item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Field type="text" name="color" label="Color" select component={TextField} fullWidth variant='outlined' error={errors.color !== undefined} helperText={errors.color}>
                                                {_.map(_.find(yarn_list, i => i.type == values.yarn)?.colors, item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Field name="count" label="Count" margin="normal" className={classes.textField} component={TextField} fullWidth variant='outlined' error={errors.count !== undefined} helperText={errors.count} />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Field name="weight" label="Weight (grams)" margin="normal" className={classes.textField} component={TextField} fullWidth variant='outlined' error={errors.weight !== undefined} helperText={errors.weight} />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Field name="cost" label="Cost" margin="normal" className={classes.textField} component={TextField} fullWidth variant='outlined' error={errors.cost !== undefined} helperText={errors.cost} />
                                        </Grid>
                                    </Grid>
                                    {isSubmitting && <LinearProgress />}
                                    <br />
                                    <Button
                                        color="primary"
                                        onClick={this.handleCloseNewInventory}
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