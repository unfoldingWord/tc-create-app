export const onHeadroomPin = () => {
  const el = document.querySelector('#translatableComponent div div[role=\'toolbar\']');

  if (el) {
    el.style.top = '64px';
  }
};

export const onHeadroomUnfix = () => {
  const el = document.querySelector('#translatableComponent div div[role=\'toolbar\']');

  if (el) {
    el.style.top = '0px';
  }
};

export const onHeadroomUnpin = () => {
  const el = document.querySelector('#translatableComponent div div[role=\'toolbar\']');

  if (el) {
    el.style.top = '0px';
  }
};
