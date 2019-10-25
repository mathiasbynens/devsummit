// No event target constructor in Safari.
const eventTarget = new MessageChannel().port1;
const eventName = 'timezone-change';

let timezoneOption = localStorage.timezoneOption || 'venue';

export function get() {
  return timezoneOption;
}

export function set(newVal) {
  if (timezoneOption === newVal) return;
  timezoneOption = localStorage.timezoneOption = newVal;
  eventTarget.dispatchEvent(new Event(eventName));
}

export function onChange(func) {
  eventTarget.addEventListener(eventName, func);
}

export let localOffset = new Date().getTimezoneOffset() * 60 * 1000 * -1;

(() => {
  if ('ontimezonechange' in window) return;
  const timeout = 250; // Poll every `timeout` ms.
  const date = new Date();
  let previous = date.toString();
  const poll = () => {
    const current = date.toString();
    if (current !== previous) {
      previous = current;
      const event = new Event('timezonechange');
      window.dispatchEvent(event);
    }
  };
  let interval = setInterval(poll, timeout);
  document.addEventListener('visibilitychange', (event) => {
    if (document.hidden) {
      clearInterval(interval);
    } else {
      interval = setInterval(poll, timeout);
    }
  });
})();

window.addEventListener('timezonechange', () => {
  localOffset = new Date().getTimezoneOffset() * 60 * 1000 * -1;
});

window.addEventListener('storage', () => {
  set(localStorage.timezoneOption);
});
