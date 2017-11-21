import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './client.css';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import axios from 'axios';

class Client extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client: null
        }
    }

    componentDidMount() {
        if(this.props.match.params.id && this.props.match.params.id !== 'new') {
            axios.get('/api/clients/' + this.props.match.params.id)
                .then((response) => {
                    this.setState({ client: response.data.client });
                });
        } else {
            this.setState({ client: {} });
        }
    }

    save() {
        if(this.props.match.params.id && this.props.match.params.id !== 'new') {
            axios.put('/api/clients/' + this.props.match.params.id, this.state.client)
                .then((response) => {
                    this.props.history.push('/clients');
                });
        } else {
            axios.post('/api/clients', this.state.client)
                .then((response) => {
                    this.props.history.push('/clients');
                });
        }
    }

    render() {
        if(!this.state.client) {
            return null;
        }
        let client = this.state.client;
        return (
            <div className="content">
                <div>
                    <TextField
                        defaultValue={client.name}
                        floatingLabelText="Usuario" />
                    <br />

                    <TextField
                        defaultValue={client.registration}
                        floatingLabelText="Cpf" />
                    <br />

                    <TextField
                        defaultValue={client.email}
                        floatingLabelText="E-mail" />
                    <br />

                    <TextField
                        defaultValue={client.zip_code}
                        floatingLabelText="Cep" />
                    <br />

                    <TextField
                        defaultValue={client.address}
                        floatingLabelText="Endereço" />
                    <br />

                    <TextField
                        defaultValue={client.city}
                        floatingLabelText="Cidade" />
                    <br />

                    <TextField
                        defaultValue={client.state}
                        floatingLabelText="Estado" />
                    <br />

                    <TextField
                        defaultValue={client.country}
                        floatingLabelText="Pais" />
                    <br />

                    <div className="div">
                        <RaisedButton
                            className="btn-login"
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

export default withRouter(Client)