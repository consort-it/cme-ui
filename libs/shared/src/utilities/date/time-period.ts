import { MonthOfYear } from './month-of-year';
import { Month } from './month.enum';

// tslint:disable-next-line:no-use-before-declare
class TimePeriodImpl implements TimePeriod {
  start = -1;
  end = -1;

  get startMonth() {
    return new Date(this.start).getUTCMonth() as Month;
  }

  get startDate() {
    return new Date(this.start);
  }
  get endMonth() {
    return new Date(this.end).getUTCMonth() as Month;
  }

  get endDate() {
    return new Date(this.end);
  }
}

/**
 * Represents a period in (UTC) time.
 */
export abstract class TimePeriod {
  /**
   * Start of the time period in milliseconds since midnight, January 1, 1970 Universal Coordinated Time (UTC).
   */
  public abstract readonly start: number;

  public abstract readonly startMonth: Month;
  public abstract readonly startDate: Date;
  /**
   * Start of the time period in milliseconds since midnight, January 1, 1970 Universal Coordinated Time (UTC).
   */
  public abstract readonly end: number;
  public abstract readonly endMonth: Month;

  public abstract readonly endDate: Date;

  /**
   * Create a new TimePeriod
   * @param fromDate start of the period in number of milliseconds
   * since midnight, January 1, 1970 Universal Coordinated Time (UTC). Use Date.UTC(...) or Date().getTime() to create the value.
   */
  public static createFrom(start: number) {
    const timePeriod = new TimePeriodImpl();
    return {
      /**
       * Finish creating a new TimePeriod
       * @param toDate end of the period in number of milliseconds
       * since midnight, January 1, 1970 Universal Coordinated Time (UTC). Use Date.UTC(...) or Date().getTime() to create the value.
       */
      to: (end: number): TimePeriod => {
        timePeriod.start = start;
        timePeriod.end = end;
        return timePeriod;
      }
    };
  }

  /**
   * Creates a TimePeriod for the given month. Note that the resulting end date is the first day of the nex month (at 0:00Z)
   * @param monthOfYear the month to create the TimePeriod for.
   */
  static createForMonth(monthOfYear: MonthOfYear): TimePeriod {
    const timePeriod = new TimePeriodImpl();
    timePeriod.start = Date.UTC(monthOfYear.year, monthOfYear.month);
    timePeriod.end = Date.UTC(monthOfYear.year, monthOfYear.month + 1);
    return timePeriod;
  }
}
