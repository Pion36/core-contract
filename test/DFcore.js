var DFcore = artifacts.require("./DFcore.sol");

var wait = function(sec) {
  return function() {
    return new Promise(function(resolve/*, reject*/) {
      setTimeout(resolve, sec*1000)
    });
  }
};

contract('DFcore', function(accounts) {
  it("After makePJ(), accounts[0]'s ownerPJCount should be added 1", function() {
    var core;
    var count;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.ownerPJCount.call(accounts[0]);
    }).then(function(result) {
      count = result.c[0];
    }).then(function() {
      return core.makePJ('日本を変える', web3.toWei(5, 'ether'));
    }).then(function() {
      return core.ownerPJCount.call(accounts[0]);
    }).then(function(result) {
      return assert.equal(count+1, result.c[0], "accounts[0]'s ownerPJCount should 1")
    });
  });

  it("After deposit(), PJs[0]'s amount should be added", function() {
    var core;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.deposit(0, {value: web3.toWei(4, 'ether'), from: accounts[1]});
    }).then(function() {
      return core.getPJInfo(0);
    }).then(function(result) {
      return assert.equal(result[2], web3.toWei(4, 'ether'), "PJs[0]'s amount should 5 ether");
    });
  });

  it("満額お金が貯まっている際に、引き出しを行うと、PJ作成者に送金されるか", function() {
    var core;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.getPJInfo(0);
    }).then(function(result) {
      console.log(result);
    }).then(function() {
      return core.deposit(0, {value: web3.toWei(2, 'ether'), from: accounts[1]});
    }).then(function() {
      return core.getPJInfo(0);
    }).then(function(result) {
      console.log(result);
    }).then(function() {
      console.log("Before success:" + web3.eth.getBalance(accounts[0]));
    }).then(function() {
      return core.success_withdraw(0);
    }).then(function() {
      console.log("After success:" + web3.eth.getBalance(accounts[0]));
    }).then(function() {
      return core.getPJInfo(0);
    }).then(function(result) {
      console.log(result);
    });
  });

  it("満額貯まっていないのに、期限がすぎしまった時にきちんと支援者に返金できるようにするか", function() {
    var core;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.makePJ('世界を変える', web3.toWei(10, 'ether'));
    }).then(function(result) {
      console.log("Before deposit: " + web3.eth.getBalance(accounts[2]));
      return core.getPJInfo(1);
    }).then(function(result) {
      console.log(result);
    }).then(function() {
      return core.deposit(1, {value: web3.toWei(2, 'ether'), from: accounts[2]});
    }).then(function() {
      return core.deposit(1, {value: web3.toWei(2, 'ether'), from: accounts[3]});
    }).then(function() {
      return core.deposit(1, {value: web3.toWei(2, 'ether'), from: accounts[4]});
    }).then(function() {
      return core.deposit(1, {value: web3.toWei(2, 'ether'), from: accounts[5]});
    }).then(function() {
      return core.getPJInfo(1);
    }).then(function(result) {
      console.log(result);
      console.log("Before withdraw: " + web3.eth.getBalance(accounts[2]));
    }) .then(wait(10)) // PJの期限を超えるように10秒設定
      .then(function() {
      return core.failure_withdraw(1);
    }).then(function() {
      console.log("After: " + web3.eth.getBalance(accounts[2]));
    }).then(function() {
      return core.getPJByOwner(accounts[0]);
    }).then(function(result) {
      console.log(result);
    });
  });

  it("mapping 両方確認", function() {
    var core;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.PJToOwner.call(0);
    }).then(function(result) {
      console.log("PJ 0's owner : " + result);
      return core.ownerPJCount.call(result);
    }).then(function(num) {
      console.log("address PJ num : " + num);
    });
  });

  it("PJの数を取得", function() {
    var core;
    return DFcore.deployed().then(function(instance) {
      core = instance;
      return core.getPJcount()
    }).then(function(result) {
      console.log(result)
    })
  })
});
