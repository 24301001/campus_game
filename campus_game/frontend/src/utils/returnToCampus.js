export function returnToCampus() {
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'campus-platform-exit' }, window.location.origin)
  } else {
    window.location.assign('/')
  }
}
