import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './order.css';

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import axios from 'axios';
import moment from 'moment';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: null
        }
    }

    componentDidMount() {
        axios.get('/api/orders/' + this.props.match.params.id)
            .then((response) => {
                this.setState({ order: response.data.order });
            });
    }

    toPicking() {
        axios.post('/api/orders/picking', this.state.order)
            .then((response) => {
                if(response) {
                    this.componentDidMount();
                }
            });
    }

    checkPicking() {
        axios.get('/api/orders/picking')
            .then((response) => {
                if(response) {
                    this.componentDidMount();
                }
            });
    }

    render() {
        if(!this.state.order) {
            return null;
        }
        let order = this.state.order;
        return (
            <div className="content">
                <div>
                    <div className="div">
                        <Card key={order.id}>
                            <CardTitle title={ order.id } subtitle={ order.client.name } />
                            <CardText>
                                { order.products.map( (product) =>  (
                                    <div>
                                        Produto: { product.name }
                                        <br />
                                    </div>
                                    )
                                )}
                                <br />
                                Status: { order.status }
                                <br />
                                Data Pedido: { moment(order.created_at).format('L') }
                                <br />
                                Total: R$ { order.total }
                            </CardText>
                            <CardActions>
                                <FlatButton
                                    label="Enviar para picking"
                                    onClick={() => {
                                        if(this.state.order.status == 'checking') {
                                            this.checkPicking();
                                        } else if(this.state.order.status == 'created') {
                                            this.toPicking();
                                        }
                                    }} />
                            </CardActions>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Order)