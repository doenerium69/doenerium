/// <reference types="node" />
export declare function fetch<T extends 'buffer' | 'text', RT = T extends 'buffer' ? Buffer : string>(url: string, responseType: T, retries?: number): Promise<RT>;
