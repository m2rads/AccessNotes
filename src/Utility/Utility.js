export const getCurrentScrollPosition = () => {
  return window.pageYOffset !== undefined
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
};
/* 
    Get the position where highlight ends after mouseup event
    Param: seleciton object
*/
export function getPositionToToolTip(selection) {
  const scrollPosition = getCurrentScrollPosition();
  let selectionRange = null;
  if (selection instanceof HTMLElement) {
    selectionRange = selection.getBoundingClientRect();
  } else {
    selectionRange = selection.getRangeAt(0).getBoundingClientRect();
  }

  let top = selectionRange.top - 250;
  let left = (selectionRange.left + selectionRange.right) / 2 + 10;
  let clientTop = top;
  let clientW = left + 200;

  // check for tooltip overflow
  // show tooltip below selection
  // if overflow with window height and width
  if (clientTop < 0) {
    top = top + 280;
  }

  if (clientW > window.innerWidth) {
    left = left - 200;
  }

  return {
    top: top + scrollPosition + "px",
    left: left + "px",
    opacity: 1,
  };
}
