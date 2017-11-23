import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './report.css';

import axios from 'axios';
import moment from 'moment';

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
                <table className="table">
                        <tr>
                            <td>id</td>
                            <td>Produto</td>
                            <td>Data</td>
                            <td>Chamado</td>
                        </tr>
                {
                    this.state.tickets.map((ticket) => {
                        return (
                            <tr>
                                <td>{ ticket.id }</td>
                                <td>{ ticket.product.name }</td>
                                <td>{ moment(ticket.created_at).format('L') }</td>
                                <td>{ ticket.ticket }</td>
                            </tr>
                        )
                    })
                }
                </table>
            </div>
        );
    }
}

export default withRouter(Report)