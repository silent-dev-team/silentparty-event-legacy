package main

import (
	"log"
	"time"

	"github.com/silent-dev-team/silentparty-event/router"

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

	app.OnRecordBeforeCreateRequest("alerts").Add(ResetAlerts(app))

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

// ResetAlerts resets the active flag on alerts after 10 seconds
func ResetAlerts(app *pocketbase.PocketBase) func(e *core.RecordCreateEvent) error {
	return func(e *core.RecordCreateEvent) error {
		go func() {
			time.Sleep(10 * time.Second)
			record := e.Record
			record.Set("active", false)
			app.Dao().SaveRecord(record)
		}()
		return nil
	}
}
