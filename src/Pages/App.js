import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
// import './App.css';

import { Typography, Hidden, MenuList, MenuItem, List, ListItem, ListItemIcon, IconButton, ListItemText, Drawer, Toolbar, Popover, BottomNavigation, BottomNavigationAction, Badge } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircle, FiberNew, Assessment, Notifications } from '@material-ui/icons';

import { Link, Switch, Route, withRouter } from 'react-router-dom';
import store from 'store';
import jwtDecode from 'jwt-decode';
import Logo from '../Assets/appbar_logo.png';

import Dashboard from '../Assets/dashboard.svg';
import Inventory from '../Assets/inventory-4.svg';
import Design from '../Assets/design-bw.svg';
import Loom from '../Assets/loom.png';
import Stock from '../Assets/fabric-1.svg';

import Constants from '../Constants';
import { CheckAuth } from './CheckAuth';

import DashboardPage from './Dashboard';
import InventoryPage from './Inventory';
import DesignPage from './Design';
import LoomPage from './Loom';
import StockPage from './Stock';

const drawerWidth = 180;

const styles = (theme) => ({
    root: {
        display: 'flex'
    },
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        backgroundColor: '#8f3535',
        marginLeft: drawerWidth,
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    title: {
        flexGrow: 1
    },
    username: {
        flexGrow: 1,
        fontSize: 14,
        textAlign: 'right',
        paddingRight: 10
    },
    menuButton: {
        marginRight: 3,
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth
    },
    bottomNav: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        // position: 'absolute',
        margin: 0,
        backgroundColor: '#e0e0e0',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        }
    },
    bottomIcon: {
        backgroundColor: '#f5d0c0',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(0)
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.activeRoute = this.activeRoute.bind(this);

        this.state = {
            mobileOpen: false,
            anchorEl: null,
            anchorAccount: null,
            user: {},
            value: 'inventory'
        };
    }

    componentDidMount() {
        const pathname = CheckAuth(this.props.location.pathname);
        if (pathname !== this.props.location.pathname) this.props.history.push(pathname);

        let token = store.get(Constants.AUTH_TOKEN);
        if (!token) {
            this.props.history.push("/login");
        } else {
            const user = jwtDecode(token);
            this.setState({ user: user });
        }
    }

    handleMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleDrawerToggle = () => {
        this.setState((state) => ({ mobileOpen: !state.mobileOpen }));
    };

    activeRoute(routeName) {
        return this.props.location.pathname === routeName;
    }

    handleAccountIcon = (event) => {
        this.setState({ anchorAccount: event.currentTarget });
    }

    handleCloseAccount = () => {
        this.setState({ anchorAccount: null });
    }

    handlePageChange = (event, newValue) => {
        this.setState({ value: newValue })
    }

    logout = () => {
        store.clearAll();
        window.location.reload();
    }

    render() {
        const { classes } = this.props;

        const open = Boolean(this.state.anchorAccount);

        let Routes;

        switch (this.state.user.user_access) {
            case 'admin':
                Routes = [
                    // {
                    //     path: '/',
                    //     sidebarName: 'Dashboard',
                    //     icon: FiberNew
                    // },
                    {
                        path: '/inventory',
                        sidebarName: 'Inventory',
                        icon: FiberNew
                    },
                    {
                        path: '/design',
                        sidebarName: 'Design',
                        icon: Assessment
                    },
                    // {
                    //     path: '/loom',
                    //     sidebarName: 'Loom',
                    //     icon: Assessment
                    // },
                    {
                        path: '/stock',
                        sidebarName: 'Stock',
                        icon: Assessment
                    }
                ];
                break;
            case 'manager':
                Routes = [
                    // {
                    //     path: '/',
                    //     sidebarName: 'Dashboard',
                    //     icon: FiberNew
                    // },
                    {
                        path: '/inventory',
                        sidebarName: 'Inventory',
                        icon: FiberNew
                    },
                    {
                        path: '/design',
                        sidebarName: 'Design',
                        icon: Assessment
                    },
                    // {
                    //     path: '/loom',
                    //     sidebarName: 'Loom',
                    //     icon: Assessment
                    // },
                    {
                        path: '/stock',
                        sidebarName: 'Stock',
                        icon: Assessment
                    }
                ];
                break;
            default:
                Routes = []
        }

        const drawer = (
            <div>
                <div className={classes.toolbar} />
                <Divider />
                <MenuList>
                    {Routes.map((prop, key) => {
                        return (
                            <Link to={prop.path} style={{ textDecoration: 'none', color: 'inherit' }} key={key}>
                                <MenuItem selected={this.activeRoute(prop.path)}>
                                    <ListItemIcon>
                                        <prop.icon />
                                    </ListItemIcon>
                                    <ListItemText primary={prop.sidebarName} />
                                </MenuItem>
                            </Link>
                        );
                    })}
                </MenuList>
            </div>
        );

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar} >
                    <Toolbar>
                        {/* <IconButton
                            color='inherit'
                            aria-label='Open drawer'
                            onClick={this.handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <Menu />
                        </IconButton> */}
                        <img src={Logo} alt="Logo" height='28' width='28' style={{ marginRight: 10 }} />
                        <Typography color="inherit" className={classes.title}>IWA Management System</Typography>
                        <Typography color="inherit" className={classes.username}>{this.state.user.first_name}</Typography>
                        <Badge badgeContent={4} color="primary">
                            <Notifications />
                        </Badge>
                        <IconButton
                            color='inherit'
                            onClick={this.handleAccountIcon}><AccountCircle /></IconButton>
                        <Popover
                            open={open}
                            anchorEl={this.state.anchorAccount}
                            onClose={this.handleCloseAccount}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <List component="nav">
                                {/* <ListItem button>
                                    <ListItemText primary="Profile" />
                                </ListItem> */}
                                <ListItem button onClick={this.logout}>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </List>
                        </Popover>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer}>
                    <Hidden mdUp implementation="css">
                        <Drawer
                            container={this.props.container}
                            variant="temporary"
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden smDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        <Route exact path="/" component={DesignPage} />
                        <Route path="/inventory" component={InventoryPage} />
                        <Route path="/design" component={DesignPage} />
                        {/* <Route path="/loom" component={LoomPage} /> */}
                        <Route path="/stock" component={StockPage} />
                    </Switch>
                    <BottomNavigation value={this.state.value} onChange={this.handlePageChange} className={classes.bottomNav}>
                        {/* <BottomNavigationAction label='Dashboard' value="dashboard" component={Link} to="/" icon={<img src={Dashboard} alt="Dashboard" height='28' width='28' />} className={this.state.value === 'dashboard' ? classes.bottomIcon : ''} /> */}
                        <BottomNavigationAction label='Inventory' value="inventory" component={Link} to="/inventory" icon={<img src={Inventory} alt="Inventory" height='28' width='28' />} className={this.state.value === 'inventory' ? classes.bottomIcon : ''} />
                        <BottomNavigationAction label='Design' value="design" component={Link} to="/design" icon={<img src={Design} alt="Design" height='28' width='28' />} className={this.state.value === 'design' ? classes.bottomIcon : ''} />
                        {/* <BottomNavigationAction label='Loom' value="loom" component={Link} to="/loom" icon={<img src={Loom} alt="Loom" height='28' width='28' />} className={this.state.value === 'loom' ? classes.bottomIcon : ''} /> */}
                        <BottomNavigationAction label='Stock' value="stock" component={Link} to="/stock" icon={<img src={Stock} alt="Stock" height='28' width='28' />} className={this.state.value === 'stock' ? classes.bottomIcon : ''} />
                    </BottomNavigation>
                </main>
            </div >
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, { withTheme: true })(App));
