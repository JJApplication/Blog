/*
Author: Landers
Github: Landers1037
Date: 2020-03
Name: blog
*/
package statistic

import (
	"net/http"

	"blog/models/dao/statistics_dao"
	"github.com/gin-gonic/gin"
)

func GetDaily(c *gin.Context) {
	count := statistics_dao.StatisticDailyQuery()
	c.JSON(http.StatusOK, count)
}
