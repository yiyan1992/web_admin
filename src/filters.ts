export function TimeUtils(time: number[]): string {
    return time[0] + "-" + time[1] + "-" + time[2] + " " + time[3] + ":" + time[4] + ":" + time[5];
}


export function TimeOrString(str: any): any {
    if ((typeof str) == 'string') {
        let s = str + "";
        if (s.length == 26) {
            return s.substr(0,19);
        }
    }
    return str;
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate() - 1;
    const formatMonth = month < 10 ? `0${month}` : month;
    const formatDay = day < 10 ? `0${day}` : day;
    return `${year}-${formatMonth}-${formatDay}`
}

function todayDateTime(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate() - 1;

    const formatMonth = month < 10 ? `0${month}` : month;
    const formatDay = day < 10 ? `0${day}` : day;

    const curHours = date.getHours();
    const curMinutes = date.getMinutes();

    return date.getFullYear() + "-" + formatMonth + "-" + formatDay + " "
        + curHours + ":" + curMinutes + ":" + date.getMinutes();
}