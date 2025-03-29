// contracts/Governance.sol
contract Governance {
    struct Proposal {
        address target;
        bytes data;
        uint256 votes;
        mapping(address => bool) voted;
    }
    
    Proposal[] public proposals;
    
    function createProposal(address _target, bytes calldata _data) external {
        proposals.push(Proposal(_target, _data, 0));
    }
    
    function vote(uint256 proposalId) external {
        require(!proposals[proposalId].voted[msg.sender], "Already voted");
        proposals[proposalId].votes += balanceOf(msg.sender);
        proposals[proposalId].voted[msg.sender] = true;
    }
}