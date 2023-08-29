/*
   Create: 2023/8/28
   Project: BlogNext
   Github: https://github.com/landers1037
   Copyright Renj
*/

package images

import (
	"blog/config"
	"blog/logger"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// 图片托管不再依赖其他静态资源代理

func ListAllImages(c *gin.Context) {
	uploadPath := config.Cfg.APPImageRoot
	var result []struct {
		Name string `json:"name"`
		Size int64  `json:"size"`
	}
	filepath.Walk(uploadPath, func(path string, info fs.FileInfo, err error) error {
		if !info.IsDir() {
			result = append(result, struct {
				Name string `json:"name"`
				Size int64  `json:"size"`
			}{Name: info.Name(), Size: info.Size()})
		}
		return err
	})

	c.JSON(http.StatusOK, result)
	return
}

func UploadImage(c *gin.Context) {
	uploadPath := config.Cfg.APPImageRoot
	f, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusInternalServerError, "form parse error")
		return
	}
	name := formatFileName(f.Filename)
	if _, err := os.Stat(filepath.Join(uploadPath, name)); err == nil {
		c.JSON(http.StatusInternalServerError, "file is exist")
		return
	}
	file, err := f.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, "file open error")
		return
	}
	defer file.Close()
	data, err := io.ReadAll(file)
	if err != nil {
		logger.BlogLogger.ErrorF("file %s read error: %s\n", name, err.Error())
		c.JSON(http.StatusInternalServerError, "file read error")
		return
	}
	if err = os.WriteFile(filepath.Join(uploadPath, name), data, 0644); err != nil {
		logger.BlogLogger.ErrorF("file %s save error: %s\n", name, err.Error())
		c.JSON(http.StatusInternalServerError, "file save error")
		return
	}
	c.JSON(http.StatusOK, fmt.Sprintf("/images/%s", name))
}

func DeleteImage(c *gin.Context) {
	uploadPath := config.Cfg.APPImageRoot
	if c.Query("file") == "" {
		c.JSON(http.StatusInternalServerError, "file delete error")
		return
	}
	file := filepath.Join(uploadPath, c.Query("file"))
	if _, err := os.Stat(file); os.IsNotExist(err) {
		c.JSON(http.StatusInternalServerError, "file not exist")
		return
	}
	if err := os.Remove(file); err != nil {
		logger.BlogLogger.ErrorF("file %s delete error: %s\n", file, err.Error())
		c.JSON(http.StatusInternalServerError, "file delete error")
		return
	}
	c.JSON(http.StatusOK, "")
}

func CompressImage(c *gin.Context) {
}

// 去除空格转为-
// 去除/ 转为-
func formatFileName(name string) string {
	str1 := strings.TrimSpace(name)
	str2 := strings.ReplaceAll(str1, "/", "-")

	return str2
}
