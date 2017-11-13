# @attr [string] id
# @attr [string] name
# @attr [string] registration
# @attr [string] email
# @attr [string] zip_code
# @attr [string] address
# @attr [string] city
# @attr [string] state
# @attr [string] country
# @attr [date-time] created_at
# @attr [date-time] updated_at
class ClientSerializer < ActiveModel::Serializer
  attribute :id
  attribute :name
  attribute :registration
  attribute :email
  attribute :zip_code
  attribute :address
  attribute :city
  attribute :state
  attribute :country
  attribute :created_at
  attribute :updated_at
end
