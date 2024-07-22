class CreateJoinTableEsportePessoa < ActiveRecord::Migration[7.0]
  def change
    create_join_table :esportes, :pessoas do |t|
      # t.index [:esporte_id, :pessoa_id]
      # t.index [:pessoa_id, :esporte_id]
    end
  end
end
