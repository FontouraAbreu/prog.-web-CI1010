class CreateEstados < ActiveRecord::Migration[7.0]
  def change
    create_table :estados do |t|
      t.string :nome
      t.string :sigla, limit: 2

      t.timestamps
    end
  end
end
