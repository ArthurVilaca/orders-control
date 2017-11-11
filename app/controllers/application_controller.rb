class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def index
    render file: 'public/index.html'
  end

  rescue_from ActiveRecord::RecordNotFound, with: :response_for_record_not_found

  def response_for_record_not_found(ex)
    render json: { errors: [I18n.t('record_not_found'), ex.message] }, status: :not_found
  end

  def render_validation_errors(model)
    render json: { errors: model.errors }, status: :unprocessable_entity
  end
end
