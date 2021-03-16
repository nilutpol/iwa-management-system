import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import { DateTime } from 'luxon';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from 'store';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2'

// import Ticker from 'react-ticker'

import Constants from '../Constants';

import { CheckAuth } from './CheckAuth';

const styles = (theme) => ({
    // container: {
    //     display: 'flex',
    //     flexWrap: 'wrap'
    // },
    // textField: {
    //     marginLeft: theme.spacing(),
    //     marginRight: theme.spacing(),
    //     width: 300
    // },
    title: {
        fontSize: 14,
        fontWeight: 500
    },
    button: {
        marginBottom: theme.spacing(1)
    },
    // pickers: {
    //     flex: 1,
    //     justifyContent: 'space-around'
    // }
});
class Reports extends Component {
    state = {
        employees_data: []
    };

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

    getData = () => {
    }

    exportEmployeeData = () => {
        Axios.get(Constants.API_BASE_URL + 'export_employee_data', { responseType: 'arraybuffer' })
            .then((res) => {
                if (res.data.byteLength === 45) {
                    Swal.fire(
                        'Failed!',
                        'No data to export.',
                        'error'
                    )
                } else {
                    if (res.status === 200) {
                        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        saveAs(blob, 'Employee-Training-Line-Listing-' + DateTime.local().toFormat('dd-LL-yyyy') + '.xlsx');
                        toast.success('Employee Training Line Listing exported successfully.');
                    } else {
                        Swal.fire(
                            'Failed!',
                            'Failed to export report. Please try after some time.',
                            'error'
                        )
                    }
                }
            })
            .catch(err => {
                Swal.fire(
                    'Failed!',
                    'Failed to export report. Please try after some time.',
                    'error'
                )
            });
    }

    exportSummary = () => {
        Axios.get(Constants.API_BASE_URL + 'export_summary', { responseType: 'arraybuffer' })
            .then((res) => {
                if (res.data.byteLength === 45) {
                    Swal.fire(
                        'Failed!',
                        'No data to export.',
                        'error'
                    )
                } else {
                    if (res.status === 200) {
                        var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        saveAs(blob, 'Employee-Training-Summary-Report-' + DateTime.local().toFormat('dd-LL-yyyy') + '.xlsx');
                        toast.success('Employee Training Summary Report exported successfully.');
                    } else {
                        Swal.fire(
                            'Failed!',
                            'Failed to export report. Please try after some time.',
                            'error'
                        )
                    }
                }
            })
            .catch(err => {
                Swal.fire(
                    'Failed!',
                    'Failed to export report. Please try after some time.',
                    'error'
                )
            });
    }

    render() {
        const { classes } = this.props;

        return (
            <div style={{ margin: 10 }}>
                <Grid container spacing={1}>
                    <Grid item container spacing={1}>
                        <Grid item xs={12} lg={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                className={classes.button}
                                startIcon={<CloudDownloadIcon />}
                                onClick={event => this.exportEmployeeData()}
                            >Line List</Button>
                        </Grid>
                        <Grid item xs={12} lg={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                className={classes.button}
                                startIcon={<CloudDownloadIcon />}
                                onClick={event => this.exportSummary()}
                            >Summary</Button>
                        </Grid>
                        {/* <Grid item xs={12}>
                            <Ticker
                                offset="100%"
                                speed={10}
                                move={true}
                            >
                                {(index) => {
                                    return <h1> {"React - Ticker #" + index.index}</h1>;
                                }}
                            </Ticker>
                        </Grid> */}
                    </Grid>
                </Grid>
                <ToastContainer />
            </div>
        );
    }
}

Reports.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Reports));
