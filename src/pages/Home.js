import { LitElement, html } from 'lit-element';
import '../components/EmployeeList';

class Home extends LitElement {
  render() {
    return html` <employee-list></employee-list> `;
  }
}

customElements.define('home-page', Home);
