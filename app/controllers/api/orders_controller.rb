module Api
  class OrdersController < ApplicationController
    before_action :set_order, only: %i[show update destroy]

    def index
      orders = Order.includes(:client, :products).all
      render json: { orders: JSON.parse(orders.to_json(include: [:client, :products])) }
    end

    def show
      render_show_order
    end

    def create
      client = Client.find_or_create_by(email: params[:client][:email]).update(client_params)
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

    def update
      if @order.update(order_params)
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
      params.permit(:total, :instalments, :value)
    end

    def client_params
      params.require(:client).permit(:name, :registration, :email, :zip_code, :address, :city, :state, :country)
    end
  end
end