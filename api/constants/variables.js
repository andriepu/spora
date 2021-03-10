const isDev = process.env.NODE_ENV !== 'production';

const prefix = isDev ? '[DEV] ' : '';

export const RETRO_TITLE = `${prefix}Retrospective %s`;
export const GROOMING_TITLE = `${prefix}Grooming %s`;
