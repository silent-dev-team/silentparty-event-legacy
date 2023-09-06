package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `[[
			{
					"id": "67o96hehef2o9rs",
					"name": "orders",
					"type": "base",
					"system": false,
					"schema": [
							{
									"id": "wlkwruys",
									"name": "sum",
									"type": "number",
									"system": false,
									"required": false,
									"options": {
											"min": null,
											"max": null
									}
							},
							{
									"id": "ecc4zyy4",
									"name": "items",
									"type": "relation",
									"system": false,
									"required": false,
									"options": {
											"collectionId": "c8t8dxvcwlmk20e",
											"cascadeDelete": false,
											"minSelect": null,
											"maxSelect": null,
											"displayFields": []
									}
							}
					],
					"indexes": [],
					"listRule": null,
					"viewRule": null,
					"createRule": "",
					"updateRule": null,
					"deleteRule": null,
					"options": {}
			},
			{
					"id": "c8t8dxvcwlmk20e",
					"name": "order_pos",
					"type": "base",
					"system": false,
					"schema": [
							{
									"id": "omimqsxi",
									"name": "name",
									"type": "text",
									"system": false,
									"required": false,
									"options": {
											"min": null,
											"max": null,
											"pattern": ""
									}
							},
							{
									"id": "1w9s78pu",
									"name": "price",
									"type": "number",
									"system": false,
									"required": false,
									"options": {
											"min": null,
											"max": null
									}
							},
							{
									"id": "tcz3v9zk",
									"name": "chip",
									"type": "bool",
									"system": false,
									"required": false,
									"options": {}
							},
							{
									"id": "cpksoykw",
									"name": "number",
									"type": "number",
									"system": false,
									"required": false,
									"options": {
											"min": null,
											"max": null
									}
							},
							{
									"id": "mxosxpap",
									"name": "sum",
									"type": "number",
									"system": false,
									"required": false,
									"options": {
											"min": null,
											"max": null
									}
							}
					],
					"indexes": [],
					"listRule": null,
					"viewRule": null,
					"createRule": "",
					"updateRule": null,
					"deleteRule": null,
					"options": {}
			},
			{
					"id": "_pb_users_auth_",
					"name": "users",
					"type": "auth",
					"system": false,
					"schema": [
							{
									"id": "users_name",
									"name": "name",
									"type": "text",
									"system": false,
									"required": false,
									"options": {
											"min": null,
											"max": null,
											"pattern": ""
									}
							},
							{
									"id": "users_avatar",
									"name": "avatar",
									"type": "file",
									"system": false,
									"required": false,
									"options": {
											"maxSelect": 1,
											"maxSize": 5242880,
											"mimeTypes": [
													"image/jpeg",
													"image/png",
													"image/svg+xml",
													"image/gif",
													"image/webp"
											],
											"thumbs": null,
											"protected": false
									}
							}
					],
					"indexes": [],
					"listRule": "id = @request.auth.id",
					"viewRule": "id = @request.auth.id",
					"createRule": "",
					"updateRule": "id = @request.auth.id",
					"deleteRule": "id = @request.auth.id",
					"options": {
							"allowEmailAuth": true,
							"allowOAuth2Auth": true,
							"allowUsernameAuth": true,
							"exceptEmailDomains": null,
							"manageRule": null,
							"minPasswordLength": 8,
							"onlyEmailDomains": null,
							"requireEmail": false
					}
			},
			{
					"id": "p80u1ur1itoh9a0",
					"name": "tags",
					"type": "base",
					"system": false,
					"schema": [
							{
									"id": "d988mkdc",
									"name": "tag",
									"type": "text",
									"system": false,
									"required": false,
									"options": {
											"min": null,
											"max": null,
											"pattern": ""
									}
							}
					],
					"indexes": [
							"CREATE INDEX 'dx_jxGrabI' ON 'tags' ('tag')"
					],
					"listRule": "",
					"viewRule": "",
					"createRule": null,
					"updateRule": null,
					"deleteRule": null,
					"options": {}
			},
			{
					"id": "cstboupfjgyje6t",
					"name": "shop_items",
					"type": "base",
					"system": false,
					"schema": [
							{
									"id": "psqublnv",
									"name": "name",
									"type": "text",
									"system": false,
									"required": false,
									"options": {
											"min": null,
											"max": null,
											"pattern": ""
									}
							},
							{
									"id": "vsudhgyk",
									"name": "price",
									"type": "number",
									"system": false,
									"required": false,
									"options": {
											"min": null,
											"max": null
									}
							},
							{
									"id": "1hijwpa6",
									"name": "reference",
									"type": "relation",
									"system": false,
									"required": false,
									"options": {
											"collectionId": "cstboupfjgyje6t",
											"cascadeDelete": false,
											"minSelect": null,
											"maxSelect": 1,
											"displayFields": []
									}
							},
							{
									"id": "fhbwvyzv",
									"name": "deposit",
									"type": "bool",
									"system": false,
									"required": false,
									"options": {}
							},
							{
									"id": "nakrsayd",
									"name": "tags",
									"type": "relation",
									"system": false,
									"required": false,
									"options": {
											"collectionId": "p80u1ur1itoh9a0",
											"cascadeDelete": false,
											"minSelect": null,
											"maxSelect": null,
											"displayFields": [
													"tag"
											]
									}
							},
							{
									"id": "crjkqshp",
									"name": "img",
									"type": "file",
									"system": false,
									"required": false,
									"options": {
											"maxSelect": 1,
											"maxSize": 5242880,
											"mimeTypes": [],
											"thumbs": [],
											"protected": false
									}
							}
					],
					"indexes": [],
					"listRule": "",
					"viewRule": "",
					"createRule": null,
					"updateRule": null,
					"deleteRule": null,
					"options": {}
			},
			{
					"id": "mjtagusuc7o6up9",
					"name": "alerts",
					"type": "base",
					"system": false,
					"schema": [
							{
									"id": "yla34s3x",
									"name": "active",
									"type": "bool",
									"system": false,
									"required": true,
									"options": {}
							},
							{
									"id": "b2bmwcvc",
									"name": "from",
									"type": "text",
									"system": false,
									"required": false,
									"options": {
											"min": null,
											"max": null,
											"pattern": ""
									}
							}
					],
					"indexes": [
							"CREATE INDEX 'idx_FqHoW1N' ON 'alerts' ('from')"
					],
					"listRule": "",
					"viewRule": "",
					"createRule": "",
					"updateRule": null,
					"deleteRule": null,
					"options": {}
			}
	]`

		collections := []*models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collections); err != nil {
			return err
		}

		return daos.New(db).ImportCollections(collections, true, nil)
	}, func(db dbx.Builder) error {
		return nil
	})
}
