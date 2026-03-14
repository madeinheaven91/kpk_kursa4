### LOGIN
POST http://localhost:3000/api/v1/login
{
	"login": "root",
	"password": "root"
}
HTTP 200
[Captures]
access: cookie "ACCESS_TOKEN"
refresh: cookie "REFRESH_TOKEN"

### POST ACCOUNT
POST http://localhost:3000/api/v1/accounts
authorization: Bearer {{access}}
{
	"login": "john",
	"role": "manager",
	"password": "test"
}
HTTP * 
[Asserts]
status == 201

### POST ADMIN ACCOUNT
POST http://localhost:3000/api/v1/accounts
authorization: Bearer {{access}}
{
	"login": "test",
	"role": "admin",
	"password": "test"
}
HTTP * 
[Asserts]
status == 403

### POST INVALID ACCOUNT
POST http://localhost:3000/api/v1/accounts
authorization: Bearer {{access}}
{
	"role": "manager"
}
HTTP * 
[Asserts]
status == 401

### GET ACCOUNTS
GET http://localhost:3000/api/v1/accounts
authorization: Bearer {{access}}

### GET TEST ACCOUNT
GET http://localhost:3000/api/v1/accounts/john
authorization: Bearer {{access}}

### UPDATE ACCOUNT PASSWORD
POST http://localhost:3000/api/v1/changepass/john
authorization: Bearer {{access}}
{
	"old_password": "test",
	"new_password": "test2"
}
HTTP *
[Asserts]
status == 201

### CHECK JOHN ACCOUNT PASSWORD
POST http://localhost:3000/api/v1/login
{
	"login": "john",
	"password": "test2"
}
HTTP *
[Asserts]
status == 200
[Captures]
refresh_john: cookie "REFRESH_TOKEN"

### LOGOUT JOHN
GET http://localhost:3000/api/v1/logout
authorization: Bearer {{access}}
[Cookies]
REFRESH_TOKEN: {{refresh_john}}

### ME
GET http://localhost:3000/api/v1/me
authorization: Bearer {{access}}

### DELETE ACCOUNT
DELETE http://localhost:3000/api/v1/accounts/john
authorization: Bearer {{access}}

### LOGOUT
GET http://localhost:3000/api/v1/logout
authorization: Bearer {{access}}
[Cookies]
REFRESH_TOKEN: {{refresh}}
