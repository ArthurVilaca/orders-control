module Api
  class OrdersController < ApplicationController
    before_action :set_order, only: %i[show update destroy]

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
    # @body_parameter [integer] status - 0: criado, 1: pago
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
    # @body_parameter [integer] status - 0: criado, 1: pago
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
  end
end