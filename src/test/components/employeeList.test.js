import { fixture, html } from '@open-wc/testing';
import { getEmployees, saveEmployees, deleteEmployee } from '../../store/state';
import { EmployeeList } from '../../components/EmployeeList';

describe('EmployeeList', () => {
  let element;

  beforeEach(async () => {
    localStorage.clear();

    element = await fixture(html` <employee-list></employee-list>`);
  });

  it('should display the list view when "list" mode is selected', async () => {
    element.changeViewMode('list');
    await element.updateComplete;
    const listView = element.shadowRoot.querySelector('employee-list-view');
    const tableView = element.shadowRoot.querySelector('employee-table-view');
    expect(listView).to.exist;
    expect(tableView).to.not.exist;
  });

  it('should display the table view when "table" mode is selected', async () => {
    element.changeViewMode('table');
    await element.updateComplete;
    const listView = element.shadowRoot.querySelector('employee-list-view');
    const tableView = element.shadowRoot.querySelector('employee-table-view');
    expect(tableView).to.exist;
    expect(listView).to.not.exist;
  });

  it('should delete an employee from localStorage', () => {
    const mockEmployees = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Doe' },
    ];
    saveEmployees(mockEmployees);

    deleteEmployee(1);

    const employees = getEmployees();
    expect(employees).to.deep.equal([
      { id: 2, firstName: 'Jane', lastName: 'Doe' },
    ]);
  });

  it('should return an empty array when there are no employees', () => {
    const employees = getEmployees();
    expect(employees).to.deep.equal([]);
  });

  it('should return employees from localStorage', () => {
    const mockEmployees = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Doe' },
    ];
    saveEmployees(mockEmployees);
    const employees = getEmployees();
    expect(employees).to.deep.equal(mockEmployees);
  });

  it('should filter employees based on the search term', async () => {
    const mockEmployees = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Doe' },
      { id: 3, firstName: 'Jim', lastName: 'Beam' },
    ];
    saveEmployees(mockEmployees);
    element.loadEmployees();

    element.updateSearchTerm({ target: { value: 'Jane' } });
    await element.updateComplete;

    const filteredEmployees = element.filteredEmployees;
    expect(filteredEmployees).to.have.lengthOf(1);
    expect(filteredEmployees[0].firstName).to.equal('Jane');
  });
});
