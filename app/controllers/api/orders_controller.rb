require 'httparty'

module Api
  class OrdersController < ApplicationController
    before_action :set_order, only: %i[show update destroy check_picking picking pay]

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
    # @body_parameter [integer] status - 0: criado, 1: pago, 2: cancelado, 3: chamado criado, 4: preparado para pagar
    # @body_parameter [integer] payment_type - 0: credito, 1: debito, 2: boleto, 3: paypal
    # @body_parameter [Input::ClientSerializer] client
    # @body_parameter [array<Input::ProductSerializer>] products
    # @response_status 200
    # @response_root order
    # @response_class OrderSerializer
    def create
      client = Client.find_or_initialize_by(email: client_params[:email])
      client_params.each do |key, value|
        client[key] = value if value.present?
      end
      products_params = params[:products] || []
      products = products_params.map do |product_param|
        product = Product.find_or_initialize_by(id: product_param[:id])
        product.name = product_param[:name] if product_param[:name].present?
        product.description = product_param[:description] if product_param[:description].present?
        product.price = product_param[:price] if product_param[:price].present?
        product
      end
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
    # @body_parameter [integer] status - 0: criado, 1: pago, 2: cancelado, 3: chamado criado, 4: preparado para pagar
    # @body_parameter [integer] payment_type - 0: credito, 1: debito, 2: boleto, 3: paypal
    # @body_parameter [Input::ClientSerializer] client
    # @body_parameter [array<Input::ProductSerializer>] products
    # @response_status 200
    # @response_root order
    # @response_class OrderSerializer
    def update
      client = Client.find_or_initialize_by(email: client_params[:email])
      client_params.each do |key, value|
        client[key] = value if value.present?
      end
      products_params = params[:products] || []

      @order.client.assign_attributes(client_params) if params[:client]
      products_params.each do |product_param|
        current_product = @order.products.all.find{|p| p.id == product_param[:id]}
        if current_product
          current_product.name = product_param[:name] if product_param[:name].present?
          current_product.description = product_param[:description] if product_param[:description].present?
          current_product.price = product_param[:price] if product_param[:price].present?
          current_product.save!
        else
          @order.products.build(id: product_param[:id], name: product_param[:name], description: product_param[:description], price: product_param[:price])
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
      params.permit(:total, :instalments, :status, :payment_type)
    end

    def client_params
      params.require(:client).permit(:id, :name, :registration, :email, :zip_code, :address, :city, :state, :country)
    end

    def picking
      url_picking = "#{tickets_base_url}/chamado"
      tickets = params[:products].map do |value|
        product = Product.find(value[:id])
        result = HTTParty.post(url_picking.to_str,
          :body => {
                  status: 2,
                  idProduto: value[:id],
                  descricao: 'Retirada de produto no picking',
                  quantidade: 1,
                }.to_json,
          :headers => { 'Content-Type' => 'application/json' } )

        ticket_id = result.parsed_response
        ticket = Ticket.new( ticket: ticket_id )
        ticket.order = @order
        ticket.product = product

        ticket.save
        ticket_id
      end
      tickets_status = tickets.map do |ticket_id|
        response = HTTParty.get(
          "#{tickets_base_url}/#{ticket_id}",
          headers: { 'Content-Type' => 'application/json' }
        ).parsed_response || {}
        response['status']
      end

      set_order_status(tickets_status)

      @order.save
      render json: tickets
    end

    def check_picking
      tickets = Ticket.where( order: @order.id )
      result = tickets.map { |ticket|
        response = HTTParty.get("#{tickets_base_url}/#{ticket.ticket}", headers: { 'Content-Type' => 'application/json' })

        response.parsed_response['product'] = Product.find(response.parsed_response['idProduto'])
        response.parsed_response
      }
      tickets_status = result.map{ |ticket_data| ticket_data['status'] }
      if @order.status != :paid
        set_order_status(tickets_status)
        @order.save!
      end

      render json: { tickets: result, order: JSON.parse(@order.to_json(include: %i[client products])) }
    end

    def pay
      body = {
        valor: @order.total,
        tipo: 'credito',
        dataEfetivacao: Time.now.strftime('%Y-%m-%d')
    }.to_json
      payment_url = "#{finance_base_url}/conta"
      response = HTTParty.post(payment_url, body: body, headers: { 'Content-Type' => 'application/json' })
      @order.update(status: :paid) if response.code == 200 || response.code == 204

      render_show_order
    end

    private
      def set_order_status(tickets_status)
        if tickets_status.all? {|status| status == 3}
          @order.status = :prepared_to_pay
        elsif tickets_status.any? {|status| status == 5}
          @order.status = :cancelled
        else 
          @order.status = :checking
        end
      end

      def tickets_base_url
        'http://chamadoapi.azurewebsites.net'
      end

      def finance_base_url
        'http://165.227.67.87/api'
      end
  end
end