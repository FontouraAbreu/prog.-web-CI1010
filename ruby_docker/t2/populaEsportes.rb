$:.push './'
require 'pessoa.rb'
require 'csv'


esportes_csv = CSV.parse(File.read('csv/esportes.csv'), headers: true)
esportes_csv.each do |row|
    esporte = Esporte.new()
    esporte.nome = row['NOME']
    esporte.save
end