import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './order.css';

import RaisedButton from 'material-ui/RaisedButton';
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
        if(this.props.match.params.id) {
            axios.get('/api/orders/' + this.props.match.params.id)
                .then((response) => {
                    this.setState({ order: response.data.order });
                });
        } else {
            this.setState({ order: {} });
        }
    }

    toPicking() {
        
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
                                Produto: { order.product.name }
                                <br />
                                Data Pedido: { moment(order.created_at).format('L') }
                                <br />
                                Total: R$ { order.total }
                                <br />
                            </CardText>
                            <CardActions>
                                <FlatButton
                                    label="Enviar para picking"
                                    onClick={() => {
                                        this.toPicking();
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