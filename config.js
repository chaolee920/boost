
module.exports = {
	JWT_SECRET: process.env.JWT_SECRET || 'boost',
	DB_URI: process.env.DB_URI || 'mongodb+srv://dwuser:n0s0up4u@cvt-dev-tt3im.azure.mongodb.net/test?authSource=admin&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true',
	MISSING_PARAMETER: 'MISSING_PARAMETER',
	DB_ERROR: 'DB_ERROR',
	EMAIL_DUPLICATION: 'EMAIL_DUPLICATION',
	AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
	NOT_FOUND: 'NOT_FOUND',
	UPDATED: 'UPDATED',
	REMOVED: 'REMOVED',
};
