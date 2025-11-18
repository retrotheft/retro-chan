export type Result<T, E = Error> = {
    status: 'resolved';
    data: T;
} | {
    status: 'rejected';
    error: E;
};
export declare function createResult<T>(asyncFn: () => Promise<T>): Promise<Result<T, Error>>;
