describe("failure", function() {

  it ("should fail for the example", function() {
    expect(false).toBeTruthy();
  });

  it('should fail if dependency is not loaded', function() {
    expect(foo).toBeDefined();
  });

  it('should fail if function is invalid', function() {
    expect(fail()).toBeDefined();
  });
});
