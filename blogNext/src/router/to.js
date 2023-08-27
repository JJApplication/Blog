export default function linkTo(url) {
  if (!url || url == '') {
    window.location.href = '/'
    return
  }
  window.location.href = url
}
