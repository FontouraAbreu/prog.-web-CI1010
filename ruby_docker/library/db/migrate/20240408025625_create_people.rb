class CreatePeople < ActiveRecord::Migration[7.0]
  def change
    create_table :people do |t|
      t.string :last_name
      t.string :first_name
      t.string :address
      t.string :city

      t.timestamps
    end
  end
end
