export const exists = (data) => !!data;
// d1 specific
export const isConflict = (error) => error instanceof Error && error.message?.includes('UNIQUE constraint failed');
export const isUnavailable = (error) => error instanceof Error && error.message?.includes('timeout');
