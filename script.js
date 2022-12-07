document.addEventListener("DOMContentLoaded", function() 
{
    var player = 
    {
        'Strength': 6,
        "Cunning": 6,
        'Speed': 6,
        'Fatigue': 30
    };
    var computer = 
    {
        'Strength': 6,
        "Cunning": 6,
        'Speed': 6,
        'Fatigue': 30
    };
    var playerStatsContainer = document.getElementById('player-stats-table');
    var computerStatsContainer = document.getElementById('computer-stats-table');
    var playerOrgFatigue;
    var computerOrgFatigue;

    // functions
    function getRandomInteger(lower, upper) {
        var multiplier = upper - (lower - 1);
        var rnd = parseInt(Math.random() * multiplier) + lower;
        return rnd;
    }

    function initialize()
    {
        generateFightersVals(player);
        playerOrgFatigue = player['Fatigue'];
        generateFightersVals(computer);
        computerOrgFatigue = computer['Fatigue'];
        displayStats(player, playerStatsContainer);
        displayStats(computer, computerStatsContainer);

        addButtonListener('fight');
        addButtonListener('defend');
        addButtonListener('finisher');
    }
    function addButtonListener(id)
    {
        document.getElementById(id).addEventListener('click', function(e) {
                battle(id);
        });
    }
    function displayStats(fighter, container)
    {
        // Create table for stats
        for (const [key, value] of Object.entries(fighter)) 
        {
            // create new row
            let newRow = container.insertRow();
            // Stat heading
            var newCell = newRow.insertCell();
            newCell.innerHTML = key;
            // Stat Org value
            var newCell = newRow.insertCell();
            newCell.innerHTML = value;
            // Stat Current Value
            var newCell = newRow.insertCell();
            newCell.innerHTML = value;
            newCell.classList.add(key);
        }
    }
    function generateFightersVals(fighter)
    {
        
        fighter['Fatigue'] += getRandomInteger(0, 6);

        fighter['Strength'] += getRandomInteger(0, 1);
        fighter['Cunning'] += getRandomInteger(0, 1);
        fighter['Speed'] += getRandomInteger(0, 1);
        
        // Increase 2 stats by 1 and Decreease 2 stats by 1
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
    }
    function getRandomStat()
    {
        return Object.keys(player)[Math.floor(Math.random() * Object.keys(player).length)];
    }
    function calcAttack(fighter, isFinisher)
    {
        if (isFinisher)
        {
            return Math.round((fighter['Strength'] + fighter['Speed'])/getRandomInteger(1, 3));
        }
        return Math.round((fighter['Strength'] + fighter['Speed'] + fighter['Cunning'])/getRandomInteger(1, 3));
    }
    function calcDefense(fighter, isDefending)
    {
        if (isDefending)
        {
            return Math.round(fighter['Speed'] + fighter['Cunning']);
        }
        return fighter['Speed'] + getRandomInteger(1, 6);
    }
    function canDoFinisher()
    {
        if (computer["Fatigue"] < 0 || computer["Fatigue"] * 2 <= player["Fatigue"])
        {
            document.getElementById('finisher').classList.add('appear');
            return 'player';
        }
        if (player["Fatigue"] < 0 || player["Fatigue"] * 2 <= computer["Fatigue"] )
        {
            return 'computer';
        }
    }
    // 0 is fight, 1 is defense, 2 is for finisher
    function computerChoice()
    {
        if (canDoFinisher() == 'computer')
        {
            return 'finisher';
        }
        let rnd = getRandomInteger(0, 1);
        if (rnd == 0)
        {
            return 'fight';
        }
        else
        {
            return 'defend';
        }
    }

    function battle(playerMove)
    {
        // disappear finisher
        document.getElementById('finisher').classList.remove('appear');

        let computerMove = computerChoice();
        let playerAttack;
        let playerDefense;
        let isPlayerDefending;
        let computerAttack;
        let computerDefense;
        let isComputerDefending;

        switch(playerMove)
        {
            case 'fight':
                playerAttack = calcAttack(player, false);
                break;
            case 'defend':
                isPlayerDefending = true;
                break;
            case 'finisher':
                playerAttack = calcAttack(player, true);
                console.log("attack is " + playerAttack);
                if (playerAttack > 1)
                {
                    win('player');
                }
                break;
        }
        
        switch(computerMove)
        {
            case 'fight':
                computerAttack = calcAttack(computer, false);

                break;
            case 'defend':
                isComputerDefending = true;
                break;
            case 'finisher':
                computerAttack = calcAttack(computer, true);
                
                if (computerAttack > 1)
                {
                    win('computer');
                }
                break;
        }
    
        let computerMoveResults = doMove(computer, computerMove);
        console.log(computerMoveResults);
        
        // needs to calc defense every turn
        computerDefense = calcDefense(computer, isComputerDefending);
        playerDefense = calcDefense(player, isPlayerDefending);

        // Attack
        // Fatigue is altered if attacked
        let playerFatigueChange;
        let computerFatigueChange;
    
        if (playerAttack > computerDefense)
        {
            computerFatigueChange = computerDefense - playerAttack;
            computer['Fatigue'] += computerFatigueChange;
        }
        else if (computerAttack > playerDefense)
        {
            playerFatigueChange =  playerDefense - computerAttack;
            player['Fatigue'] += playerFatigueChange;
        }

        // if player defended and took no damage then regain some fatigue
        if (playerMove == 'defend' && playerFatigueChange == 0)
        {
            defend(player, playerOrgFatigue);
        }
        else if (computerMove == 'defend' && computerFatigueChange == 0)
        {
            defend(computer, computerOrgFatigue);
        }
        else if (computerMove == 'defend' && playerMove == 'defend')
        {
            // if both defend then both get fatigue back
            defend(computer, computerOrgFatigue);
            defend(player, playerOrgFatigue);
        }
        
        // Info to display on the log
        let playerTurnInfo = 
        {
            'Player move': playerMove,
            'Player Attack': playerAttack,
            'Player Defense': playerDefense,
            'Player Fatigue Change': playerFatigueChange 
        }
        let computerTurnInfo = 
        {
            'Computer move': computerMove,
            'Computer Attack': computerAttack,
            'Computer Defense': computerDefense,
            'Computer Fatigue Change': computerFatigueChange 
        }
        

        
        updateStats(player, 0);
        updateStats(computer, 1);

        canDoFinisher();
        display(playerTurnInfo, computerTurnInfo);
    }
    function doMove(fighter, moveChoice)
    {
        let attack;
        let isDefending;
        switch(moveChoice)
        {
            case 'fight':
                attack = calcAttack(fighter, false);
                break;
            case 'defend':
                isDefending = true;
                break;
            case 'finisher':
                attack = calcAttack(fighter, true);
                
                if (attack > 1)
                {
                    win('computer');
                }
                break;
        }
        return [attack, isDefending];
    }
    function defend(fighter, orgFatigue)
    {
        let fatigueChange = getRandomInteger(1, 6);
        fighter["Fatigue"] += fatigueChange;
        if (fighter["Fatigue"] > orgFatigue)
        {
            fighter["Fatigue"] = orgFatigue;
        }
        console.log(fatigueChange);
    }
    /**
     * 
     * @param {*} fighter 
     * @param {index of the log (0 is player, 1 is computer)} index 
     */
    function updateStats(fighter, index)
    {
        document.getElementsByClassName('Strength')[index].innerHTML = fighter['Strength'];
        document.getElementsByClassName('Cunning')[index].innerHTML = fighter['Cunning'];
        document.getElementsByClassName('Speed')[index].innerHTML = fighter['Speed'];
        document.getElementsByClassName('Fatigue')[index].innerHTML = fighter['Fatigue'];
    }
    
    function display(playerInfo, computerInfo)
    {
       for (const [key, value] of Object.entries(playerInfo))
       {
        if (value != undefined)
        {
            document.getElementById('player-log').innerHTML += key + ': ' + value + "<br>";
        }
       }
       for (const [key, value] of Object.entries(computerInfo))
       {
        if (value != undefined)
        {
            document.getElementById('computer-log').innerHTML += key + ': ' + value + "<br>";
        }
       }
       document.getElementById('player-log').innerHTML += "<br>";
       document.getElementById('computer-log').innerHTML += "<br>";
    }
    function win(winner)
    {
        alert('Winner is ' + winner);
        alert('Refresh the page to reset the game');    
        document.getElementById('finisher').classList.remove('appear');
    }
    
    // Call functions
    initialize();
});
