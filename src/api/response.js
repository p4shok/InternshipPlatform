export const extractItems = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.items)) {
        return payload.items;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (Array.isArray(payload?.data?.items)) {
        return payload.data.items;
    }

    return [];
};

export const extractData = (payload) => {
    if (payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
        return payload.data;
    }

    return payload;
};
