class OrdersController < ApplicationController

    def index # display all orders
        render json: { orders: JSON.parse(Order.includes(:client, :product).all.to_json(include: [:client, :product])) }
    end

    def show # display a specific order
        render json: { order: JSON.parse(Order.includes(:client, :product).find(params[:id]).to_json(include: [:client, :product])) }
    end

    def create # create a new order
    end

    def update # update a specific order
    end

    def destroy # delete a specific order
    end


end