$:.push './'
require 'active_record'
require 'pessoa.rb'

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
    def self.atualizar_esporte(params)
        esporte = self.find(params['id'])
        esporte.update(params)
    end

    # Delete
    def self.deletar_esporte(id)
        esporte = self.find(id)
        # Remove all associations
        esporte.pessoas.clear
        Pessoa.listar_pessoas.each do |pessoa|
            pessoa.esportes.delete(esporte)
        end
        esporte.destroy
    end
end

if __FILE__ == $0
# Process command line arguments
command = ARGV[0]
if ARGV[1] != nil
    params = ARGV[1..-1].map { |arg| arg.split('=') }.to_h
end

    case command
        when 'cria' # ruby esportes.rb cria "Futebol"
            nome = param['nome'] || 'n/a'
            Esporte.criar_esporte({nome: nome})
            puts "Esporte criado com sucesso!"
        when 'lista' # ruby esportes.rb lista
            Esporte.listar_esportes.each do |esporte|
                puts "ID: #{esporte&.id}, Nome: #{esporte&.nome}"
            end
        when 'atualiza' # ruby esportes.rb atualiza 1 "Futebol"
            esporte = Esporte.find_by(id: params['id'])
            if esporte.nil?
                puts "Esporte não encontrado"
                return
            end
            nome = params['nome'] || esporte.nome
            Esporte.atualizar_esporte({id: params['id'], nome: nome})
        when 'deleta'
            Esporte.deletar_esporte(params['id'])
        when 'help'
            puts "Atributos: nome"
            puts "Comandos: cria {atributos}, lista, atualiza {atributos}, deleta"
            puts "Cria: ruby esportes.rb cria nome='Futebol'"
            puts "Atualiza: ruby esportes.rb atualiza id=1 nome='Futebol'"
            puts "Deleta: ruby esportes.rb deleta id=1"
        # quando for vazio, não faz nada
        when nil

        else
            puts "Comando desconhecido: #{command}"
    end
end