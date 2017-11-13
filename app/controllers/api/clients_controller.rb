module Api
  class ClientsController < ApplicationController
    before_action :set_client, only: %i[show update destroy]

    # @response_status 200
    # @response_root clients
    # @response_class Array<ClientSerializer>
    def index
      render json: { clients: Client.all }
    end

    # @response_status 200
    # @response_root client
    # @response_class ClientSerializer
    def show
      render_show_client
    end

    # @body_parameter [string] name
    # @body_parameter [string] registration
    # @body_parameter [string] email
    # @body_parameter [string] zip_code
    # @body_parameter [string] address
    # @body_parameter [string] city
    # @body_parameter [string] state
    # @body_parameter [string] country
    # @response_status 200
    # @response_root client
    # @response_class ClientSerializer
    def create
      render json: { client: Client.create(client_params) }
    end

    # @body_parameter [string] name
    # @body_parameter [string] registration
    # @body_parameter [string] email
    # @body_parameter [string] zip_code
    # @body_parameter [string] address
    # @body_parameter [string] city
    # @body_parameter [string] state
    # @body_parameter [string] country
    # @response_status 200
    # @response_root client
    # @response_class ClientSerializer
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
      params.permit(:name, :registration, :email, :zip_code, :address, :city, :state, :country)
    end
  end
end
