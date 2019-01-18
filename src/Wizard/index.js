import React, { Component } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "../customPropTypes";
import StepForm from "./StepForm";
import Field from "./Field";
import styles from "./Wizard.module.css";

class Wizard extends Component {
  static StepForm = StepForm;
  static Field = Field;
  static propTypes = {
    initialValues: PropTypes.object,
    onFinish: PropTypes.func.isRequired,
    children: CustomPropTypes.childrenOfType(StepForm),
  };

  state = { currentStep: 1, values: {} };

  checkIfInLastStep = () => this.state.currentStep === this.props.children.length;

  handleNext = values => {
    const inLastStep = this.checkIfInLastStep();

    this.setState(
      state => ({
        values: { ...state.values, ...values },
        currentStep: inLastStep ? state.currentStep : state.currentStep + 1,
      }),
      () => {
        if (inLastStep) {
          this.props.onFinish(this.state.values);
        }
      },
    );
  };

  handleBack = () => {
    this.setState(state => ({
      currentStep: state.currentStep - 1,
    }));
  };

  render() {
    const { children, initialValues } = this.props;
    const { currentStep } = this.state;
    const inLastStep = this.checkIfInLastStep();

    return (
      <div className={styles.container}>
        {React.Children.map(children, (child, index) =>
          child.type === StepForm
            ? React.cloneElement(child, {
                currentStep,
                totalSteps: children.length,
                inLastStep,
                step: index + 1,
                onBack: this.handleBack,
                onNext: this.handleNext,
                initialValues,
              })
            : null,
        )}
      </div>
    );
  }
}

export default Wizard;
