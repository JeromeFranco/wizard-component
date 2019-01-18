import React, { Component } from "react";
import "./App.css";
import Wizard from "./Wizard";
import { post, get } from "./api";

class App extends Component {
  state = { isSubmitted: false, employees: [] };

  async componentDidMount() {
    const employees = await get("http://localhost:4000/employees");
    this.setState({ employees });
  }

  handleFinish = async values => {
    const id = this.state.employees.length + 1;
    const formData = { id, ...values, age: parseInt(values.age) };
    await post("http://localhost:4000/employees", formData);
    const employees = await get("http://localhost:4000/employees");
    this.setState({ isSubmitted: true, employees });
  };

  render() {
    const { isSubmitted, employees } = this.state;
    return (
      <div>
        {!isSubmitted ? (
          <Wizard onFinish={this.handleFinish}>
            <Wizard.StepForm title="First Step">
              <Wizard.Field type="text" name="firstName" label="First name" required />
              <Wizard.Field type="text" name="lastName" label="Last name" required />
            </Wizard.StepForm>
            <Wizard.StepForm title="Second Step">
              <Wizard.Field type="email" name="emailAddress" label="Email" required />
            </Wizard.StepForm>
            <Wizard.StepForm title="Last Step">
              <Wizard.Field type="number" name="age" label="Age" required />
            </Wizard.StepForm>
          </Wizard>
        ) : (
          <h2 className="congratsMsg">Congratulations! your details have been submitted.</h2>
        )}
        <blockquote>
          <pre>
            <code>{JSON.stringify(employees, null, 2)}</code>
          </pre>
        </blockquote>
      </div>
    );
  }
}

export default App;
