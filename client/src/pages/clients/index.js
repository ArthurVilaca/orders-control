import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './clients.css';

import axios from 'axios';
import moment from 'moment';

import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const style = {
    marginRight: 20,
    position: 'fixed',
    bottom: '15px',
    right: '50px',
};

class Clients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clients: null
        }
    }

    componentDidMount() {
        axios.get('/api/clients')
            .then((response) => {
                this.setState({ clients: response.data.clients });
            });
    }

    delete(id) {
        axios.delete('/api/clients/' + id)
            .then((response) => {
                this.componentDidMount();
            });
    }

    render() {
        if(!this.state.clients) {
            return null;
        }
        return (
            <div className="content">
                {
                    this.state.clients.map( (client) => {
                        return (
                            <Card key={client.id}>
                                <CardTitle title={ client.name } />
                                <CardText>
                                    CPF: { client.registration }
                                    <br />
                                    Data Registro: { moment(client.created_at).format('L') }
                                </CardText>
                                <CardActions>
                                    <FlatButton
                                        label="Editar"
                                        onClick={() => {
                                            this.props.history.push('/client/' + client.id )
                                        }} />
                                    <FlatButton
                                        label="Excluir"
                                        onClick={() => {
                                            this.delete(client.id);
                                        }}
                                        />
                                </CardActions>
                            </Card>
                        )
                    })
                }

                <FloatingActionButton
                    style={style}
                    onClick={() => {
                        this.props.history.push('/client/new' )
                    }}
                    >
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }
}

export default withRouter(Clients)