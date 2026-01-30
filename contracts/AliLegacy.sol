// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AliLegacy {
    struct Score {
        string player;
        uint score;
    }

    Score[] public scores;

    function recordScore(string memory player, uint score) public {
        scores.push(Score(player, score));
    }

    function getScores() public view returns(Score[] memory) {
        return scores;
    }
}

