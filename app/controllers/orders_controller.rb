class OrdersController < ApplicationController

    def index # display all orders
        render json: { orders: [] }
    end

    def show # display a specific order
        render json: { order: [] }
    end

    def create # create a new order
    end

    def update # update a specific order
    end

    def destroy # delete a specific order
    end


end