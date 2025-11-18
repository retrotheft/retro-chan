export async function createResult(asyncFn) {
    try {
        const data = await asyncFn();
        return { status: 'resolved', data };
    }
    catch (error) {
        return { status: 'rejected', error: error };
    }
}
