import { AsyncLocalStorage } from "async_hooks";

type AsyncLocalStorageType = {
    correlationId: string;
}

// Create an instance of AsyncLocalStorage to manage async context
// This allows us to store and retrieve data across asynchronous calls
export const asyncLocalStorage  = new AsyncLocalStorage<AsyncLocalStorageType>();

export const getCorrelationId = () => {
    const asyncStore = asyncLocalStorage.getStore();
    return asyncStore?.correlationId || "unknown-error-while-creating-correlation-id";
}