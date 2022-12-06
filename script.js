var player = 
{
    'strength': 6,
    "cunning": 6,
    'speed': 6,
    'fatigue': 30
};
var computer = 
{
    'strength': 6,
    "cunning": 6,
    'speed': 6,
    'fatigue': 30
};;
function getRandomInteger(lower, upper) {
    var multiplier = upper - (lower - 1);
    var rnd = parseInt(Math.random() * multiplier) + lower;
    return rnd;
}

function initialize()
{
    generateFightersVals(player);
    generateFightersVals(computer);
    var playerStats = document.getElementById('player-stats');
    var computerStats = document.getElementById('computer-stats');
    display(playerStats, computerStats);
}
function display(playerStats, computerStats)
{
    for (const [key, value] of Object.entries(player)) 
    {
        console.log("hey");
        let playerStatsEle = document.createElement('p');
        playerStatsEle.innerHTML = key + ': ' + value;
        playerStats.appendChild(playerStatsEle);
    }
    
}
function generateFightersVals(fighter)
{
    fighter['fatigue'] += getRandomInteger(0, 6);
    fighter['strength'] += getRandomInteger(0, 1);
    fighter['cunning'] += getRandomInteger(0, 1);
    fighter['speed'] += getRandomInteger(0, 1);
    
    let increaseStats = new Set();
    while (increaseStats.size < 2)
    {
        let rndIncreaseStat = getRandomStat();
        increaseStats.add(rndIncreaseStat);
        fighter[rndIncreaseStat] += 1;
    }
    let decreaseStats = new Set();
    let rndDecreaseStat = getRandomStat();
    while (decreaseStats.size < 2)
    {

        if (!increaseStats.has(rndDecreaseStat))
        {
            decreaseStats.add(rndDecreaseStat);
            fighter[rndDecreaseStat] -= 1;

        } 
         rndDecreaseStat = getRandomStat();
    }
        
    // console.log(increaseStats);
    // console.log(decreaseStats);
  

    
}
function getRandomStat()
{
    return Object.keys(player)[Math.floor(Math.random() * Object.keys(player).length)];
}
function attack(fighter)
{
    return Math.round((fighter['strength'] + fighter['speed'] + fighter['cunning'])/getRandomInteger(1, 3));
}
function defense(fighter, isDefending)
{
    if (isDefending)
    {
        return Math.round(fighter['speed'] + fighter['cunning']);
    }
    return fighter['speed'] + getRandomInteger(1, 6);
}

function battle()
{
    
}