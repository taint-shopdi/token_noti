const moment = require('moment');
const axios = require('axios');

const helperConvertStringToDate = (dateString) => {
  // INPUT: yyyymmdd
  const length = dateString.split('/').length;

  if (length > 1) {
    return moment(dateString, 'DD/MM/YYYY HH:mm:ss').toDate();
  }
  // OUTPUT: Datetime
  return new Date(Date.parse(dateString.substring(0, 4) + '-' + dateString.substring(4, 6) + '-' + dateString.substring(6, 8)));
};


const validatePictureType = (value, helpers) => {
  if (!value || !value.hapi.headers['content-type'].startsWith('image/')) {
    return helpers.error('any.invalid');
  }
  return value;
};

module.exports = {
  helperConvertStringToDate,
  validatePictureType
};
