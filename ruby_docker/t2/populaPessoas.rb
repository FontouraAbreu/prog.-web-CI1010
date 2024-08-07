$:.push './'
require 'pessoa.rb'
require 'estado.rb'
require 'documento.rb'
require 'csv'

 pessoas_csv = CSV.parse(File.read('csv/pessoas.csv'), headers: true)
    pessoas_csv.each do |row|
        pessoa = Pessoa.new()

        # Pessoa
        pessoa.sobrenome = row['SOBRENOME']
        pessoa.nome = row['NOME']
        pessoa.universidade = row['UNIVERSIDADE']
        
        # Estado
        estado = Estado.find_by(sigla: row['ESTADO_ID'])
        pessoa.estado = estado

        # Documento
        documento = Documento.new()
        documento.rg = row['RG']
        documento.cpf = row['CPF']
        documento.titulo_eleitor = row['TITULO_ELEITOR']
        documento.pessoa = pessoa
        documento.save

        pessoa.save
end