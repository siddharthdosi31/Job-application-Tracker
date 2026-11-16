import { useState, useRef } from "react";

function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent multiple submissions before React updates the state.
  const isSubmittingRef = useRef(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setValues((previousValues) => ({
      ...previousValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((previousTouched) => ({
      ...previousTouched,
      [name]: true,
    }));

    setErrors(validate(values));
  };

  const resetForm = (newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Stop if another submission is already running.
    if (isSubmittingRef.current) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    setTouched(
      Object.keys(values).reduce((fields, key) => {
        fields[key] = true;
        return fields;
      }, {})
    );

    if (Object.keys(validationErrors).length > 0) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}

export default useForm;