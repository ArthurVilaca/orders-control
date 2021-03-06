import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import {Card, CardHeader, CardText} from 'material-ui/Card';
import { Doughnut, Bar } from 'react-chartjs-2'
import Spinner from 'react-spinkit'
import axios from 'axios'

import './home.css';

import gordinho from '../../assets/gordinho.gif';

const barChartOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
}

const statusNameMapping = {
    created: 'Criado',
    paid: 'Pago',
    cancelled: 'Cancelado',
    checking: 'Em análise',
    prepared_to_pay: 'Preparado para ser pago',
}
const statusToColorMapping = {
    created: '#ffce55',
    paid: '#36a2eb',
    cancelled: '#f45a5b',
    checking: '#f7a35c',
    prepared_to_pay: '#90ed7d',
}
const paymentTypeToColorMapping = {
    credito: '#36a2eb',
    debito: '#ffce55',
    boleto: '#f7a35c',
    paypal: '#90ed7d',
}
const paymentTypeNameMapping = {
    credito: 'Crédito',
    debito: 'Débito',
    boleto: 'Boleto',
    paypal: 'Paypal',
}

const formatOrdersData = orders => {
    const statuses = []
    const statusValues = {}
    orders.forEach(order => {
        const { status } = order
        if (!statuses.includes(status)) {
            statuses.push(status)
        }
        if (statusValues[status]) {
            statusValues[status] += 1
        } else {
            statusValues[status] = 1
        }
    })
    const humanizedStatuses = statuses.map(status => statusNameMapping[status])
    const colors = statuses.map(status => statusToColorMapping[status])

    return {
        labels: humanizedStatuses,
        datasets: [{
            backgroundColor: colors,
            data: Object.values(statusValues)
        }]
    }
}

const formatProductData = orders => {
    const numberOfProductOrders = {}
    const productNames = []
    orders.forEach(order => {
        order.products.forEach(product => {
            if (!product.name) return
            if (numberOfProductOrders[product.name]) {
                numberOfProductOrders[product.name] += 1
            } else {
                numberOfProductOrders[product.name] = 1
            }
            if (!productNames.includes(product.name)) {
                productNames.push(product.name)
            }
        })
    })

    return {
        labels: productNames,
        datasets: [{
            label: 'Incidência do produto nos pedidos',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: Object.values(numberOfProductOrders),
        }]
    }
}

const formatOrderPaymentTypeData = orders => {
    const paymentTypes = []
    const statusValues = {}
    orders.forEach(order => {
        const { payment_type: paymentType } = order
        if (!paymentTypes.includes(paymentType)) {
            paymentTypes.push(paymentType)
        }
        if (statusValues[paymentType]) {
            statusValues[paymentType] += 1
        } else {
            statusValues[paymentType] = 1
        }
    })
    const colors = paymentTypes.map(type => paymentTypeToColorMapping[type])
    const humanizedPaymentTypes = paymentTypes.map(type => paymentTypeNameMapping[type])

    return {
        labels: humanizedPaymentTypes,
        datasets: [{
            backgroundColor: colors,
            data: Object.values(statusValues)
        }]
    }
}

class Home extends Component {
    state = {
        orders: null
    }
    componentDidMount() {
        axios.get('/api/orders')
            .then(response => {
                this.setState({ orders: response.data.orders });
            });
    }

    render() {
        const { orders }  = this.state
        return (
            <div className="content" style={{ maxWidth: 1000 }}>
                <img src={ gordinho } style={{ marginBottom: 50, display: 'none' }} height={250} />
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    {!orders && <Spinner name="circle" color="blue" />}
                </div>
                {orders &&
                    <div style={{ display: 'flex', width: '100%' }}>
                        <Card style={{ marginRight: 10, flex: 1 }}>
                            <CardHeader title="Número de pedidos por status" textStyle={{ paddingRight: 0 }} titleStyle={{ paddingRight: 0 }} />
                            <CardText>
                                <Doughnut data={formatOrdersData(orders)} />
                            </CardText>
                        </Card>
                        <Card style={{ marginLeft: 10, flex: 1 }}>
                            <CardHeader title="Produtos mais famosos" textStyle={{ paddingRight: 0 }} titleStyle={{ paddingRight: 0 }} />
                            <CardText>
                                <Bar data={formatProductData(orders)} options={barChartOptions} />
                            </CardText>
                        </Card>
                    </div>
                }
                {orders &&
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: 15 }}>
                        <Card>
                            <CardHeader title="Pedidos por tipo de pagamento" textStyle={{ paddingRight: 0 }} titleStyle={{ paddingRight: 0 }} />
                            <CardText>
                                <Doughnut data={formatOrderPaymentTypeData(orders)} />
                            </CardText>
                        </Card>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(Home)