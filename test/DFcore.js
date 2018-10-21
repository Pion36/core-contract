var DFcore = artifacts.require("./DFcore.sol");

contract('DFcore', function(accounts) {
  it("should", function() {
    var core;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.makeBox('寝たままで暮らしたい', 50000);
    }).then(function(){
      return core.BoxToOwner.call(0);
    }).then(function(result) {
      assert.equal(result, accounts[0], "1st box's owener isn't account[0]");
    });
  });

  it("sholud", function() {
    var core;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.BoxToOwner.call(0);
    }).then(function(result) {
      console.log(result);
    });
  });

  it("deposit", function() {
    var core;
    var amount = 1;
    var id = 0;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.deposit(id, {
        value: web3.toWei(10, 'ether')
      }, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log(amount)
          return amount
        }
      });
    })
  });
});
