import { LitElement, html, unsafeCSS } from 'lit';
import style from './index.css?inline';
import { translate } from 'lit-translate';

export class ListView extends LitElement {
  static styles = unsafeCSS(style);

  static properties = {
    employees: { type: Array },
    editEmployee: { type: Function },
    deleteEmployee: { type: Function },
  };

  render() {
    return html`
      <div class="list-view">
        ${this.employees.map(
          employee => html`
            <div class="list-item">
              <strong>${employee.firstName} ${employee.lastName}</strong>
              <span>${employee.department} - ${employee.position}</span>
              <div class="action-buttons">
                <button @click="${() => this.editEmployee(employee)}">
                  ${translate('edit')}
                </button>
                <button @click="${() => this.deleteEmployee(employee)}">
                  ${translate('delete')}
                </button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}

customElements.define('employee-list-view', ListView);
