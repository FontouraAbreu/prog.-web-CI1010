class CreateMunicipios < ActiveRecord::Migration[7.0]
  def change
    create_table :municipios do |t|
      t.string :nome
      t.belongs_to :estado, null: false, foreign_key: true

      t.timestamps
    end
  end
end
