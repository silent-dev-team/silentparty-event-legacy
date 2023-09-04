package main

import (
	"log"
	"os"
	"strings"

	"github.com/silent-dev-team/silentparty-event/router"

	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	_ "github.com/silent-dev-team/silentparty-event/migrations"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	router := &router.Handler{PB: app}

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/api/collections/:collection/count", router.CountCollection)
		return nil
	})

	// loosely check if it was executed using "go run"
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
