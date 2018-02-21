// @flow
/**
 * Mobile browsers have annoying behaviors when trying to use all available screen real-estate without any up-down scrolling.
 * There are issues with the space the Location bar takes up, as well as issues with the nav buttons some phones have on the bottom.
 * These tweaks attempt to work around those so as to make best use of screen real-estate.
 */
function mobileFixes() {
  const isMobile = navigator.userAgent.match(/android/i) || navigator.platform === 'iPhone' || navigator.platform === 'iPad';
  if (isMobile) {
    function onResize() {
      document.body.style.height = window.innerHeight + 'px';
    }
    window.addEventListener('resize', onResize);
    setTimeout(onResize, 10);
  }
}

export default mobileFixes;
