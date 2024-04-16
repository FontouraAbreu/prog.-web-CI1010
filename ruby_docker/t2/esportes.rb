require 'active_record'

ActiveRecord::Base.establish_connection(adapter: 'sqlite3', database: 'Tabelas.sqlite3')

class Esporte < ActiveRecord::Base
    has_and_belongs_to_many :pessoas, -> { distinct }

    # Create
    def self.criar_esporte(params)
        esporte = self.new(params)
        esporte.save
    end

    # Read
    def self.listar_esportes()
        self.all
    end

    # Update
    def self.atualizar_esporte(id, params)
        esporte = self.find(id)
        esporte.update(params)
    end

    # Delete
    def self.deletar_esporte(id)
        esporte = self.find(id)
        # Remove all associations
        esporte.pessoas.clear
        esporte.destroy
    end
end

# Process command line arguments
command = ARGV[0]
param = ARGV[1]

case command
    when 'cria' # ruby esportes.rb cria "Futebol"
        Esporte.criar_esporte({nome: param})
    when 'lista' # ruby esportes.rb lista
        esporte = Esporte.listar_esportes()
        puts esporte.nome
    when 'altera' # ruby esportes.rb atualiza 1 "Futebol"
        Esporte.atualizar_esporte(param.to_i, {nome: ARGV[2]})
    when 'deleta'
        Esporte.deletar_esporte(param.to_i)
    # quando for vazio, não faz nada
    when nil

    else
        puts "Comando desconhecido: #{command}"
end