export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const truncateString = (str, length) => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
};
