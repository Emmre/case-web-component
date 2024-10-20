import { LitElement, html, unsafeCSS } from 'lit';
import { getEmployees, deleteEmployee } from '../../store/state';
import { Router } from '@vaadin/router';
import { get, translate } from 'lit-translate';
import style from './index.css?inline';
import './ListView';
import './TableView';

export class EmployeeList extends LitElement {
  static styles = unsafeCSS(style);
  static properties = {
    employees: { type: Array },
    viewMode: { type: String },
    searchTerm: { type: String },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
  };

  constructor() {
    super();
    this.employees = [];
    this.viewMode = 'table';
    this.searchTerm = '';
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.loadEmployees();
  }

  loadEmployees() {
    this.employees = getEmployees();
  }

  get filteredEmployees() {
    const searchTerm = this.searchTerm.trim().toLocaleUpperCase('tr-TR');
    return this.employees.filter(employee => {
      const firstName = employee.firstName.toLocaleUpperCase('tr-TR');
      const lastName = employee.lastName.toLocaleUpperCase('tr-TR');
      return firstName.includes(searchTerm) || lastName.includes(searchTerm);
    });
  }


  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return this.filteredEmployees.slice(start, end);
  }

  updateSearchTerm(e) {
    this.currentPage = 1;
    this.searchTerm = e.target.value;
  }

  changeViewMode(mode) {
    this.viewMode = mode;
  }

  changePage(pageNumber) {
    this.currentPage = pageNumber;
  }

  editEmployee(employee) {
    Router.go(`/edit/${employee.id}`);
  }

  deleteEmployee(employee) {
    if (
      confirm(
        get('confirmDelete', {
          firstName: employee.firstName,
          lastName: employee.lastName,
        }),
      )
    ) {
      deleteEmployee(employee.id);
      this.loadEmployees();
    }
  }

  render() {
    return html`
      <div class="controls">
        <input
          type="text"
          placeholder=${translate('search')}
          @input="${this.updateSearchTerm}"
        />
        <button @click="${() => this.changeViewMode('list')}">
          ${translate('listView')}
        </button>
        <button @click="${() => this.changeViewMode('table')}">
          ${translate('tableView')}
        </button>
      </div>

      ${this.viewMode === 'list'
        ? html`
          <employee-list-view
            .employees="${this.paginatedEmployees}"
            .editEmployee="${this.editEmployee.bind(this)}"
            .deleteEmployee="${this.deleteEmployee.bind(this)}"
          ></employee-list-view>`
        : html`
          <employee-table-view
            .employees="${this.paginatedEmployees}"
            .editEmployee="${this.editEmployee.bind(this)}"
            .deleteEmployee="${this.deleteEmployee.bind(this)}"
          ></employee-table-view>`}

      <div class="pagination">
        ${Array.from(
          {
            length: Math.ceil(
              this.filteredEmployees.length / this.itemsPerPage,
            ),
          },
          (_, i) => i + 1,
        ).map(
          page =>
            html`
              <button @click="${() => this.changePage(page)}">
                ${page}
              </button>`,
        )}
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
