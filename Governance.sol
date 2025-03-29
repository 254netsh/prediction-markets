// Governance.sol
contract Governance {
    address public owner;
    mapping(address => bool) public admins;

    modifier onlyOwner() { require(msg.sender == owner); _; }
    modifier onlyAdmin() { require(admins[msg.sender]); _; }

    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
    }

    function updatePriceFeed(address _newFeed) external onlyAdmin {
        PredictionMarket(contractAddress).updatePriceFeed(_newFeed);
    }
}