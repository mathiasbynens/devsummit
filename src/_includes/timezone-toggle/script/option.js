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

window.addEventListener('timezonechange', () => {
  localOffset = new Date().getTimezoneOffset() * 60 * 1000 * -1;
});

window.addEventListener('storage', () => {
  set(localStorage.timezoneOption);
});
