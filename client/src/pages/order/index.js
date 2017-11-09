import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './order.css';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import axios from 'axios';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: null
        }
    }

    componentDidMount() {
        if(this.props.match.params.id) {
            axios.get('/api/orders/' + this.props.match.params.id)
                .then((response) => {
                    this.setState({ client: response.data.client });
                });
        } else {
            this.state.order = {};
        }
    }

    save() {
        if(this.props.match.params.id) {
            axios.put('/api/orders/' + this.props.match.params.id, this.state.order)
                .then((response) => {
                    this.props.history.push('/orders');
                });
        } else {
            axios.post('/api/orders', this.state.order)
                .then((response) => {
                    this.props.history.push('/orders');
                });
        }
    }

    render() {
        if(!this.state.order) {
            return null;
        }
        let client = this.state.order;
        return (
            <div className="content">
                <div>
                    <div className="div">
                        <RaisedButton
                            className="btn-save"
                            onClick={() => {
                                this.save()
                            }} 
                            backgroundColor="#2789BC" 
                            label="Salvar" />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Order)