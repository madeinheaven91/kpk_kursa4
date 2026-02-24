package errors

type ErrorResponse struct {
	Msg  string `json:"error"`
}

func NewError(msg string) ErrorResponse {
    return ErrorResponse{Msg: msg}
}
