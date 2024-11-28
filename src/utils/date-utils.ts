export class DateUtils {
  /**
   * Returns a date object that represents the date 'days' before today.
   * @param days - The number of days to subtract from today's date.
   */
  static daysBeforetoday(days: number): Date {
    const today = new Date();
    today.setDate(today.getDate() - days);
    today.setHours(0, 0, 0, 0);
    return today;
  }
}
