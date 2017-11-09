class CreateOrders < ActiveRecord::Migration[5.1]
  def change
    create_table :orders do |t|
      t.references :product, foreign_key: true
      t.float :total
      t.integer :instalments
      t.float :value
      t.references :client, foreign_key: true

      t.timestamps
    end
  end
end
