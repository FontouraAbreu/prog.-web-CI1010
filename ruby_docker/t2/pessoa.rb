require 'active_record'

ActiveRecord::Base.establish_connection :adapter => "sqlite3", :database => "Tabelas.sqlite3"

class Pessoa < ActiveRecord::Base;
    belongs_to :estado
    has_one :documento
    has_and_belongs_to_many :esportes, -> { distinct }

    # Create
    def self.criar_pessoa(params)
        pessoa = self.new(params)
        pessoa.save
    end

    # Read
    def self.listar_pessoas()
        self.all
    end

    # Update
    def self.atualizar_pessoa(id, params)
        pessoa = self.find(id)
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
param = ARGV[1]

case command
    when 'cria' # ruby pessoas.rb cria "João"
        Pessoa.criar_pessoa({nome: param})
    when 'lista' # ruby pessoas.rb lista
        Pessoa.listar_pessoas.each do |pessoa|
            puts pessoa.nome
        end
    when 'atualiza' # ruby pessoas.rb atualiza 1 "José"
        Pessoa.atualizar_pessoa(param.to_i, {nome: ARGV[2]})
    when 'deleta' # ruby pessoas.rb deleta 1
        Pessoa.deletar_pessoa(param.to_i)
    else
        puts "Comando desconhecido: #{command}"
end