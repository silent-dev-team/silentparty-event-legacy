package migrations

import (
	"github.com/silent-dev-team/silentparty-event/utils"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db)

		admin := &models.Admin{}
		admin.Email = utils.Getenv("ADMIN_EMAIL")
		admin.SetPassword(utils.Getenv("ADMIN_PASSWORD"))

		return dao.SaveAdmin(admin)
	}, func(db dbx.Builder) error { // optional revert operation

		dao := daos.New(db)

		admin, _ := dao.FindAdminByEmail("test@example.com")
		if admin != nil {
			return dao.DeleteAdmin(admin)
		}

		// already deleted
		return nil
	})
}
