export default function debouncer(cb, delay) {
  let timerId = null;

  return function (...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => cb(...args), delay);
  };
}
