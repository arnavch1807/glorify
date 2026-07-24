export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface PaginationResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export function successResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

export function paginationResponse<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number
): PaginationResponse<T> {
  return {
    success: true,
    data,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + data.length < total,
    },
  };
}
