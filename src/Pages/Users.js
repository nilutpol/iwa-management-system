import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import MaterialTable from 'material-table';
// import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
// import { format, parseISO } from 'date-fns';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from 'store';

import Constants from '../Constants';

import { CheckAuth } from './CheckAuth';
import AddUser from './AddUser';



const styles = (theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    textField: {
        marginLeft: theme.spacing(),
        marginRight: theme.spacing(),
        width: 300
    },
    menu: {
        width: 200
    },
    button: {
        marginBottom: theme.spacing()
    },
    pickers: {
        flex: 1,
        justifyContent: 'space-around'
    }
});
class Users extends Component {
    state = {
        data: [],
        is_data_loading: true,
        add_new_user_flag: false
    };

    componentWillMount() {
        const pathname = CheckAuth(this.props.location.pathname);
        if (pathname !== this.props.location.pathname) this.props.history.push(pathname);

        const token = store.get('token');

        if (!token) {
            this.props.history.push("/login");
        } else {
            Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            this.getUsers();
        }
    }

    getUsers = () => {
        Axios.get(Constants.API_BASE_URL + 'get_users')
            .then((res) => {
                this.setState({ data: res.data.data, is_data_loading: false });
            })
            .catch(err => {
                if (err.response.status === 401) {
                    this.props.history.push("/login");
                } else {
                    console.log('err', err.response);
                }
            });
    }

    render() {
        const { data } = this.state;
        // const { classes } = this.props;

        let cell = {
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 4,
            paddingBottom: 4,
            width: 100
        };

        return (
            <div>
                {this.state.add_new_user_flag &&
                    <Grid container>
                        <Grid item md={12}><AddUser /></Grid>
                    </Grid>
                }
                {!this.state.add_new_user_flag &&
                    <Grid container direction="column" justify='center' alignItems='center'>
                        {/* <Grid item md={12}>
                            <Button variant="contained" color="primary" className={classes.button} onClick={() => this.props.history.push('/add_user')}>Add User</Button>
                        </Grid> */}
                        <Grid item xs={12} style={{ width: '100%' }}>
                            <MaterialTable
                                columns={[
                                    { title: 'Name', field: 'username', headerStyle: cell, cellStyle: cell },
                                    { title: 'Center Type', field: 'center_type', headerStyle: cell, cellStyle: cell },
                                    { title: 'Ward', field: 'ward', headerStyle: cell, cellStyle: cell },
                                    { title: 'Health Zone', field: 'health_zone', headerStyle: cell, cellStyle: cell },
                                    { title: 'Admin Zone', field: 'admin_zone', headerStyle: cell, cellStyle: cell },
                                    { title: 'Access', field: 'user_access', headerStyle: cell, cellStyle: cell },
                                    { title: 'Disabled', field: 'disabled', headerStyle: cell, cellStyle: cell }
                                ]}
                                title="Users"
                                localization={{
                                    body: {
                                        editRow: {
                                            deleteText: 'Are you sure to delete the User information?'
                                        }
                                    }
                                }}
                                data={data}
                                options={{
                                    paging: false,
                                    pageSize: 20,
                                    search: true,
                                    actionsColumnIndex: -1,
                                    rowStyle: rowData => ({
                                        color: rowData.disabled ? 'red' : 'black'
                                    })
                                }}
                                style={{ minHeight: '90vh' }}
                                isLoading={this.state.is_data_loading}
                            // actions={[
                            //     {
                            //         icon: 'edit',
                            //         iconProps: {
                            //             style: {
                            //                 fontSize: 'inherit'
                            //             }
                            //         },
                            //         tooltip: 'Update User',
                            //         onClick: (event, rowData) => {
                            //             this.props.history.push('/add_user', rowData);
                            //         }
                            //     }
                            // ]}
                            // editable={{
                            //     onRowDelete: (oldData) =>
                            //         new Promise((resolve, reject) => {
                            //             Axios.delete(Constants.API_BASE_URL + 'delete_user', { data: oldData })
                            //                 .then((res) => {
                            //                     if (res.data.success) {
                            //                         toast.success('User Information deleted.');
                            //                     } else {
                            //                         toast.error(res.data.data);
                            //                     }
                            //                 })
                            //                 .then(() => this.getUsers())
                            //                 .then(() => resolve());
                            //         })
                            // }}
                            />
                        </Grid>
                    </Grid>}
                <ToastContainer />
            </div>
        );
    }
}

Users.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Users));
