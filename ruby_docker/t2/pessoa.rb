$:.push './'
require 'active_record'
require_relative 'estado.rb'
require_relative 'documento.rb'
require_relative 'esportes.rb'


ActiveRecord::Base.establish_connection :adapter => "sqlite3", :database => "Tabelas.sqlite3"

class Pessoa < ActiveRecord::Base;
    belongs_to :estado
    has_one :documento
    has_and_belongs_to_many :esportes, -> { distinct }

    # Create
    def self.criar_pessoa(params)
        puts params
        pessoa = self.new(params)
        pessoa.save
    end

    # Read
    def self.listar_pessoas()
        self.all
    end

    # Update
    def self.atualizar_pessoa(params)
        pessoa = self.find(params['id'])
        pessoa.update(params)
    end

    # Delete
    def self.deletar_pessoa(id)
        pessoa = self.find(id)
        # Remove all associations
        pessoa.esportes.clear
        pessoa.documento.destroy
        pessoa.destroy
    end
end

# Process command line arguments
command = ARGV[0]
if ARGV[1] != nil
    params = ARGV[1..-1].map { |arg| arg.split('=') }.to_h
end

if __FILE__ == $0
    case command
        when 'cria' # ruby pessoas.rb cria "João"
            nome = params['nome'] || 'n/a'
            sobrenome = params['sobrenome'] || 'n/a'
            universidade = params['universidade'] || 'n/a'
            estado_id = params['estado'] || nil
            estado = Estado.find_by(sigla: estado_id)

            Pessoa.criar_pessoa({nome: nome, sobrenome: sobrenome, universidade: universidade, estado: estado})
        when 'lista' # ruby pessoas.rb lista
            Pessoa.listar_pessoas.each do |pessoa|
                puts "ID: #{pessoa&.id}, Nome: #{pessoa&.nome}, Sobrenome: #{pessoa&.sobrenome}, Universidade: #{pessoa&.universidade}, Estado: #{pessoa.estado&.sigla}, RG: #{pessoa.documento&.rg}, CPF: #{pessoa.documento&.cpf}, Titulo de Eleitor: #{pessoa.documento&.titulo_eleitor}, Esportes: #{pessoa.esportes.map(&:nome).join(', ')}"
            end
        when 'atualiza' # ruby pessoas.rb atualiza 1 "José"
            Pessoa.atualizar_pessoa(params)
        when 'deleta' # ruby pessoas.rb deleta 1
            Pessoa.deletar_pessoa(params['id'])
        when 'help' # ruby pessoas.rb help
            puts "Atributos: nome, sobrenome, universidade, estado, esportes, rg, cpf, titulo_eleitor"
            puts "Comandos disponíveis: cria {atributos}, lista, atualiza {atributos}, deleta"
            puts "Cria: ruby pessoas.rb cria nome=João sobrenome=Silva universidade=USP estado=SP esportes=1,2 rg=123456789 cpf=987654321 titulo_eleitor=123456789"
            puts "\t(estado e esportes devem ser IDs válidos, caso contrário, serão nulos)"
            puts "Lista: ruby pessoas.rb lista"
            puts "Atualiza: ruby pessoas.rb atualiza id=1 nome=José sobrenome=Silva"
            puts "Deleta: ruby pessoas.rb deleta id=1"
        # quando for vazio, não faz nada
        when nil

        else
            puts "Comando desconhecido: #{command}"
    end
end
