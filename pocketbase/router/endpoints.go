package router

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
)

type Handler struct {
	PB *pocketbase.PocketBase
}

func (h *Handler) CountCollection(c echo.Context) error {
	collection := c.PathParam("collection")

	var count int

	h.PB.DB().Select("count(*)").From(collection).Row(&count)
	return c.JSON(http.StatusOK, map[string]int{"count": count})
}
