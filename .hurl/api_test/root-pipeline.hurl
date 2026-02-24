### LOGIN
POST http://localhost:3000/api/v1/login
{
	"login": "root",
	"password": "root"
}
HTTP 200
[Captures]
access: jsonpath "$['access_token']"
refresh: cookie "REFRESH_TOKEN"

### POST ACCOUNT
POST http://localhost:3000/api/v1/accounts
authorization: Bearer {{access}}
{
	"login": "test",
	"role": "manager",
	"password": "test"
}

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
GET http://localhost:3000/api/v1/accounts/test
authorization: Bearer {{access}}

### UPDATE ACCOUNT PASSWORD
POST http://localhost:3000/api/v1/changepass/test
authorization: Bearer {{access}}
{
	"old_password": "test",
	"new_password": "test2"
}
HTTP *
[Asserts]
status == 201

### CHECK TEST ACCOUNT PASSWORD
POST http://localhost:3000/api/v1/login
{
	"login": "test",
	"password": "test2"
}
HTTP *
[Asserts]
status == 200

### ME
GET http://localhost:3000/api/v1/me
authorization: Bearer {{access}}

### DELETE ACCOUNT
DELETE http://localhost:3000/api/v1/accounts/test
authorization: Bearer {{access}}

### LOGOUT
GET http://localhost:3000/api/v1/logout
authorization: Bearer {{access}}
[Cookies]
REFRESH_TOKEN: {{refresh}}
