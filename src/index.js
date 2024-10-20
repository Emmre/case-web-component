import { LitElement, html } from 'lit';
import { initRouter } from './router/router.js';
import './components/Header';
import { registerTranslateConfig, use } from 'lit-translate';
import {
  getLanguage,
  setLanguage,
  getLangFromUrl,
  updateUrlLang,
} from './utils';

export class EmployeeManagementApp extends LitElement {
  static properties = {
    lang: { type: String },
  };

  constructor() {
    super();
    this.lang = getLanguage();
  }

  async firstUpdated() {
    await this.setLocaleFromUrl();
    await use(this.lang);
    initRouter();
  }

  async setLocaleFromUrl() {
    const langFromUrl = getLangFromUrl();

    if (langFromUrl) {
      this.lang = langFromUrl;
      setLanguage(langFromUrl);
    } else {
      updateUrlLang(this.lang);
    }
  }

  handleLanguageChange(event) {
    const selectedLang = event.detail;
    this.lang = selectedLang;
    use(selectedLang);
    setLanguage(selectedLang);
    updateUrlLang(selectedLang);
  }

  render() {
    return html`
      <header-component
        .lang="${this.lang}"
        @language-change="${this.handleLanguageChange}"
      ></header-component>
      <main></main>
    `;
  }
}

customElements.define('employee-management-app', EmployeeManagementApp);

registerTranslateConfig({
  loader: lang => import(`../src/i18n/${lang}.json`).then(mod => mod.default),
});
