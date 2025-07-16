export function exclude<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
}

export function excludeHash<T extends { hash: any }>(user: T): Omit<T, 'hash'> {
    return exclude(user, 'hash');
}
