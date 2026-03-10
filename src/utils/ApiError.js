class ApiError extends Error {
  constructor(status, message, stack, errors = []) {
    super(message);
    this.errors = errors;
    this.status = status;
    this.message = message;
    this.stack = stack || this.stack;
  }
}

export { ApiError };
