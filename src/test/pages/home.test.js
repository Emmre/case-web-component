import { html, fixture, expect } from '@open-wc/testing';
import '../../pages/Home';

describe('Home Page', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html` <home-page></home-page>`);
  });

  it('should render the EmployeeList component', () => {
    const employeeList = element.shadowRoot.querySelector('employee-list');
    expect(employeeList).to.exist;
  });
});
