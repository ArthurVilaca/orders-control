class CreateTickets < ActiveRecord::Migration[5.1]
  def change
    create_table :tickets, id: :uuid do |t|
      t.string :descritption

      t.timestamps
    end
  end
end
