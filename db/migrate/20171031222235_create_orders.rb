class CreateOrders < ActiveRecord::Migration[5.1]
  def change
    create_table :orders, id: :uuid do |t|
      t.float :total
      t.integer :instalments
      t.float :value
      t.references :client, type: :uuid

      t.timestamps
    end
  end
end
