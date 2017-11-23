import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './order.css';

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import axios from 'axios';
import moment from 'moment';

const statusToActionMapping = {
    created: 'Enviar para picking',
    prepared_to_pay: 'Enviar para financeiro',
    default: 'Checar picking',
}

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: null,
            tickets: null
        }
    }

    componentDidMount() {
        axios.get('/api/orders/' + this.props.match.params.id)
            .then((response) => {
                this.setState({ order: response.data.order });
            });
    }

    toPicking() {
        axios.post('/api/orders/' + this.state.order.id + '/picking', this.state.order)
            .then((response) => {
                if(response) {
                    this.componentDidMount();
                }
            });
    }

    payOrder() {
        axios.post(`/api/orders/${this.state.order.id}/pay`, this.state.order)
            .then((response) => {
                if(response) {
                    this.componentDidMount();
                }
            });
    }

    checkPicking() {
        axios.get('/api/orders/' + this.state.order.id + '/picking')
            .then((response) => {
                if(response) {
                    this.setState({ tickets: response.data.tickets, order: response.data.order })
                }
            });
    }

    render() {
        const { order, tickets }  = this.state

        if(!order) {
            return null;
        }
        if(order.status !== 'created' && tickets === null) {
            this.checkPicking();
        }

        return (
            <div className="content">
                <div>
                    <div className="div">
                        <Card key={order.id}>
                            <CardTitle title={order.client.name} subtitle={order.id} />
                            <CardText>
                                { order.products.map( (product) =>  (
                                    <div key={product.id}>
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
                                {order.status === 'paid' && <div className="paid-order-message">Ordem paga com sucesso!</div>}
                                {order.status !== 'paid' &&
                                    <FlatButton
                                        label={statusToActionMapping[order.status] || statusToActionMapping.default}
                                        onClick={() => {
                                            if (order.status === 'checking') {
                                                this.checkPicking();
                                            } else if (order.status === 'created') {
                                                this.toPicking();
                                            } else if (order.status === 'prepared_to_pay') {
                                                this.payOrder();
                                            }
                                        }}
                                    />
                                }
                            </CardActions>
                        </Card>
                    </div>
                    <div className="tickets">
                        {
                            !this.state.tickets ? null : 
                            <div>
                                { this.state.tickets.map( (ticket) =>  (
                                    <div className="tickets-product">
                                        Produto: { ticket.product.name }
                                        <br />
                                        Chamado: { ticket.motivo }
                                    </div>
                                    )
                                )}
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Order)