module Api
  class ClientsController < ApplicationController
    before_action :set_client, only: %i[show update destroy]

    def index
      render json: { clients: Client.all }
    end

    def show
      render_show_client
    end

    def create
      render json: { client: Client.create(client_params) }
    end

    def update
      if @client.update(client_params)
        render_show_client
      else
        render_validation_errors(@client)
      end
    end

    def destroy
      @client.destroy!
      render body: nil, status: :no_content
    end

    def set_client
      @client = Client.find(params[:id])
    end

    def render_show_client
      render json: { client: @client }
    end

    def client_params
      params.require(:client).permit(:name, :registration, :email, :zip_code, :address, :city, :state, :country)
    end
  end
end
