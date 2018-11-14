var DFcore = artifacts.require("./DFcore.sol");

var wait = function (sec) {
  return function () {
    return new Promise(function (resolve/*, reject*/) {
      setTimeout(resolve, sec * 1000)
    });
  }
};

const toObj = (pjInfo) => {
  return {
    title: pjInfo[0],
    goal: pjInfo[1],
    amount: pjInfo[2],
    limittime: pjInfo[3],
    supportersArray: pjInfo[4]
  }
}

contract('DFcore', function (accounts) {
  describe('makePJ', function () {
    it.only("After makePJ(), accounts[0]'s ownerPJCount should be added 1", async function () {
      const core = await DFcore.new();
      let result = await core.ownerPJCount.call(accounts[0]);
      const count = result.toNumber();
      const fundingGoal = web3.toWei(5, 'ether')
      await core.makePJ('日本を変える', fundingGoal);
      result = await core.ownerPJCount.call(accounts[0]);
      assert.equal(count + 1, result.toNumber(), "accounts[0]'s ownerPJCount should 1")
    });
  })

  describe('test deposit & withdraw', function () {
    let core
    const pjId = 0
    const pjOwner = accounts[0]
    const funder = accounts[1]

    beforeEach(async () => {
      core = await DFcore.new()
      const fundingGoal = web3.toWei(5, 'ether')
      await core.makePJ('日本を変える', fundingGoal);
      await core.deposit(0, {value: web3.toWei(4, 'ether'), from: accounts[1]});
    })
    it.only("After deposit(), PJs[0]'s amount should be added", async function () {
      const info = toObj(await core.getPJInfo(pjId));
      assert.equal(info.amount, web3.toWei(4, 'ether'), "PJs[0]'s amount should 5 ether");
    });

    it.only("満額お金が貯まっている際に、引き出しを行うと、PJ作成者に送金されるか", async function () {
      await core.deposit(pjId, {value: web3.toWei(2, 'ether'), from: funder});
      const afterDepositInfo = toObj(await core.getPJInfo(pjId));
      assert.equal(afterDepositInfo.amount, web3.toWei(6, 'ether'))

      const beforePJOWnerBalance = await web3.eth.getBalance(pjOwner)
      await core.success_withdraw(pjId);
      const afterWithdrawInfo = toObj(await core.getPJInfo(0));

      assert.equal(afterWithdrawInfo.amount, web3.toWei(0, 'ether'))

      const afterPJOwnerBalance = await web3.eth.getBalance(pjOwner)
      assert.isAbove(afterPJOwnerBalance.toNumber() - beforePJOWnerBalance.toNumber(), parseInt(web3.toWei(5.8, 'ether')))
    });
  })

  it("満額貯まっていないのに、期限がすぎしまった時にきちんと支援者に返金できるようにするか", function () {
    var core;
    return DFcore.new().then(function (instance) {
      core = instance;
      return core.makePJ('世界を変える', web3.toWei(10, 'ether'));
    }).then(function (result) {
      console.log("Before deposit: " + web3.eth.getBalance(accounts[2]));
      return core.getPJInfo(1);
    }).then(function (result) {
      console.log(result);
    }).then(function () {
      return core.deposit(1, {value: web3.toWei(2, 'ether'), from: accounts[2]});
    }).then(function () {
      return core.deposit(1, {value: web3.toWei(2, 'ether'), from: accounts[3]});
    }).then(function () {
      return core.deposit(1, {value: web3.toWei(2, 'ether'), from: accounts[4]});
    }).then(function () {
      return core.deposit(1, {value: web3.toWei(2, 'ether'), from: accounts[5]});
    }).then(function () {
      return core.getPJInfo(1);
    }).then(function (result) {
      console.log(result);
      console.log("Before withdraw: " + web3.eth.getBalance(accounts[2]));
    }).then(wait(10)) // PJの期限を超えるように10秒設定
      .then(function () {
        return core.failure_withdraw(1);
      }).then(function () {
        console.log("After: " + web3.eth.getBalance(accounts[2]));
      }).then(function () {
        return core.getPJByOwner(accounts[0]);
      }).then(function (result) {
        console.log(result);
      });
  });

  it("mapping 両方確認", function () {
    var core;
    return DFcore.new().then(function (instance) {
      core = instance;
      return core.PJToOwner.call(0);
    }).then(function (result) {
      console.log("PJ 0's owner : " + result);
      return core.ownerPJCount.call(result);
    }).then(function (num) {
      console.log("address PJ num : " + num);
    });
  });

  it("PJの数を取得", function () {
    var core;
    return DFcore.new().then(function (instance) {
      core = instance;
      return core.getPJcount()
    }).then(function (result) {
      console.log(result)
    })
  })
});
