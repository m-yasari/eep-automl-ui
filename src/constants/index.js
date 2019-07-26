export const HOME_KEY = 'home';
export const CAPTURE_KEY = 'capture';
export const SUMMARY_KEY = 'summary';
export const TRAIN_KEY = 'train';
export const LEADERBOARD_KEY = 'leaderboard';

export const TRAIN_DATA = 'train';
export const TEST_DATA = 'test';

const types = [
    ["int", "Numeric"],
    ["real", "Numeric"],
    ["enum", "Enum"]
]

export const colType2Type = (colType) => {
    for (let i in types) {
        if (types[i][0] === colType) {
            return types[i][1];
        }
    }
    return "Unknown";
}