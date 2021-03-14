/*
landers Apps
Author: landers
Github: github.com/landers1037
*/

package response

// 专用于响应的结构体
type RES_POST struct {
	Name string `json:"name"`
	Title string `json:"title"`
	Date string `json:"date"`
	Abstract string `json:"abstract"`
}

// 文章详情
type RES_POST_MORE struct {
	Name string `json:"name"`
	Title string `json:"title"`
	Date string `json:"date"`
	Abstract string `json:"abstract"`
	Content string `json:"content"`
	Tags string `json:"tags"`
	Categories string `json:"categories"`
}