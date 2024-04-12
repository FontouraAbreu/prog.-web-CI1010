$:.push './'
require 'estado.rb'
require 'csv'

 # Método 3
 estados_csv = CSV.parse(File.read('csv/estados.csv'), headers: true)
    estados_csv.each do |row|
        estado = Estado.new()
        estado.nome = row['NOME']
        estado.sigla = row['SIGLA']
        estado.save
end