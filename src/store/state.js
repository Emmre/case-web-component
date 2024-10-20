const EMPLOYEE_STORAGE_KEY = 'employees';

export const getEmployees = () => {
  const employees = localStorage.getItem(EMPLOYEE_STORAGE_KEY);
  return employees ? JSON.parse(employees) : [];
};

export const getEmployeeById = id => {
  return new Promise(resolve => {
    let employees = getEmployees();
    const employee = employees.find(emp => emp.id === id);
    resolve(employee);
  });
};

export const saveEmployees = employees => {
  localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees));
};

export const addEmployee = employee => {
  const employees = getEmployees();
  employees.push({ ...employee, id: employees.length + 1 });
  saveEmployees(employees);
};

export const updateEmployee = updatedEmployee => {
  const employees = getEmployees();
  const index = employees.findIndex(emp => emp.id === updatedEmployee.id);
  if (index !== -1) {
    employees[index] = updatedEmployee;
    saveEmployees(employees);
  }
};

export const deleteEmployee = employeeId => {
  const employees = getEmployees();
  const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
  saveEmployees(updatedEmployees);
};
