import { expect, fixture, html } from '@open-wc/testing';
import { isEmailDuplicate, validateEmployee } from '../../utils/validate.js';
import { registerTranslateConfig, translate, use } from 'lit-translate';

const mockTranslations = {
  en: {
    requiredFirstName: 'First name is required',
    requiredLastName: 'Last name is required',
    requiredDateOfEmployment: 'Date of employment is required',
    futureDateOfEmployment: 'Date of employment cannot be in the future',
    requiredDateOfBirth: 'Date of birth is required',
    futureDateOfBirth: 'Date of birth cannot be in the future',
    invalidDateOrder: 'Date of birth must be before date of employment',
    invalidDateOfBirth: 'Date of birth is invalid',
    invalidPhoneNumber: 'Phone number is invalid',
    invalidEmailAddress: 'Email address is invalid',
    duplicateEmail: 'Email address is already in use',
  },
};

registerTranslateConfig({
  loader: lang => {
    return Promise.resolve(mockTranslations[lang]);
  },
});

describe('isEmailDuplicate', () => {
  beforeEach(async () => {
    await use('en');
  });
  const existingEmployees = [
    { emailAddress: 'test@example.com' },
    { emailAddress: 'duplicate@example.com' },
    { emailAddress: 'user@example.com' },
  ];

  it('should return true for a duplicate email', () => {
    const result = isEmailDuplicate('duplicate@example.com', existingEmployees);
    expect(result).to.be.true;
  });

  it('should return false for a non-duplicate email', () => {
    const result = isEmailDuplicate('unique@example.com', existingEmployees);
    expect(result).to.be.false;
  });

  it('should return false for an empty email', () => {
    const result = isEmailDuplicate('', existingEmployees);
    expect(result).to.be.false;
  });

  it('should return false for an email not in the list', () => {
    const result = isEmailDuplicate(
      'nonexistent@example.com',
      existingEmployees
    );
    expect(result).to.be.false;
  });
});

describe('validateEmployee', () => {
  const existingEmployees = [
    { emailAddress: 'test@example.com' },
    { emailAddress: 'duplicate@example.com' },
    { emailAddress: 'user@example.com' },
  ];

  it('should return an error if firstName is missing', () => {
    const employee = {
      firstName: '',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors.firstName.values[0]).to.equal('requiredFirstName');
  });

  it('should return an error if lastName is missing', () => {
    const employee = {
      firstName: 'John',
      lastName: '',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors.lastName.values[0]).to.equal('requiredLastName');
  });

  it('should return an error if dateOfEmployment is missing', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors.dateOfEmployment.values[0]).to.equal(
      'requiredDateOfEmployment'
    );
  });

  it('should return an error if dateOfEmployment is in the future', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: new Date(Date.now() + 86400000).toISOString(),
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors.dateOfEmployment.values[0]).to.equal(
      'futureDateOfEmployment'
    );
  });

  it('should return an error if dateOfBirth is missing', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '',
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors.dateOfBirth.values[0]).to.equal('requiredDateOfBirth');
  });

  it('should return an error if dateOfBirth is in the future', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: new Date(Date.now() + 86400000).toISOString(),
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors.dateOfBirth.values[0]).to.equal('futureDateOfBirth');
  });

  it('should return an error if dateOfBirth is after dateOfEmployment', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '2024-01-01',
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors.dateOfBirth.values[0]).to.equal('invalidDateOrder');
  });

  it('should return an error if phoneNumber is invalid', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '12345',
      emailAddress: 'john.doe@example.com',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors.phoneNumber.values[0]).to.equal('invalidPhoneNumber');
  });

  it('should return an error if emailAddress is invalid', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      emailAddress: 'invalid-email',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors.emailAddress.values[0]).to.equal('invalidEmailAddress');
  });

  it('should return an error if emailAddress is a duplicate', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      emailAddress: 'duplicate@example.com',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors.emailAddress.values[0]).to.equal('duplicateEmail');
  });

  it('should not return errors for a valid employee', () => {
    const employee = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '1234567890',
      emailAddress: 'john.doe@example.com',
    };
    const errors = validateEmployee(employee, false, existingEmployees);
    expect(errors).to.be.empty;
  });
});
