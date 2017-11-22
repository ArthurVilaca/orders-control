class CreateTicket < ActiveRecord::Migration[5.1]
  def change
    create_table :tickets, id: :uuid do |t|
      t.string :ticket
      t.references :order, type: :uuid
      t.references :product, type: :uuid

      t.timestamps
    end
  end
end
