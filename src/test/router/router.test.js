import { expect } from '@open-wc/testing';
import { initRouter } from '../../router/router';
import '../../pages/Home';

describe('Router', () => {
  let outlet;

  beforeEach(() => {
    outlet = document.createElement('main');
    document.body.appendChild(outlet);
    initRouter();
  });

  afterEach(() => {
    document.body.removeChild(outlet);
  });

  it('should navigate to home page', async () => {
    window.history.pushState({}, '', '/');
    await new Promise(resolve => setTimeout(resolve, 0));
    const homePage = outlet.querySelector('home-page');
    expect(homePage).to.exist;
  });
});
