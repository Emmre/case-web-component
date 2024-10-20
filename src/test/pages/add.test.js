import { html, fixture, expect } from '@open-wc/testing';
import '../../pages/Add';

describe('Add Page', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html` <add-page></add-page>`);
  });

  it('should render the EmployeeForm component', () => {
    const employeeForm = element.shadowRoot.querySelector('employee-form');
    expect(employeeForm).to.exist;
  });

  it('should pass isEdit as false to EmployeeForm', () => {
    const employeeForm = element.shadowRoot.querySelector('employee-form');
    expect(employeeForm.isEdit).to.be.false;
  });
});
