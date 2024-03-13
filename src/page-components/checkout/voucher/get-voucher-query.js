const getVoucherQuery = `
 query getVoucher($code: String!) {
    voucher(code: $code) {
      isValid,
      voucher {
        code
        discountAmount
        discountPercent
      }
    }
  }
`;

export default getVoucherQuery;
