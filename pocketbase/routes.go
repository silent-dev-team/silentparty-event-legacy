package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
)

type CollectionName string
type boolMap map[string]bool

func CustomRoutes(app *pocketbase.PocketBase) []echo.Route {
	emptyMiddlewares := []echo.MiddlewareFunc{}

	routes := []echo.Route{
		{
			Method: http.MethodGet,
			Path:   "/api/ping",
			Handler: func(c echo.Context) error {
				respone := boolMap{"ping": true}
				return c.JSON(http.StatusOK, respone)
			},
			Middlewares: emptyMiddlewares,
		},
		{
			Method: http.MethodPut,
			Path:   "/api/alert",
			Handler: func(c echo.Context) error {
				respone := boolMap{"alert": true}
				//TODO: send alert to see channel
				return c.JSON(http.StatusOK, respone)
			},
			Middlewares: emptyMiddlewares,
		},
	}

	routes = append(routes, countRounte(app, "orders"))

	for _, route := range routes {
		route.Middlewares = append(route.Middlewares, apis.ActivityLogger(app))
	}
	fmt.Println("routes", routes)
	return routes
}

func countRounte(app *pocketbase.PocketBase, cn CollectionName) echo.Route {
	return echo.Route{
		Method: http.MethodGet,
		Path:   fmt.Sprintf("/api/collections/%s/count", cn),
		Handler: func(c echo.Context) error {
			count := 0
			app.DB().Select("count(*)").From(fmt.Sprint(cn)).Row(&count)
			return c.JSON(http.StatusOK, map[string]int{"count": count})
		},
		Middlewares: []echo.MiddlewareFunc{},
	}
}
