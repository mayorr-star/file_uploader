class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status;
    this.name = "NotFoundError";
  }
}

module.exports = { NotFoundError };
