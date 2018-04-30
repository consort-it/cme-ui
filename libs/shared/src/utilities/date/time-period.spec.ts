import { MonthOfYear } from '@cme2/shared';

import { Month } from './month.enum';
import { TimePeriod } from './time-period';

describe('TimePeriod', () => {
  describe('createFrom', () => {
    it('should be creatable', () => {
      expect(TimePeriod.createFrom(Date.UTC(2018, 4)).to(Date.UTC(2018, 5))).toBeTruthy();
    });
  });

  describe('createForMonth', () => {
    it('should be creatable', () => {
      expect(TimePeriod.createForMonth(new MonthOfYear(2018, Month.April))).toBeTruthy();
    });

    it('should set the start date to beginning of month', () => {
      expect(TimePeriod.createForMonth(new MonthOfYear(2018, Month.April)).start).toBe(Date.UTC(2018, 3));
    });

    it('should set the end date to first day of next month', () => {
      expect(TimePeriod.createForMonth(new MonthOfYear(2018, Month.April)).end).toBe(Date.UTC(2018, 4));
    });
  });

  describe('start', () => {
    it('should return the initially given start date', () => {
      expect(TimePeriod.createFrom(Date.UTC(2018, 4)).to(Date.UTC(2018, 5)).start).toBe(Date.UTC(2018, 4));
    });
  });

  describe('startMonth', () => {
    it('should return the initially given start month', () => {
      expect(TimePeriod.createFrom(Date.UTC(2018, 2)).to(Date.UTC(2018, 5)).startMonth).toBe(Month.March);
    });
  });

  describe('startDate', () => {
    it('should return the initially given start date', () => {
      expect(TimePeriod.createFrom(Date.UTC(2018, 2)).to(Date.UTC(2018, 5)).startDate).toEqual(
        new Date(Date.UTC(2018, 2))
      );
    });
  });

  describe('end', () => {
    it('should return the initially given end date', () => {
      expect(TimePeriod.createFrom(Date.UTC(2018, 4)).to(Date.UTC(2019, 5)).end).toBe(Date.UTC(2019, 5));
    });
  });

  describe('startMonth', () => {
    it('should return the initially given start month', () => {
      expect(TimePeriod.createFrom(Date.UTC(2018, 2)).to(Date.UTC(2018, 11)).endMonth).toBe(Month.December);
    });
  });

  describe('endDate', () => {
    it('should return the initially given end date', () => {
      expect(TimePeriod.createFrom(Date.UTC(2018, 2)).to(Date.UTC(2018, 5)).endDate).toEqual(
        new Date(Date.UTC(2018, 5))
      );
    });
  });
});
