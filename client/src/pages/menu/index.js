import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './menu.css';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

class Menu extends Component {
    state = {
        open: false
    };

    handleToggle = () => this.setState({open: !this.state.open});

    render() {
        return (
            <div>
                <AppBar
                    title="Gerenciamento de pedidos"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    onClick={this.handleToggle} />
                <Drawer
                    open={this.state.open}
                    docked={false}
                    onRequestChange={(open) => this.setState({open})}>

                        <MenuItem
                            onClick={() => {
                                this.props.history.push('/home')
                            }}>
                            Home Page
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                this.props.history.push('/orders')
                            }}>
                            Pedidos
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                this.props.history.push('/clients')
                            }}>
                            Clients
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                this.props.history.push('/login')
                            }}>
                            Sair
                        </MenuItem>
                </Drawer>
            </div>
        );
    }
}

export default withRouter(Menu)