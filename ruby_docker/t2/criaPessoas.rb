require 'active_record'

ActiveRecord::Base.establish_connection :adapter => "sqlite3",:database => "Tabelas.sqlite3"

ActiveRecord::Base.connection.create_table :pessoas do |t|
    t.string :sobrenome
    t.string :nome
    t.string :universidade
    t.references :estado, foreign_key: true
    t.references :documento, foreign_key: true
end