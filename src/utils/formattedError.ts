import { ValidationError } from "yup";

interface Error {
  path: string;
  message: string;
}
export const formattedError = (err: ValidationError) => {
  const errors: Error[] = [];

  err.inner.forEach((e) => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });

  return errors;
};
