import { NewConnectionComponent } from './new-connection.component';

describe('NewConnectionComponent', () => {
  it('should auto-generate a guid for the new component', () => {
    const sut = new NewConnectionComponent();
    expect(sut.newConnection.id.length).toBeGreaterThan(1);
  });
});
