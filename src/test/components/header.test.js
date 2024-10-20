import { fixture, html } from '@open-wc/testing';
import { use, registerTranslateConfig, get } from 'lit-translate';
import sinon from 'sinon';
import { HeaderComponent } from '../../components/Header';
import { Router } from '@vaadin/router';

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

describe('HeaderComponent', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html` <header-component lang="en"></header-component>`
    );
    await use('en');
  });

  it('should change language when a new language is selected', async () => {
    const select = element.shadowRoot.querySelector('select');

    select.value = 'tr';
    select.dispatchEvent(new Event('change'));
    await element.updateComplete;

    const translatedValue = await get('addEmployee');
    expect(translatedValue).to.equal('Çalışan Ekle');
  });

  it('should navigate to /add page when the add button is clicked', async () => {
    const goToStub = sinon.stub(Router, 'go');

    const button = element.shadowRoot.querySelector('button');
    button.dispatchEvent(new Event('click'));

    expect(goToStub.calledOnce).to.be.true;
    expect(goToStub.args[0][0]).to.equal('/add/?');
    goToStub.restore();
  });
});
