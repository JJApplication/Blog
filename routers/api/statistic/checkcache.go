/*
Author: Landers
Github: Landers1037
Date: 2020-03
Name: blog
*/
package statistic

import (
	"net/http"

	"blog/middleware"
	"github.com/gin-gonic/gin"
)

func CheckCache(c *gin.Context) {
	name := c.Query("name")
	if name != "" {
		r := middleware.CheckCache(name)
		c.JSON(http.StatusOK, r)
	}

}
