# @attr [string] id
# @attr [float] total
# @attr [integer] instalments
# @attr [integer] status
# @attr [string] payment_type
# @attr [date-time] created_at
# @attr [date-time] updated_at
# @attr [ClientSerializer] client
# @attr [Array<ProductSerializer>] products
class OrderSerializer < ActiveModel::Serializer
  attribute :id
  attribute :total
  attribute :instalments
  attribute :status
  attribute :payment_type
  attribute :created_at
  attribute :updated_at

  has_one :client, serializer: ClientSerializer
  has_many :products, serializer: ProductSerializer
end
