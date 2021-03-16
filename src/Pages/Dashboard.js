import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent, Button, FormControl, FormGroup, FormLabel, Tabs, Tab, LinearProgress, Dialog, DialogTitle, DialogContent, MenuItem } from '@material-ui/core'
import MaterialTable from 'material-table';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { CheckboxWithLabel } from 'formik-material-ui';

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
        width: 250
    },
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <React.Fragment>{children}</React.Fragment>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

class Dashboard extends Component {
    state = {
        is_fetching_data: true,
        data: [],
        selectedRow: null,
        tab_idx: 0,
        training_data: {
            child_health: {
                fbnc: false,
                observationship: false,
                nssk: false,
                imnci: false,
                fimnci: false,
                iycf: false,
                birth_defect: false,
                rbsk: false,
            },
            maternal_health: {
                sba: false,
                dakshata: false,
                cac: false,
                bemoc: false,
                cemoc: false,
                rti: false,
            },
            family_planning: {
                ls: false,
                nsv: false,
                mini_lap: false,
                iucd: false,
                ppiucd: false,
                paiucd: false,
                antara: false,
                comprehensive: false,
            },
            quality_assurance: {
                kayakalp: false,
                nqas: false,
                imep: false,
                iphs: false,
            },
            npcdcs: {
                ncd: false
            }
        },
        openNewEmployee: false,
        employee_data: {
            // name: 'Nilutpol',
            // employee_id: '001',
            // gender: 'male',
            // designation: 'admin',
            // phone_no: '8011670731',
            // address: 'Guwahati',
            // health_zone: 'Capital Zone',
            // health_center: 'GMC',
            // ward: 'Ward 1'
        },
        zone_list: [
            'Capital Zone',
            'East Zone',
            'West Zone',
            'Dhirenpara',
            'Sonapur',
            'Guwahati Urban',
            'DPMU',
            'DDWH',
            'IDSP',
            'TB'
        ]
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

    componentWillUnmount() {
        if (this.state.chart_cumulative) this.state.chart_cumulative.dispose();
    }

    getData() {
        this.setState({ is_fetching_data: true, openNewEmployee: false }, () => {
            let get_data = Axios.get(Constants.API_BASE_URL + 'get_designs');
            Axios.all([get_data])
                .then(res => {
                    if (res[0].data.success) {
                        this.setState({
                            is_fetching_data: false,
                            data: res[0].data.data,
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

    handleCloseNewEmployee = () => {
        this.setState({ openNewEmployee: false })
    }

    render() {
        const { is_fetching_data, data, selectedRow, tab_idx, training_data, openNewEmployee } = this.state;
        const { classes } = this.props;

        let cell = {
            padding: 3
        };

        let valid_training_data = data[selectedRow] && data[selectedRow].training ? data[selectedRow].training : training_data;

        return (
            <React.Fragment>
                <Grid container spacing={1} style={{ backgroundColor: '#f7f9fc' }}>
                    <Grid item xs={12} md={6}>
                        Dashboard
                    </Grid>
                </Grid>
                <ToastContainer />
            </React.Fragment >
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(Dashboard));