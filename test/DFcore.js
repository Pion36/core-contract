var DFcore = artifacts.require("./DFcore.sol");

contract('DFcore', function(accounts) {
  it("should", function() {
    var core;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.makeBox('何もせず寝たい！', 500000000);
    })then(function() {
      return core.Boxs[0].call();
    });
  });
})
