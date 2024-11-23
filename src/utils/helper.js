const getRandomNum = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};


function formatPhoneNumber(number) {
    const countryCode = '+91';
    if (!number.startsWith(countryCode)) {
        return countryCode + number;
    }

    return number;
}





module.exports = {
    getRandomNum,
    formatDate,
    formatPhoneNumber
}