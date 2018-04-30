import { ConnectionChecker, NotificationService } from '@cme2/core-services';
import { MockLogService } from '@cme2/logging';
import { first } from 'rxjs/operators';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';

import { LocalStorageMockService } from '../storage/local-storage.service.mock';
import { ClusterConnection } from './cluster-connection';
import {
  ClusterManagerService,
  STORAGE_KEY_AVAILABLE_CONNECTIONS,
  STORAGE_KEY_CURRENT_CONNECTION
} from './cluster-manager.service';

describe('ClusterManagerService', () => {
  const connectionCheckerMockInstance: ConnectionChecker = instance(mock(ConnectionChecker));

  describe('currentConnection functionality', () => {
    it('should emit the current Connection on creation if there is one', (done: Function) => {
      const mockStorage = new LocalStorageMockService();
      const expectedConnection: ClusterConnection = {
        environment: 'test',
        hostname: 'https://unit.test.com',
        namespace: 'unit-test',
        id: 'aaaa-bbbb-cccc-dddd'
      };

      mockStorage.setItem(STORAGE_KEY_CURRENT_CONNECTION, JSON.stringify(expectedConnection));

      const sut = new ClusterManagerService(
        null as any,
        mockStorage,
        new MockLogService(),
        new NotificationService(),
        connectionCheckerMockInstance
      );
      sut.currentConnection$.pipe(first()).subscribe(conn => {
        expect(conn).toEqual(expectedConnection);
        done();
      });
    });

    it('should emit true on hasCurrentConnection$ if there is a current connection', (done: Function) => {
      const mockStorage = new LocalStorageMockService();
      const expectedConnection: ClusterConnection = {
        environment: 'test',
        hostname: 'https://unit.test.com',
        namespace: 'unit-test',
        id: 'aaaa-bbbb-cccc-dddd'
      };

      mockStorage.setItem(STORAGE_KEY_CURRENT_CONNECTION, JSON.stringify(expectedConnection));

      const sut = new ClusterManagerService(
        null as any,
        mockStorage,
        new MockLogService(),
        new NotificationService(),
        connectionCheckerMockInstance
      );
      sut.hasCurrentConnection$.pipe(first()).subscribe(has => {
        expect(has).toBeTruthy();
        done();
      });
    });

    it('should emit false on hasCurrentConnection$ if there is no current connection', (done: Function) => {
      const mockStorage = new LocalStorageMockService();

      const sut = new ClusterManagerService(
        null as any,
        mockStorage,
        new MockLogService(),
        new NotificationService(),
        connectionCheckerMockInstance
      );
      sut.hasCurrentConnection$.pipe(first()).subscribe(has => {
        expect(has).toBeFalsy();
        done();
      });
    });
  });

  describe('availableConnections functionality', () => {
    it('should emit available connections if there is at least one', (done: Function) => {
      const mockStorage = new LocalStorageMockService();
      const expectedConnections: ClusterConnection[] = [
        {
          environment: 'test',
          hostname: 'https://unit.test.com',
          namespace: 'unit-test',
          id: 'aaaa-bbbb-cccc-dddd'
        }
      ];

      mockStorage.setItem(STORAGE_KEY_AVAILABLE_CONNECTIONS, JSON.stringify(expectedConnections));

      const sut = new ClusterManagerService(
        null as any,
        mockStorage,
        new MockLogService(),
        new NotificationService(),
        connectionCheckerMockInstance
      );
      sut.availableConnections$.pipe(first()).subscribe(conns => {
        expect(conns).toEqual(expectedConnections);
        done();
      });
    });

    it('should emit old and new connection when a new one is added', (done: Function) => {
      const mockStorage = new LocalStorageMockService();
      const initialConnections: ClusterConnection[] = [
        {
          environment: 'test',
          hostname: 'https://unit.test.com',
          namespace: 'unit-test',
          id: 'aaaa-bbbb-cccc-dddd'
        }
      ];

      const newConnection: ClusterConnection = {
        namespace: 'new',
        hostname: 'new',
        environment: 'new',
        id: 'xxxx-xxxx'
      };

      mockStorage.setItem(STORAGE_KEY_AVAILABLE_CONNECTIONS, JSON.stringify(initialConnections));

      const sut = new ClusterManagerService(
        null as any,
        mockStorage,
        new MockLogService(),
        new NotificationService(),
        connectionCheckerMockInstance
      );

      sut.addConnection(newConnection);
      initialConnections.push(newConnection);

      sut.availableConnections$.pipe(first()).subscribe(conns => {
        expect(conns).toEqual(initialConnections);
        done();
      });
    });

    it('should emit old and new connection when a connection is removed', (done: Function) => {
      const mockStorage = new LocalStorageMockService();
      const initialConnections: ClusterConnection[] = [
        {
          environment: 'test',
          hostname: 'https://unit.test.com',
          namespace: 'unit-test',
          id: 'aaaa-bbbb-cccc-dddd'
        },
        {
          namespace: 'new',
          hostname: 'new',
          environment: 'new',
          id: 'xxxx-xxxx'
        }
      ];

      mockStorage.setItem(STORAGE_KEY_AVAILABLE_CONNECTIONS, JSON.stringify(initialConnections));

      const sut = new ClusterManagerService(
        null as any,
        mockStorage,
        new MockLogService(),
        new NotificationService(),
        connectionCheckerMockInstance
      );

      sut.removeConnectionById(initialConnections[0].id);

      initialConnections.splice(0, 1);

      sut.availableConnections$.pipe(first()).subscribe(conns => {
        expect(conns).toEqual(initialConnections);
        done();
      });
    });

    it('should set the first remaining connection as current when the current connection is deleted', (done: Function) => {
      const mockStorage = new LocalStorageMockService();
      const initialConnections: ClusterConnection[] = [
        {
          environment: 'test',
          hostname: 'https://unit.test.com',
          namespace: 'unit-test',
          id: 'aaaa-bbbb-cccc-dddd'
        },
        {
          namespace: 'new',
          hostname: 'new',
          environment: 'new',
          id: 'xxxx-xxxx'
        }
      ];

      mockStorage.setItem(STORAGE_KEY_AVAILABLE_CONNECTIONS, JSON.stringify(initialConnections));
      mockStorage.setItem(STORAGE_KEY_CURRENT_CONNECTION, JSON.stringify(initialConnections[0]));

      const sut = new ClusterManagerService(
        null as any,
        mockStorage,
        new MockLogService(),
        new NotificationService(),
        connectionCheckerMockInstance
      );
      sut.removeConnectionById(initialConnections[0].id);

      sut.currentConnection$.pipe(first()).subscribe(conn => {
        expect(conn).toEqual(initialConnections[1]);
        done();
      });
    });
  });
});
