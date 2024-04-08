class CreateBorrowings < ActiveRecord::Migration[7.0]
  def change
    create_table :borrowings do |t|
      t.belongs_to :person, null: false, foreign_key: true
      t.belongs_to :book, null: false, foreign_key: true

      t.timestamps
    end
  end
end
