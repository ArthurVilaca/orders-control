# @attr [string] id
# @attr [string] name
# @attr [string] description
# @attr [float] price
class Input::ProductSerializer < ActiveModel::Serializer
  attribute :id
  attribute :name
  attribute :description
  attribute :price
end
