class CreateClients < ActiveRecord::Migration[5.1]
  def change
    create_table :clients, id: :uuid do |t|
      t.string :name
      t.string :registration
      t.string :email
      t.string :zip_code
      t.string :address
      t.string :city
      t.string :state
      t.string :country

      t.timestamps
    end
  end
end
