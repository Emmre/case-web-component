import { expect } from '@open-wc/testing';
import {
  goTo,
  getLanguage,
  setLanguage,
  getLangFromUrl,
  updateUrlLang,
} from '../../utils';
import sinon from 'sinon';
import { Router } from '@vaadin/router';

describe('Utility Functions', () => {
  beforeEach(() => {
    localStorage.clear();

    const url = new URL('http://localhost:3000/');
    Object.defineProperty(window, 'location', {
      value: url,
      writable: true,
    });

    sinon.stub(window.history, 'pushState');
    sinon.stub(window.history, 'replaceState');
  });

  afterEach(() => {
    window.history.pushState.restore();
    window.history.replaceState.restore();
  });

  describe('getLangFromUrl', () => {
    it('should return the lang parameter from the URL', () => {
      const url = new URL('http://localhost:3000/?lang=tr');
      Object.defineProperty(window, 'location', {
        value: url,
        writable: true,
      });

      expect(getLangFromUrl()).to.equal('tr');
    });

    it('should return null if no lang parameter is in the URL', () => {
      const url = new URL('http://localhost:3000/');
      Object.defineProperty(window, 'location', {
        value: url,
        writable: true,
      });

      expect(getLangFromUrl()).to.be.null;
    });
  });

  describe('updateUrlLang', () => {
    it('should update the URL with the new lang parameter', () => {
      const url = new URL('http://localhost:3000/?lang=en');
      Object.defineProperty(window, 'location', {
        value: url,
        writable: true,
      });

      updateUrlLang('fr');

      expect(window.history.replaceState.calledOnce).to.be.true;
      expect(window.history.replaceState.firstCall.args[1]).to.equal('');
      expect(window.history.replaceState.firstCall.args[2]).to.contain(
        'lang=fr'
      );
    });
  });

  describe('goTo', () => {
    it('should navigate to the specified URL with existing query parameters', () => {
      const url = new URL('http://localhost:3000/add?lang=en');
      Object.defineProperty(window, 'location', {
        value: url,
        writable: true,
      });

      const routerGoStub = sinon.stub(Router, 'go');

      goTo('/add');

      expect(routerGoStub.calledOnce).to.be.true;
      expect(routerGoStub.firstCall.args[0]).to.equal('/add/?lang=en');

      routerGoStub.restore();
    });
  });

  describe('getLanguage', () => {
    it('should return "en" if no language is set in localStorage', () => {
      expect(getLanguage()).to.equal('en');
    });

    it('should return the language set in localStorage', () => {
      setLanguage('fr');
      expect(getLanguage()).to.equal('fr');
    });
  });

  describe('setLanguage', () => {
    it('should set the language in localStorage', () => {
      setLanguage('de');
      expect(localStorage.getItem('lang')).to.equal('de');
    });
  });
});
