export class APIError extends Error {
  public readonly status: number;
  public readonly type: string;
  public readonly title: string;
  public readonly errors?: any;

  constructor(status: number, title: string, detail: string, type = 'about:blank', errors?: any) {
    super(detail);
    this.status = status;
    this.title = title;
    this.type = type;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toJSON() {
    return {
      type: this.type,
      title: this.title,
      status: this.status,
      detail: this.message,
      ...(this.errors && { errors: this.errors }),
    };
  }
}

export class ValidationError extends APIError {
  constructor(detail: string, errors?: any) {
    super(400, 'Bad Request', detail, 'https://glorify.com/errors/validation', errors);
  }
}

export class NotFoundError extends APIError {
  constructor(detail: string) {
    super(404, 'Not Found', detail, 'https://glorify.com/errors/not-found');
  }
}

export class UnauthorizedError extends APIError {
  constructor(detail: string) {
    super(401, 'Unauthorized', detail, 'https://glorify.com/errors/unauthorized');
  }
}

export class ConflictError extends APIError {
  constructor(detail: string) {
    super(409, 'Conflict', detail, 'https://glorify.com/errors/conflict');
  }
}

export class InternalServerError extends APIError {
  constructor(detail = 'An unexpected error occurred on our systems.') {
    super(500, 'Internal Server Error', detail, 'https://glorify.com/errors/internal');
  }
}
