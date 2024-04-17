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
        when 'lista' # ruby estados.rb lista
            Estado.listar_estados.each do |estado|
                puts "ID: #{estado&.id}, Nome: #{estado&.nome}, Sigla: #{estado&.sigla}, Código UF: #{estado&.codigo_uf}"
            end
        when 'atualiza' # ruby estados.rb atualiza 1 "Rio de Janeiro"
            Estado.atualizar_estado(params['id'], params)
        when 'deleta' # ruby estados.rb deleta 1
            Estado.deletar_estado(params['id'])
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