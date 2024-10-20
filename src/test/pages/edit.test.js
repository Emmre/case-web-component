import { html, fixture, expect } from '@open-wc/testing';
import '../../pages/Edit';

describe('Edit Page', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html` <edit-page></edit-page>`);
  });

  it('should render the EmployeeForm component', () => {
    const employeeForm = element.shadowRoot.querySelector('employee-form');
    expect(employeeForm).to.exist;
  });

  it('should pass isEdit as true to EmployeeForm', () => {
    const employeeForm = element.shadowRoot.querySelector('employee-form');
    expect(employeeForm.isEdit).to.be.true;
  });
});
