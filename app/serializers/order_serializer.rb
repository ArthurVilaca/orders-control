# @attr [string] id
# @attr [float] total
# @attr [integer] instalments
# @attr [integer] status
# @attr [date-time] created_at
# @attr [date-time] updated_at
class OrderSerializer < ActiveModel::Serializer
  attribute :id
  attribute :total
  attribute :instalments
  attribute :status
  attribute :created_at
  attribute :updated_at

  has_one :client, serializer: ClientSerializer
  has_many :products, serializer: ProductSerializer
end
