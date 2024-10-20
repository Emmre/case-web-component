import { LitElement, html, unsafeCSS } from 'lit';
import { translate } from 'lit-translate';
import style from './index.css?inline';

export class TableView extends LitElement {
  static styles = unsafeCSS(style);

  static properties = {
    employees: { type: Array },
    editEmployee: { type: Function },
    deleteEmployee: { type: Function },
  };

  render() {
    return html`
      <div class="table-view">
        <table>
          <thead>
            <tr>
              <th>${translate('firstName')}</th>
              <th>${translate('lastName')}</th>
              <th>${translate('department')}</th>
              <th>${translate('position')}</th>
              <th>${translate('actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.employees.map(
              employee => html`
                <tr>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${employee.department}</td>
                  <td>${employee.position}</td>
                  <td>
                    <div class="action-buttons">
                      <button @click="${() => this.editEmployee(employee)}">
                        ${translate('edit')}
                      </button>
                      <button @click="${() => this.deleteEmployee(employee)}">
                        ${translate('delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}

customElements.define('employee-table-view', TableView);
