"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlayer = exports.PlayerPosition = void 0;
/**
 * Valid player positions
 */
var PlayerPosition;
(function (PlayerPosition) {
    PlayerPosition["GOALKEEPER"] = "goalkeeper";
    PlayerPosition["DEFENDER"] = "defender";
    PlayerPosition["MIDFIELDER"] = "midfielder";
    PlayerPosition["FORWARD"] = "forward";
})(PlayerPosition || (exports.PlayerPosition = PlayerPosition = {}));
/**
 * Factory function to create a new Player
 */
const createPlayer = (id, name, position, skillLevel, isActive = true) => {
    if (skillLevel < 1 || skillLevel > 10) {
        throw new Error('Skill level must be between 1 and 10');
    }
    if (!name.trim()) {
        throw new Error('Player name cannot be empty');
    }
    return {
        id,
        name: name.trim(),
        position,
        skillLevel,
        isActive,
    };
};
exports.createPlayer = createPlayer;
//# sourceMappingURL=Player.js.map