$:.push './'
require 'active_record'
require 'pessoa.rb'
require 'municipio.rb'

ActiveRecord::Base.establish_connection:adapter => 'sqlite3', :database => 'Tabelas.sqlite3'

# Ative record will pluralize the class name to find the table name
class Estado < ActiveRecord::Base
    has_many :municipios
    has_many :pessoas

    # Create
    def self.criar_estado(params)
        estado = self.new(params)
        estado.save
    end

    # Read
    def self.listar_estados()
        self.all
    end

    # Update
    def self.atualizar_estado(id, params)
        estado = self.find(id)
        estado.update(params)
    end

    # Delete
    def self.deletar_estado(estado)
        sigla = estado.sigla
        # Update pessoas
        pessoas = Pessoa.all
        pessoas = pessoas.where(estado: estado)
        pessoas.each do |pessoa|
            pessoa.update(estado: nil)
        end
        # Update municipios
        municipios = Municipio.all
        municipios = municipios.where(estado: estado)
        municipios.each do |municipio|
            municipio.update(estado: nil)
        end
        estado.destroy
    end
end

if __FILE__ == $0
# Process command line arguments
command = ARGV[0]
if ARGV[1] != nil
    params = ARGV[1..-1].map { |arg| arg.split('=') }.to_h
end

    case command
        when 'cria' # ruby estados.rb cria "São Paulo"
            nome = params['nome'] || 'n/a'
            sigla = params['sigla'] || 'n/a'
            codigo_uf = params['codigo_uf'] || 'n/a'

            Estado.criar_estado({nome: nome, sigla: sigla, codigo_uf: codigo_uf})
            puts "Estado criado com sucesso!"
            puts "Nome: #{nome}, Sigla: #{sigla}, Código UF: #{codigo_uf}"
        when 'lista' # ruby estados.rb lista
            Estado.listar_estados.each do |estado|
                puts "ID: #{estado&.id}, Nome: #{estado&.nome}, Sigla: #{estado&.sigla}, Código UF: #{estado&.codigo_uf}"
            end
        when 'atualiza' # ruby estados.rb atualiza 1 "Rio de Janeiro"
            estado = Estado.find_by(id: params['id'])

            if estado.nil?
                puts "Estado não encontrado"
                return
            end

            nome = params['nome'] || estado.nome
            sigla = params['sigla'] || estado.sigla
            codigo_uf = params['codigo_uf'] || estado.codigo_uf

            estado.update({nome: nome, sigla: sigla, codigo_uf: codigo_uf})
        when 'deleta' # ruby estados.rb deleta 1
            estado = Estado.find_by(id: params['id'])
            if estado.nil?
                puts "Estado não encontrado"
                return
            end
            Estado.deletar_estado(estado)
        when 'help' # ruby estados.rb help
            puts 'Atributos: nome, sigla, codigo_uf'
            puts "Comandos disponíveis: cria {atributos}, lista, atualiza {atributos}, deleta"
            puts "Cria: ruby estados.rb cria nome=Mordor sigla=MD codigo_uf=73"
            puts "Atualiza: ruby estados.rb atualiza id=1 nome='Minas Gerais'"
            puts "Deleta: ruby estados.rb deleta id=1"
        # quando for vazio, não faz nada
        when nil

        else
            puts "Comando desconhecido: #{command}"
    end
end