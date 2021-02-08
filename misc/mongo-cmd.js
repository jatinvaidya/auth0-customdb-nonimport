// connect to your mongo DB instance using CLI and execute:
db.users.insert({ email: "john.doe@example.com", username: "johndoe_01", password: "johndoe_01", first: "John", last: "Doe" })
db.users.insert({ email: "john.doe@example.com", username: "johndoe_02", password: "johndoe_02", first: "John", last: "Doe" })
db.users.insert({ email: "john.doe@example.com", username: "johndoe_03", password: "johndoe_03", first: "John", last: "Doe" })
db.users.insert({ email: "john.doe@example.com", username: "johndoe_04", password: "johndoe_04", first: "John", last: "Doe" })
db.users.find({ email: "john.doe@example.com"})


