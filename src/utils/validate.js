import { translate } from 'lit-translate';

export const isEmailDuplicate = (email, existingEmployees) => {
  return existingEmployees.some(emp => emp.emailAddress === email);
};

const validateRequiredField = (fieldValue, fieldName, errors) => {
  if (!fieldValue) {
    errors[fieldName] = translate(
      `required${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`
    );
  }
};

const validateDate = (date, today, employmentDate, errors) => {
  const birthDate = new Date(date);

  if (birthDate > today) {
    errors.dateOfBirth = translate('futureDateOfBirth');
  } else if (birthDate >= employmentDate) {
    errors.dateOfBirth = translate('invalidDateOrder');
  } else if (birthDate < today.getFullYear() - 100) {
    errors.dateOfBirth = translate('invalidDateOfBirth');
  }
};

export const validateEmployee = (employee, isEdit, existingEmployees) => {
  const errors = {};
  const today = new Date();
  const employmentDate = new Date(employee.dateOfEmployment);

  validateRequiredField(employee.firstName, 'firstName', errors);
  validateRequiredField(employee.lastName, 'lastName', errors);
  validateRequiredField(employee.dateOfEmployment, 'dateOfEmployment', errors);
  validateRequiredField(employee.dateOfBirth, 'dateOfBirth', errors);

  if (
    employee.dateOfEmployment &&
    new Date(employee.dateOfEmployment) > today
  ) {
    errors.dateOfEmployment = translate('futureDateOfEmployment');
  }

  if (employee.dateOfBirth) {
    validateDate(employee.dateOfBirth, today, employmentDate, errors);
  }

  if (!employee.phoneNumber.match(/^\d{10}$/)) {
    errors.phoneNumber = translate('invalidPhoneNumber');
  }

  if (!employee.emailAddress.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.emailAddress = translate('invalidEmailAddress');
  }

  if (!isEdit && isEmailDuplicate(employee.emailAddress, existingEmployees)) {
    errors.emailAddress = translate('duplicateEmail');
  }

  return errors;
};
