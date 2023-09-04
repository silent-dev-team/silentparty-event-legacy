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
		jsonData := `[
			{
				"id": "_pb_users_auth_",
				"created": "2023-09-04 15:47:58.664Z",
				"updated": "2023-09-04 16:01:23.040Z",
				"name": "users",
				"type": "auth",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "users_name",
						"name": "name",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "users_avatar",
						"name": "avatar",
						"type": "file",
						"required": false,
						"unique": false,
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
				"id": "cstboupfjgyje6t",
				"created": "2023-09-04 16:01:23.040Z",
				"updated": "2023-09-04 16:01:23.040Z",
				"name": "shop_items",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "psqublnv",
						"name": "name",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "vsudhgyk",
						"name": "price",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "mh9vgrjt",
						"name": "reference",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "fhbwvyzv",
						"name": "deposit",
						"type": "bool",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "qb9s8qoi",
						"name": "img",
						"type": "url",
						"required": false,
						"unique": false,
						"options": {
							"exceptDomains": null,
							"onlyDomains": null
						}
					},
					{
						"system": false,
						"id": "nakrsayd",
						"name": "tags",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "p80u1ur1itoh9a0",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": null,
							"displayFields": []
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
				"id": "p80u1ur1itoh9a0",
				"created": "2023-09-04 16:01:23.040Z",
				"updated": "2023-09-04 16:01:23.040Z",
				"name": "tags",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "d988mkdc",
						"name": "tag",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
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
				"id": "67o96hehef2o9rs",
				"created": "2023-09-04 16:01:23.041Z",
				"updated": "2023-09-04 16:01:23.041Z",
				"name": "orders",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "wlkwruys",
						"name": "sum",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "ecc4zyy4",
						"name": "items",
						"type": "relation",
						"required": false,
						"unique": false,
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
				"created": "2023-09-04 16:01:23.041Z",
				"updated": "2023-09-04 16:01:23.041Z",
				"name": "order_pos",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "omimqsxi",
						"name": "name",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "1w9s78pu",
						"name": "price",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "tcz3v9zk",
						"name": "chip",
						"type": "bool",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "cpksoykw",
						"name": "number",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "mxosxpap",
						"name": "sum",
						"type": "number",
						"required": false,
						"unique": false,
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
