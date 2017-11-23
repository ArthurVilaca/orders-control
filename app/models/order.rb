class Order < ApplicationRecord
  belongs_to :client, required: true
  has_many :order_products
  has_many :products, through: :order_products
  after_initialize :set_defaults

  validates :status, presence: true

  enum status: %i[created paid cancelled checking prepared_to_pay]

  accepts_nested_attributes_for :client, :products

  def set_defaults
    self.status ||= :created
  end
end
