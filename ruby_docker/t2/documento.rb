$:.push './'
require 'active_record'
require_relative 'pessoa.rb'


ActiveRecord::Base.establish_connection :adapter => "sqlite3", :database => "Tabelas.sqlite3"

class Documento < ActiveRecord::Base;
    belongs_to :pessoa

    # Create
    def self.criar_documento(params)
        documento = self.new(params)
        documento.save
    end

    # Read
    def self.listar_documentos()
        self.all
    end

    # Update
    def self.atualizar_documento(params)
        documento = self.find(params['id'])
        documento.update(params)
    end

    # Delete
    def self.deletar_documento(id)
        documento = self.find(id)
        # Update pessoa
        pessoa = documento.pessoa
        pessoa.documento.destroy
        pessoa.save
        documento.destroy
    end
end

if __FILE__ == $0
# Process command line arguments
command = ARGV[0]
if ARGV[1] != nil
    param = ARGV[1..-1].map { |arg| arg.split('=') }.to_h
end

    case command
        when 'cria' # ruby documentos.rb cria 1 "123456789"

            Documento.criar_documento(params)
        when 'lista' # ruby documentos.rb lista
            Documento.listar_documentos.each do |documento|
                pessoa = Pessoa.find_by(id: documento.pessoa_id)
                puts "ID: #{documento&.id}, Pessoa ID: #{pessoa&.nome}, RG: #{documento&.rg}, CPF: #{documento&.cpf}, Titulo de Eleitor: #{documento&.titulo_eleitor}"
            end
        when 'atualiza' # ruby documentos.rb atualiza 1 "987654321"
            Documento.atualizar_documento(params)
        when 'deleta' # ruby documentos.rb deleta 1
            Documento.deletar_documento(params['id'])
        when 'help' # ruby documentos.rb help
            puts "Atributos: rg, cpf, titulo_eleitor"
            puts "Comandos: cria {atributos}, lista, atualiza {atributos}, deleta"
            puts "Cria: ruby documentos.rb cria rg='123456789' cpf='987654321' titulo_eleitor='123456789'"
            puts "Atualiza: ruby documentos.rb atualiza 1 rg='987654321'"
            puts "Deleta: ruby documentos.rb deleta 1"
        # quando for vazio, não faz nada
        when nil

        else
            puts "Comando desconhecido: #{command}"
    end
end