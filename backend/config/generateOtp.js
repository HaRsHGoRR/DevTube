const generateOtp = () => {
  return Math.floor(Math.random() * (1000000 - 100000)) + 100000;
};

module.exports = generateOtp;
