import { expect, fixture, html } from '@open-wc/testing';
import { get, registerTranslateConfig, use } from 'lit-translate';
import { getEmployeeById, getEmployees } from '../../store/state';
import { EmployeeForm } from '../../components/EmployeeForm';

const mockTranslations = {
  en: {
    title: 'Header Title',
    addEmployee: 'Add Employee',
    invalidEmailAddress: 'Email address is required',
  },
  tr: {
    title: 'Başlık',
    addEmployee: 'Çalışan Ekle',
    invalidEmailAddress: 'Email adresi gereklidir',
  },
};

registerTranslateConfig({
  loader: lang => Promise.resolve(mockTranslations[lang]),
});

describe('EmployeeForm', () => {
  let element;

  beforeEach(async () => {
    use('en');
    element = await fixture(
      html` <employee-form .isEdit=${false}></employee-form>`
    );
    localStorage.clear();
  });

  it('should validate inputs correctly', async () => {
    element.employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2021-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      emailAddress: '',
      department: 'Tech',
      position: 'Junior',
    };

    element.handleSubmit(new Event('submit'));
    await element.updateComplete;

    const emailError = element.errors.emailAddress;

    expect(emailError).to.exist;
    const emailErrorMessage = emailError.values.join(', ');
    const expectedMessage = get(emailErrorMessage);
    expect(expectedMessage).to.equal('Email address is required');
  });

  it('should add an employee when the form is valid', async () => {
    element.employee = {
      firstName: 'Alice',
      lastName: 'Johnson',
      dateOfEmployment: '2022-01-15',
      dateOfBirth: '1990-05-12',
      phoneNumber: '5051234567',
      emailAddress: 'alice.johnson@example.com',
      department: 'Tech',
      position: 'Junior',
    };

    const originalConfirm = window.confirm;
    window.confirm = () => true;

    const event = new Event('submit');
    element.handleSubmit(event);
    await element.updateComplete;

    const employees = getEmployees();

    const addedEmployee = employees.find(
      emp => emp.emailAddress === element.employee.emailAddress
    );

    expect(addedEmployee).to.exist;
    expect(addedEmployee.firstName).to.equal(element.employee.firstName);
    expect(addedEmployee.lastName).to.equal(element.employee.lastName);

    window.confirm = originalConfirm;
  });

  it('should populate the form with employee data when in edit mode', async () => {
    const employees = [
      {
        id: 1,
        firstName: 'Alice',
        lastName: 'Johnson',
        dateOfEmployment: '2022-01-15',
        dateOfBirth: '1990-05-12',
        phoneNumber: '5051234567',
        emailAddress: 'alice.johnson@example.com',
        department: 'Tech',
        position: 'Junior',
      },
    ];
    localStorage.setItem('employees', JSON.stringify(employees));

    const employeeId = 1;
    const urlPath = `/edit/${employeeId}`;

    window.history.pushState({}, '', urlPath);

    await element.firstUpdated();

    element.employee = await getEmployeeById(employeeId);

    expect(element.employee).to.exist;

    expect(element.employee.firstName).to.equal('Alice');
    expect(element.employee.lastName).to.equal('Johnson');
    expect(element.employee.dateOfEmployment).to.equal('2022-01-15');
    expect(element.employee.dateOfBirth).to.equal('1990-05-12');
    expect(element.employee.phoneNumber).to.equal('5051234567');
    expect(element.employee.emailAddress).to.equal('alice.johnson@example.com');
    expect(element.employee.department).to.equal('Tech');
    expect(element.employee.position).to.equal('Junior');
  });

  it('should update an employee when the form is valid', async () => {
    const employees = [
      {
        id: 1,
        firstName: 'Alice',
        lastName: 'Johnson',
        dateOfEmployment: '2022-01-15',
        dateOfBirth: '1990-05-12',
        phoneNumber: '5051234567',
        emailAddress: 'alice.johnson@example.com',
        department: 'Tech',
        position: 'Junior',
      },
    ];

    localStorage.setItem('employees', JSON.stringify(employees));

    const employeeId = 1;

    element.isEdit = true;

    await element.firstUpdated();

    element.employee = await getEmployeeById(employeeId);

    element.employee = {
      ...element.employee,
      firstName: 'Alice Updated',
      position: 'Senior',
    };

    window.confirm = () => true;

    const event = new Event('submit');
    element.handleSubmit(event);

    await element.updateComplete;

    const updatedEmployees = getEmployees();

    const updatedEmployee = updatedEmployees.find(emp => emp.id === employeeId);

    expect(updatedEmployee).to.exist;
    expect(updatedEmployee.firstName).to.equal('Alice Updated');
    expect(updatedEmployee.position).to.equal('Senior');
  });
});
