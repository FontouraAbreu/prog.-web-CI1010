class CreateDocumentos < ActiveRecord::Migration[7.0]
  def change
    create_table :documentos do |t|
      t.string :rg
      t.string :cpf
      t.string :titulo_eleitor
      t.belongs_to :pessoa, null: false, foreign_key: true

      t.timestamps
    end
  end
end
