class RemoveValueFromOrder < ActiveRecord::Migration[5.1]
  def up
    remove_column :orders, :value
  end

  def down
    add_column :orders, :value, :float
  end
end
