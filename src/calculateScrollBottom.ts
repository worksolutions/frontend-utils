export const calculateScrollBottom = (element: HTMLElement) => {
  return element.scrollHeight - element.scrollTop - element.clientHeight;
};
