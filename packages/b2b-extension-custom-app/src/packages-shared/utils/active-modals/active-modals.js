export const modalQuery = '.ReactModal__Content';

// Calculates the number of active modals. This can be used
// to determine how many levels the modal should be indented.
export default function activeModals() {
  return document.querySelectorAll(modalQuery).length;
}
