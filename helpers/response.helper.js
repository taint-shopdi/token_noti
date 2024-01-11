class ResponseHelper {
  /** Processing result return to publish actions
   * @param data data will return
   * @output { code, data, message }
   */
  resOK(data, isList = false) {
    if (isList) {
      return {
        code: 1,
        ...data,
        message: 'SUCCESS'
      };
    }

    return {
      code: 1,
      data,
      message: 'SUCCESS'
    };
  }

  /** Processing result return to publish actions
   * @param [data]: object custom failed
   * @output  { code, state data, message }
   */
  resFailed(data = null) {
    return {
      code: 2,
      message: 'FAILED',
      data
    };
  }
}

module.exports = ResponseHelper;
