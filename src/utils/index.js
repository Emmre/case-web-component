import { Router } from '@vaadin/router';

export const goTo = url => {
  const urlParams = new URLSearchParams(window.location.search);
  Router.go(`${url}/?${urlParams}`);
};

export function getLanguage() {
  return localStorage.getItem('lang') || 'en';
}

export function setLanguage(lang) {
  localStorage.setItem('lang', lang);
}

export function getLangFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('lang');
}

export function updateUrlLang(lang) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('lang', lang);
  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}?${urlParams}`
  );
}
