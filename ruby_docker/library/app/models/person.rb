class Person < ApplicationRecord
    has_one :phone
    accepts_nested_attributes_for :phone
    has_many :borrowing
end
