# @attr [string] id
# @attr [string] name
# @attr [string] instalments
# @attr [date-time] created_at
# @attr [date-time] updated_at
class ProductSerializer < ActiveModel::Serializer
  attribute :id
  attribute :name
  attribute :description
  attribute :created_at
  attribute :updated_at
end
