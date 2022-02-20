/*
Author: Landers
Github: Landers1037
Date: 2020-03
Name: blog
*/
package article

import (
	"net/http"

	"blog/models/article"
	"github.com/gin-gonic/gin"
)

func Search(c *gin.Context) {
	str := c.Query("key")
	if str == "" {
		c.JSON(http.StatusOK, "")
	} else {
		list := article.Search(str)
		c.JSON(http.StatusOK, list)
	}
}
