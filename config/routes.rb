Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # get "/app", :to => 'welcome#index'

  mount Swaggard::Engine, at: '/swagger/'

  root to: 'application#index'

  namespace :api do
    resources :orders do
      member do
        post :picking, to: 'orders#picking'
        post :pay, to: 'orders#pay'
        get :picking, to: 'orders#check_picking'
      end
    end
    resources :clients
    resources :tickets
  end

  get '*path', to: 'application#index'
end
