/*
Author: Landers
Github: Landers1037
Date: 2020-03
Name: blog
*/
package article

import (
	"net/http"

	"blog/models/dao/post_dao"
	"github.com/gin-gonic/gin"
)

func GetBrother(c *gin.Context) {
	name := c.Query("name")
	p, n := post_dao.GetBrother(name)
	var data = []string{p, n}
	c.JSON(http.StatusOK, data)
}
