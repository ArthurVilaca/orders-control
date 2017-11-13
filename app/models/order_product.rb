class OrderProduct < ApplicationRecord
  belongs_to :order, required: true
  belongs_to :product, required: true
end
