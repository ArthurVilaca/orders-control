import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './report.css';

import axios from 'axios';

import { Card, CardTitle, CardText } from 'material-ui/Card';

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tickets: null
        }
    }

    componentDidMount() {
        axios.get('/api/tickets')
            .then((response) => {
                this.setState({ tickets: response.data.tickets });
            });
    }

    render() {
        if (!this.state.tickets) {
            return null;
        }
        return (
            <div className="content">
                {
                    this.state.tickets.map((ticket) => {
                        return (
                            <Card key={ticket.id}>
                                <CardTitle title={ticket.ticket} />
                                <CardText>
                                    <div key={ticket.product.id}>
                                        Produto: {ticket.product.name}
                                        <br />
                                        Status: {ticket.order.status}
                                        <br />
                                        Valor: {ticket.order.total}
                                    </div>
                                </CardText>
                            </Card>
                        )
                    })
                }
            </div>
        );
    }
}

export default withRouter(Report)