import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardHeader, CardContent, CardMedia, Button, LinearProgress, Dialog, DialogTitle, DialogContent, MenuItem, Fab, CircularProgress, ListItem, ListItemText, ListItemAvatar, Avatar, InputAdornment, IconButton, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import ImageIcon from '@material-ui/icons/Image';
import SearchIcon from '@material-ui/icons/Search';

import { Formik, Form, Field } from 'formik';
import { TextField as FormikTextField } from 'formik-material-ui';
import { CheckboxWithLabel } from 'formik-material-ui';
import InfiniteScroll from "react-infinite-scroll-component";

import _ from 'lodash';

import Axios from 'axios';
import { DateTime } from 'luxon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import store from 'store';
import { withRouter } from 'react-router-dom';
import Constants from '../Constants';

import { CheckAuth } from './CheckAuth';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

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
        position: 'fixed',
        bottom: theme.spacing(8),
        right: theme.spacing(2),
    },
    card: {
        margin: 5
    }
});

registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType, FilePondPluginFileEncode, FilePondPluginImagePreview);

class Design extends Component {
    state = {
        is_fetching_data: true,
        yarn_list: [],
        data: [],
        metaData: null,
        selectedRow: null,
        nextPage: 1,
        new_data: {
            // design_no: 'IWA/2021/13',
            // warp: 'Mulberry',
            // warp_color: 'Red',
            // weft: 'Zari',
            // weft_color: 'Golden',
            // length: 2.4,
            // width: 1.1
        },
        openNewDesign: false
    }

    componentDidMount() {
        const pathname = CheckAuth(this.props.location.pathname);
        if (pathname !== this.props.location.pathname) this.props.history.push(pathname);

        const token = store.get(Constants.AUTH_TOKEN);
        if (!token) {
            this.props.history.push("/login");
        } else {
            Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            this.getYarnList();
            this.getDesignData();
        }
    }

    getYarnList() {
        this.setState({ is_fetching_data: true }, () => {
            let get_yarn_list = Axios.get(Constants.API_BASE_URL + 'get_yarn_list');
            Axios.all([get_yarn_list])
                .then(res => {
                    if (res[0].data.success) {
                        this.setState({
                            is_fetching_data: false,
                            yarn_list: res[0].data.data,
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

    getDesignData = () => {
        let get_data = Axios.get(Constants.API_BASE_URL + 'get_designs', {
            params: {
                page: this.state.nextPage
            }
        });
        Axios.all([get_data])
            .then(res => {
                if (res[0].data.success) {
                    this.setState({
                        is_fetching_data: false,
                        metaData: res[0].data.data,
                        nextPage: res[0].data.data.nextPage,
                        data: this.state.data.concat(res[0].data.data.docs)
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
    }

    handleCloseNewDesign = () => {
        this.setState({ openNewDesign: false })
    }

    getImageData = () => {
        return new Promise((resolve, reject) => {
            if (!this.pond_rc) {
                resolve(null);
            }
            let files = this.pond_rc.getFiles();
            if (files.length === 0) {
                resolve(null);
            }
            files[0].setMetadata({
                design_no: 1
            });

            resolve(files[0])
        });
    }

    render() {
        const { is_fetching_data, data, metaData, yarn_list, openNewDesign } = this.state;
        const { classes } = this.props;

        if (!metaData) return <CircularProgress />;

        return (
            <React.Fragment>
                <Grid container spacing={1} justify="center" alignItems="center" style={{ backgroundColor: '#f7f9fc', padding: 10, marginBottom: 112 }}>
                    <Typography variant='h4' gutterBottom>Design</Typography>
                    {/* <Grid item xs={12}>
                        <TextField
                            label="Search"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <IconButton>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid> */}
                    <Grid item container>
                        <InfiniteScroll
                            style={{ width: '95vw' }}
                            dataLength={data.length}
                            next={this.getDesignData}
                            hasMore={metaData.hasNextPage}
                            loader={<h4>Loading...</h4>}
                        >
                            {data.map((i, index) => {
                                return (
                                    <Grid key={index} item xs={12} md={5}>
                                        <Card className={classes.card}>
                                            <CardHeader
                                                title={i.design_no}
                                                subheader={DateTime.fromISO(i.created_at).toFormat('dd-LL-yyyy')}
                                            />
                                            <CardMedia
                                                className={classes.media}
                                                component='img'
                                                src={i.image_data}
                                                title="Paella dish"
                                            />
                                            {/* <CardContent >
                                                <Typography variant="body2" color="textSecondary" component="p">{i.warp + '(' + i.warp_color + ')' + ' / ' + i.weft + '(' + i.weft_color + ')'}</Typography>
                                            </CardContent> */}
                                        </Card>
                                    </Grid>)
                            })}
                        </InfiniteScroll>
                    </Grid>
                    <Grid item >
                        <Fab color="primary" className={classes.fab} onClick={() => this.setState({ openNewDesign: true })}>
                            <AddIcon />
                        </Fab>
                    </Grid>
                </Grid>
                <Dialog open={openNewDesign} onClose={this.handleCloseNewDesign} disableBackdropClick maxWidth='md'>
                    <DialogTitle>Add New Design</DialogTitle>
                    <DialogContent>
                        <Formik
                            enableReinitialize={true}
                            initialValues={this.state.new_data}
                            validateOnChange={false}
                            validateOnBlur={false}
                            validate={(values) => {
                                let errors = {};

                                if (!values.design_no) {
                                    errors.design_no = 'Required';
                                }
                                if (!values.warp) {
                                    errors.warp = 'Required';
                                }
                                if (!values.warp_color) {
                                    errors.color = 'Required';
                                }
                                if (!values.weft) {
                                    errors.weft = 'Required';
                                }
                                if (!values.weft_color) {
                                    errors.color = 'Required';
                                }
                                if (!values.length) {
                                    errors.length = 'Required';
                                }
                                if (!Number(values.length)) {
                                    errors.length = 'Please enter valid Length in meters.';
                                }
                                if (!values.width) {
                                    errors.width = 'Required';
                                }
                                if (!Number(values.width)) {
                                    errors.width = 'Please enter valid Width in meters.';
                                }

                                if (!this.pond_rc) {
                                    toast.error('Please select design image.');
                                    errors.image = 'Please select design image.';
                                }
                                if (this.pond_rc.getFiles().length === 0) {
                                    toast.error('Please select design image.');
                                    errors.image = 'Please select design image.';
                                }

                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                // Send to Backend
                                let post_data = values;

                                this.getImageData()
                                    .then((image_data) => {
                                        post_data.image_data = image_data.getFileEncodeDataURL();

                                        Axios.post(Constants.API_BASE_URL + 'add_design', post_data)
                                            .then((res) => {
                                                setSubmitting(false);
                                                this.handleCloseNewDesign();
                                                if (res.data.success) {
                                                    Swal.fire(
                                                        'Success',
                                                        'Design added successfully.',
                                                        'success'
                                                    )
                                                } else {
                                                    Swal.fire(
                                                        'Failed!',
                                                        res.data.data,
                                                        'error'
                                                    )
                                                }
                                                // Reset the design data
                                                this.setState({ data: [] }, () => this.getDesignData())
                                            })
                                            .catch(err => {
                                                setSubmitting(false);
                                                Swal.fire(
                                                    'Failed!',
                                                    err,
                                                    'error'
                                                )
                                                this.getDesignData();
                                            });
                                    });
                            }}
                        >
                            {({ handleSubmit, values, errors, isSubmitting }) => {
                                return (<Form >
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} md={12}>
                                            <Field name="design_no" label="Design No." margin="normal" component={FormikTextField} fullWidth variant='outlined' error={errors.design_no !== undefined} helperText={errors.design_no} />
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Field type="text" name="warp" label="Warp" select component={FormikTextField} fullWidth variant='outlined' error={errors.warp !== undefined} helperText={errors.warp}>
                                                {_.map(yarn_list, item => <MenuItem key={item.type} value={item.type}>{item.type}</MenuItem>)}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Field type="text" name="warp_color" label="Warp Color" select component={FormikTextField} fullWidth variant='outlined' error={errors.warp_color !== undefined} helperText={errors.warp_color}>
                                                {_.map(_.find(yarn_list, i => i.type == values.warp)?.colors, item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Field type="text" name="weft" label="Weft" select component={FormikTextField} fullWidth variant='outlined' error={errors.weft !== undefined} helperText={errors.weft}>
                                                {_.map(yarn_list, item => <MenuItem key={item.type} value={item.type}>{item.type}</MenuItem>)}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Field type="text" name="weft_color" label="Weft Color" select component={FormikTextField} fullWidth variant='outlined' error={errors.weft_color !== undefined} helperText={errors.weft_color}>
                                                {_.map(_.find(yarn_list, i => i.type == values.weft)?.colors, item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Field name="design_yarn" label="Design Yarns" margin="normal" fullWidth component={FormikTextField} variant='outlined' error={errors.design_yarn !== undefined} helperText={errors.design_yarn} />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Field name="design_yarn_color" label="Design Yarn Colors" margin="normal" fullWidth component={FormikTextField} variant='outlined' error={errors.design_yarn_color !== undefined} helperText={errors.design_yarn_color} />
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Field name="length" label="Length (meters)" margin="normal" fullWidth component={FormikTextField} variant='outlined' error={errors.length !== undefined} helperText={errors.length} />
                                        </Grid>
                                        <Grid item xs={6} md={3}>
                                            <Field name="width" label="Width (inches)" margin="normal" fullWidth component={FormikTextField} variant='outlined' error={errors.width !== undefined} helperText={errors.width} />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Field name="other_colors" label="Other Colors" margin="normal" fullWidth component={FormikTextField} variant='outlined' error={errors.other_colors !== undefined} helperText={errors.other_colors} />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Field name="remarks" label="Remarks" margin="normal" fullWidth component={FormikTextField} variant='outlined' error={errors.remarks !== undefined} helperText={errors.remarks} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FilePond
                                                ref={ref => this.pond_rc = ref}
                                                labelIdle='Browse or Drop Design image file'
                                                instantUpload={false}
                                                allowRevert={false}
                                                labelTapToRetry='Click Upload to Retry'
                                                labelTapToCancel='Click to Cancel'
                                                allowFileSizeValidation={true}
                                                maxFileSize={10e6}
                                                allowFileTypeValidation={true}
                                                acceptedFileTypes={['image/*']}
                                                credits={false}
                                            />
                                        </Grid>
                                    </Grid>
                                    {isSubmitting && <LinearProgress />}
                                    <br />
                                    <Button
                                        color="primary"
                                        onClick={this.handleCloseNewDesign}
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