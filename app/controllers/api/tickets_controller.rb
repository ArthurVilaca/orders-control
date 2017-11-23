require 'httparty'

module Api
  class TicketsController < ApplicationController
    before_action :set_order, only: %i[show update destroy check_picking picking pay]

    # @response_status 200
    # @response_root tickets
    # @response_class Array<TicketSerializer>
    def index
      tickets = Ticket.includes(:order, :product).all
      render json: { tickets: JSON.parse(tickets.to_json(include: [:order, :product])) }
    end
   
  end
end