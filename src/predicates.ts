export const exists = (data: unknown) => !!data

// d1 specific
export const isConflict = (error: unknown) => error instanceof Error && error.message?.includes('UNIQUE constraint failed')
export const isUnavailable = (error: unknown) => error instanceof Error && error.message?.includes('timeout')
