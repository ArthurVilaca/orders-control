import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './orders.css';

import axios from 'axios';
import moment from 'moment';

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: null
        }
    }

    componentDidMount() {
        axios.get('/api/orders')
            .then((response) => {
                this.setState({ orders: response.data.orders });
            });
    }

    render() {
        if (!this.state.orders) {
            return null;
        }
        return (
            <div className="content">
                {
                    this.state.orders.map((order) => {
                        return (
                            <Card key={order.id}>
                                <CardTitle title={order.client.name} subtitle={order.id} />
                                <CardText>
                                    {order.products.map((product) => (
                                        <div key={product.id}>
                                            Produto: {product.name}
                                            <br />
                                        </div>
                                    )
                                    )}
                                    <br />
                                    Status: {order.status}
                                    <br />
                                    Data Pedido: {moment(order.created_at).format('L')}
                                    <br />
                                    Total: R$ {order.total}
                                </CardText>
                                <CardActions>
                                    <FlatButton
                                        label="Acompanhamento"
                                        onClick={() => {
                                            this.props.history.push('/order/' + order.id)
                                        }} />
                                    <FlatButton
                                        label="Cancelar Pedido"
                                        onClick={() => {
                                        }}
                                    />
                                </CardActions>
                            </Card>
                        )
                    })
                }
            </div>
        );
    }
}

export default withRouter(Orders)