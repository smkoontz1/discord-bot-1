let prepareStringForApi = (str: string): string => {
    return str.toString().replace(/['"]/g, '');
};

export { prepareStringForApi };