class ApplicationController < ActionController::Base
  def index
    render file: 'public/index.html'
  end

  rescue_from ActiveRecord::RecordNotFound, with: :response_for_record_not_found

  def response_for_record_not_found(ex)
    render json: { errors: [ex.message] }, status: :not_found
  end

  def render_validation_errors(model)
    render json: { errors: model.errors }, status: :unprocessable_entity
  end
end
