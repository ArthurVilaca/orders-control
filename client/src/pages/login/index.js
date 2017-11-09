import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import './login.css';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Login extends Component {
    render() {
        return (
            <div className="content">
                <form className="form-login">
                    <div className="div">
                        <TextField
                            defaultValue=""
                            floatingLabelText="Usuario" />
                    </div>

                    <div className="div">
                        <TextField
                            defaultValue=""
                            floatingLabelText="Senha"
                            type="password" />
                    </div>

                    <div className="div">
                        <RaisedButton
                            className="btn-login"
                            onClick={() => {
                                this.props.history.push('/home')
                            }} 
                            backgroundColor="#2789BC" 
                            label="Entrar" />
                    </div>

                </form>
            </div>
        );
    }
}

export default withRouter(Login)