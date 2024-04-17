$:.push './'
require 'active_record'
require_relative 'estado.rb'

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

if __FILE__ == $0
# Process command line arguments
command = ARGV[0]
if ARGV[1] != nil
    params = ARGV[1..-1].map { |arg| arg.split('=') }.to_h
end

    case command
        when 'cria' # ruby municipios.rb cria 1 "São Paulo"
            nome = params['nome'] || 'n/a'
            estado_id = params['estado'] || nil
            estado = Estado.find_by(id: estado_id)

            Municipio.criar_municipio({nome: nome, estado: estado})
        when 'lista' # ruby municipios.rb lista
            Municipio.listar_municipios.each do |municipio|
                estado = Estado.find_by(id: municipio.estado_id)
                puts "ID: #{municipio&.id}, UF: #{estado&.sigla}, Nome: #{municipio&.nome}"
            end
        when 'atualiza' # ruby municipios.rb atualiza 1 "Rio de Janeiro"
            Municipio.atualizar_municipio(params['id'], params)
        when 'deleta' # ruby municipios.rb deleta 1
            Municipio.deletar_municipio(params['id'])
        when 'help' # ruby municipios.rb help
            puts "Atributos: nome, estado"
            puts "Comandos: cria {atributos}, lista, atualiza {atributos}, deleta"
            puts "Cria: ruby municipios.rb cria nome='São Paulo' estado=1"
            puts "\t (estado deve ser um ID válido, caso contrário, será nulo)"
            puts "Lista: ruby municipios.rb lista"
            puts "Atualiza: ruby municipios.rb atualiza id=1 nome='Rio de Janeiro'"
            puts "Deleta: ruby municipios.rb deleta id=1"



        # quando for vazio, não faz nada
        when nil

        else
            puts "Comando desconhecido: #{command}"
    end
end
