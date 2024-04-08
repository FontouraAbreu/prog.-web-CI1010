class Person < ApplicationRecord
    has_one :phone
    has_many :borrowing
end
