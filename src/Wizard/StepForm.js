import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./Wizard.module.css";
import customPropTypes from "../customPropTypes";
import Field from "./Field";

class StepForm extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: customPropTypes.childrenOfType(Field),
  };

  submitBtnRef = React.createRef();

  state = { values: this.props.initialValues || {} };

  validate = () => {
    this.submitBtnRef.current.click();
  };

  handleChange = ({ target }) => {
    this.setState(state => ({ values: { ...state.values, [target.name]: target.value } }));
  };

  handleSubmit = e => {
    e.preventDefault();
    if (e.target.checkValidity()) {
      this.props.onNext(this.state.values);
    }
  };

  render() {
    const { currentStep, totalSteps, inLastStep, step, onBack, children, title } = this.props;
    const isCurrent = currentStep === step;

    return (
      <div
        data-testid={`step-${step}`}
        className={styles.step}
        style={{ display: isCurrent ? null : "none" }}
      >
        <h3 className={styles.stepTitle}>
          {title} ({currentStep}/{totalSteps})
        </h3>
        <form className={styles.form} onSubmit={this.handleSubmit}>
          {React.Children.map(children, child =>
            child.type === Field
              ? React.cloneElement(child, {
                  onChange: this.handleChange,
                  value: this.state.values[child.props.name] || "",
                })
              : null,
          )}
          <button ref={this.submitBtnRef} style={{ display: "none" }} />
        </form>
        <div className={styles.buttonGroup}>
          {currentStep !== 1 && <button onClick={onBack}>Back</button>}
          {inLastStep ? (
            <button className={styles.finish} onClick={this.validate}>
              Finish
            </button>
          ) : (
            <button className={styles.next} onClick={this.validate}>
              Next
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default StepForm;
