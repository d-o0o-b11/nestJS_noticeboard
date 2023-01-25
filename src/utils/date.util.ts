export class DateUtil {
  public static dateForamtter(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const fullMonth = month < 10 ? '0' + String(month) : String(month);

    return String(year) + fullMonth + String(day);
  }
}
