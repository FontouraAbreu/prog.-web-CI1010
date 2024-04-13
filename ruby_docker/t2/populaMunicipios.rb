$:.push './'
require 'municipio.rb'
require 'estado.rb'
require 'csv'


estados = Estado.all
municipios_csv = CSV.parse(File.read('csv/municipios.csv'), headers: true)
municipios_csv.each do |row|
    municipio = Municipio.new()
    municipio.nome = row['NOME']
    # encontra o estado pelo codigo
    estado = estados.find_by(codigo_uf: row['COD_UF'])
    municipio.estado = estado
    municipio.save
end