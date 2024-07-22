# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_07_22_003713) do
  create_table "documentos", force: :cascade do |t|
    t.string "rg"
    t.string "cpf"
    t.string "titulo_eleitor"
    t.integer "pessoa_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["pessoa_id"], name: "index_documentos_on_pessoa_id"
  end

  create_table "esportes", force: :cascade do |t|
    t.string "nome"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "esportes_pessoas", id: false, force: :cascade do |t|
    t.integer "esporte_id", null: false
    t.integer "pessoa_id", null: false
  end

  create_table "estados", force: :cascade do |t|
    t.string "nome"
    t.string "sigla", limit: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "municipios", force: :cascade do |t|
    t.string "nome"
    t.integer "estado_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["estado_id"], name: "index_municipios_on_estado_id"
  end

  create_table "pessoas", force: :cascade do |t|
    t.string "nome"
    t.string "sobrenome"
    t.string "universidade"
    t.integer "estado_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["estado_id"], name: "index_pessoas_on_estado_id"
  end

  add_foreign_key "documentos", "pessoas"
  add_foreign_key "municipios", "estados"
  add_foreign_key "pessoas", "estados"
end
