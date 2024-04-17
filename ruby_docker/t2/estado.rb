require 'active_record'

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
    def self.deletar_estado(codigo_uf)
        estado = self.find(codigo_uf)
        # Update pessoas
        pessoas = Pessoa.find_by(codigo_uf: codigo_uf)
        pessoas.each do |pessoa|
            pessoa.estado = nil
            pessoa.save
        end
        # Update municipios
        municipios = Municipio.find_by(codigo_uf: codigo_uf)
        municipios.each do |municipio|
            municipio.estado = nil
            municipio.save
        end
        estado.destroy
    end
end

# Process command line arguments
command = ARGV[0]
if ARGV[1] != nil
    param = ARGV[1]
end

if __FILE__ == $0
    case command
        when 'cria' # ruby estados.rb cria "São Paulo"
            Estado.criar_estado({nome: param})
        when 'lista' # ruby estados.rb lista
            Estado.listar_estados.each do |estado|
                puts "ID: #{estado.id}, Nome: #{estado.nome}, Sigla: #{estado.sigla}"
            end
        when 'atualiza' # ruby estados.rb atualiza 1 "Rio de Janeiro"
            Estado.atualizar_estado(param.to_i, {nome: ARGV[2]})
        when 'deleta' # ruby estados.rb deleta 1
            Estado.deletar_estado(param.to_i)
        # quando for vazio, não faz nada
        when nil

        else
            puts "Comando desconhecido: #{command}"
    end
end