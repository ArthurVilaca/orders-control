require 'httparty'

module Api
  class OrdersController < ApplicationController
    before_action :set_order, only: %i[show update destroy check_picking]

    # @response_status 200
    # @response_root orders
    # @response_class Array<OrderSerializer>
    def index
      orders = Order.includes(:client, :products).all
      render json: { orders: JSON.parse(orders.to_json(include: [:client, :products])) }
    end

    # @response_status 200
    # @response_root order
    # @response_class OrderSerializer
    def show
      render_show_order
    end

    # @body_parameter [float] total
    # @body_parameter [integer] instalments
    # @body_parameter [integer] status - 0: criado, 1: pago, 2: cancelado, 3: chamado criado
    # @body_parameter [Input::ClientSerializer] client
    # @body_parameter [array<Input::ProductSerializer>] products
    # @response_status 200
    # @response_root order
    # @response_class OrderSerializer
    def create
      client = Client.find_or_initialize_by(email: client_params[:email])
      client_params.each{ |key, value| client[key] = value }
      products_params = params[:products] || []
      products = products_params.map{|product_param| Product.find_or_initialize_by(id: product_param[:id], name: product_param[:name], description: product_param[:description])}
      @order = Order.new(order_params)
      @order.products = products
      @order.client = client

      if @order.save
        render_show_order
      else
        render_validation_errors(@order)
      end
    end

    # @body_parameter [float] total
    # @body_parameter [integer] instalments
    # @body_parameter [integer] status - 0: criado, 1: pago, 2: cancelado, 3: chamado criado
    # @body_parameter [Input::ClientSerializer] client
    # @body_parameter [array<Input::ProductSerializer>] products
    # @response_status 200
    # @response_root order
    # @response_class OrderSerializer
    def update
      client = Client.find_or_initialize_by(email: client_params[:email])
      client_params.to_h.compact.each{ |key, value| client[key] = value }
      products_params = params[:products] || []

      @order.client.assign_attributes(client_params) if params[:client]
      products_params.each do |product_param|
        current_product = @order.products.all.find{|p| p.id == product_param[:id]}
        if current_product
          current_product.name = product_param[:name]
          current_product.description = product_param[:description]
          current_product.save!
        else
          @order.products.build(id: product_param[:id], name: product_param[:name], description: product_param[:description])
        end
      end

      if @order.update(order_params)
        @order.products.reload
        render_show_order
      else
        render_validation_errors(@order)
      end
    end

    def set_order
      @order = Order.includes(:client, :products).find(params[:id])
    end

    def render_show_order
      render json: { order: JSON.parse(@order.to_json(include: %i[client products])) }
    end

    def order_params
      params.permit(:total, :instalments, :status)
    end

    def client_params
      params.require(:client).permit(:id, :name, :registration, :email, :zip_code, :address, :city, :state, :country)
    end

    def picking
      order = Order.find(params[:id])
      @url_picking = 'http://chamadoapi.azurewebsites.net/chamado'
      params[:products].each { |value|
        product = Product.find(value[:id])
        @result = HTTParty.post(@url_picking.to_str,
          :body => {
                  status: 2,
                  idProduto: value[:id],
                  descricao: 'Retirada de produto no picking',
                  quantidade: 1,
                }.to_json,
          :headers => { 'Content-Type' => 'application/json' } )

        @ticket = Ticket.new( ticket: @result.parsed_response )
        @ticket.order = order
        @ticket.product = product

        @ticket.save
      }

      order.update status: :checking
      render json: @result.parsed_response
    end

    def check_picking
      tickets = Ticket.where( order: @order.id )
      result = []
      tickets.each { |ticket|
        @url_picking = 'http://chamadoapi.azurewebsites.net/' + ticket.ticket
        response = HTTParty.get(@url_picking.to_str)

        response.parsed_response['product'] = Product.find(response.parsed_response['idProduto'])
        result.push( response.parsed_response )
      }

      render json: result
    end
  end
end