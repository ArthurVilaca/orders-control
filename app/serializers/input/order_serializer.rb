# @attr [string] id
# @attr [float] total
# @attr [integer] instalments
# @attr [integer] status
# @attr [string] payment_type
# @attr [Input::ClientSerializer] client
# @attr [Array<Input::ProductSerializer>] products
class Input::OrderSerializer < ActiveModel::Serializer
  attribute :id
  attribute :total
  attribute :instalments
  attribute :status
  attribute :payment_type

  has_one :client, serializer: ClientSerializer
  has_many :products, serializer: ProductSerializer
end
