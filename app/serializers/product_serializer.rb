# @attr [string] id
# @attr [string] name
# @attr [string] description
# @attr [float] price
# @attr [date-time] created_at
# @attr [date-time] updated_at
class ProductSerializer < ActiveModel::Serializer
  attribute :id
  attribute :name
  attribute :description
  attribute :price
  attribute :created_at
  attribute :updated_at
end
