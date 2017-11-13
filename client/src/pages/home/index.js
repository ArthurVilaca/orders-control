import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './home.css';

import gordinho from '../../assets/gordinho.gif';

class Home extends Component {

    render() {
        return (
            <div className="content">
                <img src={gordinho} />
            </div>
        );
    }
}

export default withRouter(Home)