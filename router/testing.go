package router

import (
	"github.com/go-playground/validator/v10"
	"github.com/kataras/iris/v12"
)

type TestingBody struct {
	Host       string `json:"host" validate:"required,hostname|ip"`
	Port       uint   `json:"port" validate:"required,numeric"`
	Username   string `json:"username" validate:"required,alphanum"`
	Password   string `json:"password" validate:"required_without=PrivateKey"`
	PrivateKey string `json:"private_key" validate:"required_without=Password,omitempty,base64"`
	Passphrase string `json:"passphrase"`
}

func (m *Router) TestingRoute(ctx iris.Context) {
	var body TestingBody
	ctx.ReadJSON(&body)
	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		ctx.JSON(iris.Map{
			"error": 1,
			"msg":   err.Error(),
		})
		return
	}
	ctx.JSON(iris.Map{"message": "Hello Iris!"})
}
