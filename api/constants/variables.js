const isDev = process.env.NODE_ENV !== 'production';

const prefix = isDev ? '[DEV] ' : '';

exports.RETRO_TITLE = `${prefix}Retrospective %s`;
exports.GROOMING_TITLE = `${prefix}Grooming %s`;
