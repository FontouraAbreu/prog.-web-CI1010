class CreateEsportes < ActiveRecord::Migration[7.0]
  def change
    create_table :esportes do |t|
      t.string :nome

      t.timestamps
    end
  end
end
