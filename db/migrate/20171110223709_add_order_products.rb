class AddOrderProducts < ActiveRecord::Migration[5.1]
  def change
    create_table :order_products, id: :uuid do |t|
      t.references :order, type: :uuid
      t.references :product, type: :uuid

      t.timestamps
    end
  end
end
