var DFcore = artifacts.require("./DFcore.sol");

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
      return core.makePJ('日本を変える', 50000);
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
      return core.deposit(0, {value: web3.toWei(4, 'ether')});
    }).then(function() {
      return core.getPJInfo(0);
    }).then(function(result) {
      return assert.equal(result[2], web3.toWei(4, 'ether'), "PJs[0]'s amount should 4 ether");
    });
  });

  it("満額お金が貯まっている際に、引き出しを行うと、PJ作成者に送金されるか", function() {
    
  })

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
});
//
// ・プロジェクトの作成ができているかどうか
// 　プロジェクトを作る。
// 　プロジェクトの中身が作ったものと一致しているかどうか
//
// ・プロジェクトの中にちゃんと指定した額を投げることができるかどうか
// 　プロジェクトにお金を投げる
// 　プロジェクトの中の残高を確認する
// 　それらが一致しているかどうか
//
// ・満額お金が貯まっている時に、ちゃんとプロジェクト作成者に送られているか
// 　まず、プロジェクトを満額以上にする
// 　満額以上になっていることを確認する
// 　success_withdrawを実行させる
// 　貯まっていたお金だけ、プロジェクト主の残高が増えているか確認する
//
// ・満額お金が貯まっていない時に、支援者に全額のお金が送られているか
// 　まずプロジェクトに満額以下のお金を貯める
// 　満額以下のお金が入っていることを確認する
// 　支援者がそれぞれどれだけの額を支援しているのかを確認する
// 　failure_withdrawを実行させる(limittimeを過ぎていることも条件であることを忘れないように)
// 　支援者それぞれに、支援した額が返ってきていることを確認する
//
// ・アドレスに合わせて、その人が作ったプロジェクトのidを取得する
// 　getBoxByOwnerの関数を叩く
// 　配列が返ってきていることを確認する
//
// ・プロジェクトidに合わせて、プロジェクト名、目標額、合計金額、制限時間、支援者のアドレス配列を取得する
// 　getBoxInfoの関数を叩く
// 　作成した時の情報が返ってきていることを確認する
//
// ・あるプロジェクトに、ある人がどれだけ支援しているのかの情報を取得
// 　getBoxFunds関数にプロジェクトidとaddressを渡して、その情報があっているか確認する
//
// ・mappingのBoxToOwnerとowenrBoxCountが正しい値を返すかどうかを確認する
