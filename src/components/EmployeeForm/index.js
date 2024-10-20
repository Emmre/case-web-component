import { LitElement, html, unsafeCSS } from 'lit';
import {
  getEmployeeById,
  addEmployee,
  updateEmployee,
} from '../../store/state';
import { Router } from '@vaadin/router';
import style from './index.css?inline';
import { get, translate } from 'lit-translate';
import { validateEmployee } from '../../utils/validate';

export class EmployeeForm extends LitElement {
  static styles = unsafeCSS(style);
  static properties = {
    isEdit: { type: Boolean },
    employee: { type: Object },
  };

  constructor() {
    super();
    this.employeeId = null;
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      emailAddress: '',
      department: 'Tech',
      position: 'Junior',
    };
    this.errors = {};
  }

  async firstUpdated() {
    const urlParts = window.location.pathname.split('/');
    this.employeeId = Number(urlParts[urlParts.length - 1]);

    if (this.isEdit && this.employeeId) {
      this.employee = await getEmployeeById(this.employeeId);
    }
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.employee = { ...this.employee, [name]: value };
    if (this.errors[name]) {
      delete this.errors[name];
    }
  }

  validateForm() {
    const existingEmployees =
      JSON.parse(localStorage.getItem('employees')) || [];
    this.errors = validateEmployee(
      this.employee,
      this.isEdit,
      existingEmployees
    );

    return Object.keys(this.errors).length === 0;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      this.requestUpdate();
      return;
    }

    const confirmationText = this.isEdit ? 'confirmUpdate' : 'confirmAdd';
    const confirmation = confirm(get(confirmationText));

    if (confirmation) {
      if (this.isEdit) {
        updateEmployee({ ...this.employee, id: this.employeeId });
      } else {
        addEmployee(this.employee);
      }

      const event = new CustomEvent('employee-added', {
        detail: { employee: this.employee },
      });
      this.dispatchEvent(event);
      Router.go('/');
    }
  }

  renderInput(name, type = 'text') {
    return html`
      <label for="${name}">${translate(name)}</label>
      <input
        type="${type}"
        id="${name}"
        name="${name}"
        .value="${this.employee[name]}"
        @input="${this.handleInputChange}"
        class="${this.errors[name] ? 'error' : ''}"
      />
      ${this.errors[name]
        ? html` <div class="error">${this.errors[name]}</div>`
        : ''}
    `;
  }

  render() {
    return html`
      <h2>
        ${this.isEdit ? translate('editEmployee') : translate('addEmployee')}
      </h2>
      <form @submit="${this.handleSubmit}">
        ${this.renderInput('firstName')} ${this.renderInput('lastName')}
        ${this.renderInput('dateOfEmployment', 'date')}
        ${this.renderInput('dateOfBirth', 'date')}
        ${this.renderInput('phoneNumber', 'tel')}
        ${this.renderInput('emailAddress', 'email')}

        <label for="department">${translate('department')}</label>
        <select
          id="department"
          name="department"
          .value="${this.employee.department}"
          @change="${this.handleInputChange}"
        >
          <option value="Tech">${translate('tech')}</option>
          <option value="Analytics">${translate('analytics')}</option>
        </select>

        <label for="position">${translate('position')}</label>
        <select
          id="position"
          name="position"
          .value="${this.employee.position}"
          @change="${this.handleInputChange}"
        >
          <option value="Junior">${translate('junior')}</option>
          <option value="Medior">${translate('medior')}</option>
          <option value="Senior">${translate('senior')}</option>
        </select>

        <button type="submit">
          ${this.isEdit ? translate('editEmployee') : translate('addEmployee')}
        </button>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
