import React from "react";

export const childrenOfType = Component => (props, propName, componentName) => {
  const prop = props[propName];
  let error = null;
  React.Children.forEach(prop, function(child) {
    if (child.type !== Component) {
      error = new Error(` \`${componentName}\` children should be of type \`${Component.name}\``);
    }
  });
  return error;
};

export default {
  childrenOfType,
};
