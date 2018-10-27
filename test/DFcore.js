var DFcore = artifacts.require("./DFcore.sol");

contract('DFcore', function(accounts) {
  it("make box", function() {
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

  it("mapping 両方確認", function() {
    var core;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.BoxToOwner.call(0);
    }).then(function(result) {
      console.log("Box 0's owner : " + result);
      return core.ownerBoxCount.call(result);
    }).then(function(num) {
      console.log("address box num : " + num);
    });
  });

  it("deposit", function() {
    var core;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.deposit(0, {value: web3.toWei(0.1, 'ether')});
    }).then(function() {
      console.log(core.getBox(0));
    });
  });
});
