class ClientsController < ApplicationController
    
    def index
        render json: { clients: [] }
    end

    def show
        render json: { client: [] }
    end

    def create
    end

    def update
    end

    def destroy
    end


end