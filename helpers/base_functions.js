export function dateConvert(date){
    let dateArray = date.split('-');
    let year = dateArray[0];
    let month = dateArray[1];
    let day = dateArray[2];
    return `${day}.${month}.${year}`;
}

export function getDeliveryTime(dateTime){
    let date = dateConvert(dateTime.substr(0, 10));
    let time = dateTime.substr(11,5);
    return `${date} ${time}`;
}