/*
   Create: 2023/12/15
   Project: BlogNext
   Github: https://github.com/landers1037
   Copyright Renj
*/

package cmd

import (
	"blog/models"
	"fmt"
	"github.com/urfave/cli/v2"
)

// 数据库迁移

func AddMigrateCmds() []*cli.Command {
	return []*cli.Command{
		{
			Name:         "db",
			Aliases:      []string{"db", "database"},
			Usage:        "应用配置",
			Category:     "Database Migrate",
			Action:       nil,
			OnUsageError: nil,
			Subcommands: []*cli.Command{
				{
					// 文章BlogPost适配lock字段
					Name:     "addlock",
					Usage:    "新增文章lock字段",
					Category: "Database",
					Action: func(c *cli.Context) error {
						models.InitDB()
						fmt.Println("database init")
						// 通过原始sql直接增加列
						if err := models.BlogDB.Raw("ALTER TABLE db_blog_post ADD COLUMN lock INTEGER DEFAULT 0").Error; err != nil {
							fmt.Printf("lock update error: %s\n", err.Error())
						}
						fmt.Println("done")
						return nil
					},
				},
				{
					Name:     "init",
					Usage:    "初始化数据库",
					Category: "Database",
					Action: func(c *cli.Context) error {
						models.InitDB()
						fmt.Println("database init")
						return nil
					},
				},
			},
		},
	}
}
