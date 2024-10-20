import { LitElement, html, unsafeCSS } from 'lit';
import { translate, use } from 'lit-translate';
import { goTo } from '../../utils/index.js';
import { Router } from '@vaadin/router';
import style from './index.css?inline';

export class HeaderComponent extends LitElement {
  static styles = unsafeCSS(style);
  static properties = {
    lang: { type: String },
  };

  constructor() {
    super();
  }

  firstUpdated() {
    if (this.lang) {
      use(this.lang);
    }
  }

  handleAddEmployee() {
    goTo('/add');
  }

  async handleLanguageChange(e) {
    const selectedLang = e.target.value;
    this.lang = selectedLang;
    this.dispatchEvent(
      new CustomEvent('language-change', { detail: selectedLang })
    );

    await use(selectedLang);
  }

  async goToHomepage() {
    Router.go('/');
  }

  render() {
    return html`
      <header>
        <h1 @click="${this.goToHomepage}">${translate('title')}</h1>
        <div>
          <select @change="${this.handleLanguageChange}" .value="${this.lang}">
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
          <button @click="${this.handleAddEmployee}">
            ${translate('addEmployee')}
          </button>
        </div>
      </header>
    `;
  }
}

customElements.define('header-component', HeaderComponent);
