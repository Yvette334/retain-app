function isValidMonth(month){
    return /^\d{4}-(0[1-9]|1[0-2])$/.test(month);
}

function monthRange(month){
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getUTCMonth() + 1);
    return {start, end};
}

function currentMonth(){
    return new Date().toISOString().slice(0, 7);
}

module.exports = {isValidMonth, monthRange, currentMonth}