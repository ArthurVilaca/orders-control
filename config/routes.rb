Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # get "/app", :to => 'welcome#index'

  resources :orders

  resources :clients

end
