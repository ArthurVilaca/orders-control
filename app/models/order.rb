class Order < ApplicationRecord
  belongs_to :client, required: true
  has_many :order_products
  has_many :products, through: :order_products

  validates :status, presence: true

  enum status: %i[created paid cancelled checking]

  accepts_nested_attributes_for :client, :products
end
