$:.push './'
require 'active_record'
require 'estado.rb'
require 'documento.rb'
require 'esportes.rb'


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
        pessoa.update({nome: nome, sobrenome: sobrenome, universidade: universidade, estado: estado, esportes: esporte, documento: documento})
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

if __FILE__ == $0
# Process command line arguments
command = ARGV[0]
if ARGV[1] != nil
    params = ARGV[1..-1].map { |arg| arg.split('=') }.to_h
end

    case command
        when 'cria' # ruby pessoas.rb cria "João"
            nomePessoa = params['nome'] || 'n/a'
            sobrenome = params['sobrenome'] || 'n/a'
            universidade = params['universidade'] || 'n/a'
            estado_id = params['estado'] || nil
            estado = Estado.find_by(sigla: estado_id)
            
            esporte = params['esportes']&.split(',')&.map { |nome| Esporte.find_by(nome:nome)} # tênis, futebol
            if esporte.nil? || esporte.empty? || esporte.include?(nil)
                for e in params['esportes']&.split(',')
                    newSport = Esporte.new(nome: e)
                    esporte.push(newSport)
                end
                puts esporte
            end

            rg = params['rg'] || 'n/a'
            cpf = params['cpf'] || 'n/a'
            titulo_eleitor = params['titulo_eleitor'] || 'n/a'
            documento = Documento.create(rg: rg, cpf: cpf, titulo_eleitor: titulo_eleitor)

            Pessoa.criar_pessoa({nome: nomePessoa, sobrenome: sobrenome, universidade: universidade, estado: estado, esportes: esporte, documento: documento})
            # update documento
            documento.update({pessoa_id: Pessoa.last.id})
            puts "Pessoa criada com sucesso!"
            puts "Nome: #{nomePessoa}, Sobrenome: #{sobrenome}, Universidade: #{universidade}, Estado: #{estado&.sigla}, RG: #{rg}, CPF: #{cpf}, Titulo de Eleitor: #{titulo_eleitor}, Esportes: #{esporte.map(&:nome).join(', ')}"
        when 'lista' # ruby pessoas.rb lista
            Pessoa.listar_pessoas.each do |pessoa|
                puts "ID: #{pessoa&.id}, Nome: #{pessoa&.nome}, Sobrenome: #{pessoa&.sobrenome}, Universidade: #{pessoa&.universidade}, Estado: #{pessoa.estado&.sigla}, RG: #{pessoa.documento&.rg}, CPF: #{pessoa.documento&.cpf}, Titulo de Eleitor: #{pessoa.documento&.titulo_eleitor}, Esportes: #{pessoa.esportes.map(&:nome).join(', ')}"
            end
        when 'atualiza' # ruby pessoas.rb atualiza 1 "José"
            pessoa = Pessoa.find(params['id'])
            nomePessoa=params['nome'] || pessoa.nome
            sobrenome=params['sobrenome'] || pessoa.sobrenome
            universidade=params['universidade'] || pessoa.universidade
            estado_id=params['estado'] || pessoa.estado_id
            estado = Estado.find_by(sigla: estado_id)
            if estado.nil?
                estado = pessoa.estado
            end

            esporte = params['esportes']&.split(',')&.map { |nome| Esporte.find_by(nome:nome)} # tênis, futebol
            # if the sport doesnt exists creates it
            if esporte.nil? || esporte.empty? || esporte.include?(nil)
                esporte = pessoa.esportes
                for e in params['esportes']&.split(',')
                    newSport = Esporte.new(nome: e)
                    esporte.push(newSport)
                end
            end

            rg=params['rg'] || pessoa.documento.rg
            cpf=params['cpf'] || pessoa.documento.cpf
            titulo_eleitor=params['titulo_eleitor'] || pessoa.documento.titulo_eleitor
            documento = Documento.create(rg: rg, cpf: cpf, titulo_eleitor: titulo_eleitor, pessoa_id: pessoa)
            pessoa.update({nome: nomePessoa, sobrenome: sobrenome, universidade: universidade, estado: estado, esportes: esporte, documento: documento})
            # update documento
            documento.update({pessoa_id: Pessoa.last.id})
        when 'deleta' # ruby pessoas.rb deleta 1
            Pessoa.deletar_pessoa(params['id'])
        when 'help' # ruby pessoas.rb help
            puts "Atributos: nome, sobrenome, universidade, estado(sigla), esportes, rg, cpf, titulo_eleitor"
            puts "Comandos disponíveis: cria {atributos}, lista, atualiza {atributos}, deleta, help"
            puts "Cria: ruby pessoas.rb cria nome=João sobrenome=Silva universidade=USP estado=SP esportes=1,2 rg=123456789 cpf=987654321 titulo_eleitor=123456789"
            puts "\t(estado e esportes devem ser IDs válidos, caso contrário, serão nulos)"
            puts "Lista: ruby pessoas.rb lista"
            puts "Atualiza: ruby pessoas.rb atualiza id=1 nome=José sobrenome=Silva"
            puts "Deleta: ruby pessoas.rb deleta id=1"
            puts "Help: mostra essa mensagem"
        # quando for vazio, não faz nada
        when nil

        else
            puts "Comando desconhecido: #{command}"
    end
end
