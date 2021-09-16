/** this is svelte-action that can be used for popups etc. to track the outside click */
export function clickOutside(node) {
  
  const handleClick = event => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent('clickOutside', { detail: { target: event.target, node } })
      )
    }
  }
  
  document.addEventListener('click', handleClick, true);
  
  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  }
}
