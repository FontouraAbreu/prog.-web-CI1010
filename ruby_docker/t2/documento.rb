require 'active_record'
require 'pessoa.rb'

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
    def self.atualizar_documento(id, params)
        documento = self.find(id)
        documento.update(params)
    end

    # Delete
    def self.deletar_documento(id)
        documento = self.find(id)
        # Update pessoa
        pessoa = documento.pessoa
        pessoa.documento = nil
        pessoa.save
        documento.destroy
    end
end

# Process command line arguments
command = ARGV[0]
param = ARGV[1]

case command
    when 'cria' # ruby documentos.rb cria 1 "123456789"
        Documento.criar_documento({pessoa_id: param.to_i, numero: ARGV[2]})
    when 'lista' # ruby documentos.rb lista
        Documento.listar_documentos.each do |documento|
            puts "ID: #{documento.id}, Pessoa ID: #{documento.pessoa_id}, Número: #{documento.numero}"
        end
    when 'atualiza' # ruby documentos.rb atualiza 1 "987654321"
        Documento.atualizar_documento(param.to_i, {numero: ARGV[2]})
    when 'deleta' # ruby documentos.rb deleta 1
        Documento.deletar_documento(param.to_i)
    # quando for vazio, não faz nada
    when nil
        
    else
        puts "Comando desconhecido: #{command}"
end