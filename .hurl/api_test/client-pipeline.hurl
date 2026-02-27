### LOGIN
POST http://localhost:3000/api/v1/login
{
	"login": "root",
	"password": "root"
}
HTTP 200
[Captures]
admin_access: jsonpath "$['access_token']"
refresh: cookie "REFRESH_TOKEN"

### POST CLIENT
POST http://localhost:3000/api/v1/clients
authorization: Bearer {{admin_access}}
{
    "name": "test",
	"phone": "880005553535"
}
HTTP *
[Asserts]
status == 201
[Captures]
client_id: jsonpath "$['id']"

### GET CLIENT
GET http://localhost:3000/api/v1/clients/{{client_id}}
authorization: Bearer {{admin_access}}
HTTP *
[Asserts]
jsonpath "$['name']" == "test"
jsonpath "$['phone']" == "880005553535"

### UPDATE CLIENT
PUT http://localhost:3000/api/v1/clients/{{client_id}}
authorization: Bearer {{admin_access}}
{
    "name": "test_updated"
}
HTTP *
[Asserts]
status == 204

### GET UPDATED CLIENT
GET http://localhost:3000/api/v1/clients/{{client_id}}
authorization: Bearer {{admin_access}}
HTTP *
[Asserts]
jsonpath "$['name']" == "test_updated"
jsonpath "$['phone']" == "880005553535"

### GET CLIENTS
GET http://localhost:3000/api/v1/clients
authorization: Bearer {{admin_access}}
HTTP *
[Asserts]
status == 200

### DELETE CLIENT
DELETE http://localhost:3000/api/v1/clients/{{client_id}}
authorization: Bearer {{admin_access}}
HTTP *
[Asserts]
status == 204

### LOGOUT
GET http://localhost:3000/api/v1/logout
authorization: Bearer {{admin_access}}
[Cookies]
REFRESH_TOKEN: {{refresh}}
