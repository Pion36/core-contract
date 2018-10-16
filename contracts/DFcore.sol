pragma solidity ^0.4.23;
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract DFcore is Ownable {

  struct Box {
    string purpose;
    uint target;
    uint amount;
    uint limittime;
    address[] supportersArray;
    mapping (address => uint) public funds;  //支援者の誰がどれだけ投げてくれたのかを記録しておく
  }

  Box[] public Boxs;
  mapping (uint => address) public BoxToOwner;
  mapping (address => uint) public ownerBoxCount;

  modifier onlyOwnerOf(uint _BoxId) {
    require(msg.sender == BoxToOwner[_BoxId]);
    _;
  }

  function makeBox(string _name, uint _target) public {  // クラウドファンディングのETHを貯める箱を作る関数
    uint limittime = now + 30 days; //とりあえずデフォルトで期限を30日と設定
    uint id = Boxs.push(Box(_name,_target, 0, limittime)) - 1;
    BoxToOwner[id] = msg.sender;
    ownerBoxCount[msg.sender]++;
  }

  function deposit(uint _id) public payable { // 箱にETHを投げる関数
    require(Boxs[_id].amount < Boxs[_id].target);
    require(now <= Boxs[_id].limittime);
    Boxs[_id].amount = Boxs[_id].amount + msg.value;
    Boxs[_id].supporters[].push(msg.sender);
    Boxs[_id].funds[msg.sender] = msg.value;
  }

  function success_withdraw(uint _id) public onlyOwnerOf(_id) {  // 箱の中が満額以上の時のみ、Box製作者がのみが実行してお金を引き出すことができる
    require(Boxs[_id].amount >= Boxs[_id].target);
    uint nakami = Boxs[_id].amount;
    Boxs[_id].amount = 0;
    ownerBoxCount[BoxToOwner[_id]]--;
    BoxToOwner[_id] = owner; //ownerはコントラクト作成者
    ownerBoxCount[owner]++;
    msg.sender.transfer(nakami);
  }

  function failure_withdraw(uint _id) public {  // 期限を超えて、目標額集まらなかった時に、貯めたお金を支援者に返金する
    require(now > Boxs[_id].limittime);
    require(Boxs[_id].amount < Boxs[_id].target);
    for (uint i = 0; i < Boxs[_id].supportersArray.length; i++) {
      address supporteraddress = Boxs[_id].supportersArray[i];
      uint siengaku = Boxs[_id].funds[supporteraddress];
      Boxs[_id].funds[supporteraddress] = 0;
      supporteraddress.transfer(siengaku);
    }
  }

  function getBoxByOwner(address _owner) external view returns(uint[]) {
    uint[] memory result = new int[](ownerBoxCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < Boxs.length; i++) {
      result[counter] = i;
      counter++;
    }
    return result;
  }

}
