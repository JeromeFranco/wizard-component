import React from "react";
import PropTypes from "prop-types";
import styles from "./Wizard.module.css";

const Field = ({ label, ...rest }) => {
  return (
    <div className={styles.controlGroup}>
      <label htmlFor={rest.name}>{label}</label>
      <input {...rest} id={rest.id || rest.name} />
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    "text",
    "password",
    "number",
    "radio",
    "checkbox",
    "email",
    "url",
    "date",
    "time",
    "tel",
    "range",
  ]).isRequired,
};

export default Field;
