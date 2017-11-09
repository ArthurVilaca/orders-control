Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # get "/app", :to => 'welcome#index'

  root to: 'application#index'

  namespace :api do
    resources :orders

    resources :clients
  end

  get '*path', to: 'application#index'
end
