import { html, fixture, expect } from '@open-wc/testing';
import { setLanguage, getLanguage } from './../utils/index';
import { registerTranslateConfig } from 'lit-translate';
import sinon from 'sinon';
import { EmployeeManagementApp } from '../../src/index';

const mockTranslations = {
  en: {
    title: 'Header Title',
    addEmployee: 'Add Employee',
  },
  tr: {
    title: 'Başlık',
    addEmployee: 'Çalışan Ekle',
  },
};

registerTranslateConfig({
  loader: lang => {
    return Promise.resolve(mockTranslations[lang]);
  },
});

describe('EmployeeManagementApp', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html` <employee-management-app></employee-management-app>`
    );
  });

  afterEach(() => {
    setLanguage('en');
  });

  it('should initialize with the correct language', () => {
    const lang = getLanguage();
    expect(element.lang).to.equal(lang);
  });

  it('should change language when handleLanguageChange is called', async () => {
    const newLang = 'fr';
    await element.handleLanguageChange({ detail: newLang });
    expect(element.lang).to.equal(newLang);
  });

  it('should update URL when language is changed', async () => {
    const newLang = 'de';
    await element.handleLanguageChange({ detail: newLang });
    expect(window.location.href).to.contain(`lang=${newLang}`);
  });

  it('should call setLocaleFromUrl on firstUpdated', async () => {
    const setLocaleSpy = sinon.spy(element, 'setLocaleFromUrl');
    await element.firstUpdated();
    expect(setLocaleSpy.calledOnce).to.be.true;
  });

  it('should render header-component with correct lang property', () => {
    const headerComponent =
      element.shadowRoot.querySelector('header-component');
    expect(headerComponent).to.exist;
    expect(headerComponent.lang).to.equal(element.lang);
  });
});
