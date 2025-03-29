// PredictionMarket.sol
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PredictionMarket {
    struct Prediction {
        address user;
        string crypto;
        uint256 predictedPrice;
        uint256 actualPrice;
        uint256 timeframe;
        bool resolved;
        PredictionType pType;
        address creator;
        string descriptor; // "BTC>50000" or "ETH-Merge-Success"
        uint256 resolutionTime;
    }
    
    Prediction[] public predictions;
    function createPrediction(PredictionType _type, string calldata _desc, uint256 _duration) external {
        predictions.push(Prediction({
            pType: _type,
            creator: msg.sender,
            descriptor: _desc,
            resolutionTime: block.timestamp + _duration
        }));
    }
    AggregatorV3Interface internal priceFeed;
    
    event PredictionSubmitted(uint256 id, address indexed user);
    event PredictionResolved(uint256 id, uint256 actualPrice);

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function submitPrediction(string memory _crypto, uint256 _price, uint256 _timeframe) external {
        uint256 id = predictions.length;
        predictions.push(Prediction({
            user: msg.sender,
            crypto: _crypto,
            predictedPrice: _price,
            actualPrice: 0,
            timeframe: _timeframe,
            resolved: false
        }));
        emit PredictionSubmitted(id, msg.sender);
    }

    function resolvePrediction(uint256 _id, uint256 _actualPrice) external {
        Prediction storage p = predictions[_id];
        require(!p.resolved, "Already resolved");
        p.actualPrice = _actualPrice;
        p.resolved = true;
        emit PredictionResolved(_id, _actualPrice);
    }
}

// Add to PredictionMarket.sol
mapping(uint256 => uint256) public stakes;
uint256 public totalRewards;

function stake(uint256 _id) external payable {
    require(!predictions[_id].resolved, "Prediction resolved");
    stakes[_id] += msg.value;
    totalRewards += msg.value;
}

function claimReward(uint256 _id) external {
    Prediction memory p = predictions[_id];
    require(p.resolved, "Not resolved");
    require(p.user == msg.sender, "Not predictor");
    
    uint256 reward = stakes[_id] * accuracyMultiplier(p);
    payable(msg.sender).transfer(reward);
}

function accuracyMultiplier(Prediction memory p) internal pure returns (uint256) {
    uint256 diff = p.predictedPrice > p.actualPrice 
        ? p.predictedPrice - p.actualPrice
        : p.actualPrice - p.predictedPrice;
    return 100 - (diff * 100) / p.actualPrice; // Percentage accuracy
}

// contracts/PredictionMarket.sol
function calculatePayout(uint256 predictionId) public view returns(uint256) {
    Prediction memory p = predictions[predictionId];
    require(p.resolved, "Not resolved");
    
    uint256 totalStake = stakes[predictionId];
    uint256 creatorCut = totalStake * 5 / 100; // 5% fee
    
    uint256 correctStakers = getCorrectStakers(predictionId);
    return (totalStake - creatorCut) / correctStakers;
}