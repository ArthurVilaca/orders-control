# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

c = Client.create(name: "Miojo", email: 'miojo@todoscomem.com')
p = Product.create(name: "Galaxy S8", description:"smartphone")
Order.create( products: [p], client: c, total: 120.50, instalments: 2, status: 0 )
