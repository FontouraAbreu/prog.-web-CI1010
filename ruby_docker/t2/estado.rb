require 'active_record'

ActiveRecord::Base.establish_connection:adapter => 'sqlite3', :database => 'Tabelas.sqlite3'

# Ative record will pluralize the class name to find the table name
class Estado < ActiveRecord::Base

end