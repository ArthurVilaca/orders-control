# @attr [string] id
# @attr [string] name
# @attr [string] description
class Input::ProductSerializer < ActiveModel::Serializer
  attribute :id
  attribute :name
  attribute :description
end
