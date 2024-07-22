class CreatePessoas < ActiveRecord::Migration[7.0]
  def change
    create_table :pessoas do |t|
      t.string :nome
      t.string :sobrenome
      t.string :universidade
      t.belongs_to :estado, null: false, foreign_key: true

      t.timestamps
    end
  end
end
