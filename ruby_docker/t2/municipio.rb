require 'active_record'

ActiveRecord::Base.establish_connection :adapter => "sqlite3", :database => "Tabelas.sqlite3"

class Municipio < ActiveRecord::Base;
    belongs_to :estado
    # Create
    def self.criar_municipio(params)
        municipio = self.new(params)
        municipio.save
    end

    # Read
    def self.listar_municipios()
        self.all
    end

    # Update
    def self.atualizar_municipio(id, params)
        municipio = self.find(id)
        municipio.update(params)
    end

    # Delete
    def self.deletar_municipio(id)
        municipio = self.find(id)
        municipio.destroy
    end
end

# Process command line arguments
command = ARGV[0]
param = ARGV[1]

case command
    when 'cria' # ruby municipios.rb cria 1 "São Paulo"
        Municipio.criar_municipio({estado_id: param.to_i, nome: ARGV[2]})
    when 'lista' # ruby municipios.rb lista
        Municipio.listar_municipios.each do |municipio|
            puts "ID: #{municipio.id}, Estado ID: #{municipio.estado_id}, Nome: #{municipio.nome}"
        end
    when 'atualiza' # ruby municipios.rb atualiza 1 "Rio de Janeiro"
        Municipio.atualizar_municipio(param.to_i, {nome: ARGV[2]})
    when 'deleta' # ruby municipios.rb deleta 1
        Municipio.deletar_municipio(param.to_i)
    # quando for vazio, não faz nada
    when nil

    else
        puts "Comando desconhecido: #{command}"
end