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
            return 2;
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
        computerDefense = calcDefense(computer, isComputerDefending);
        playerDefense = calcDefense(player, isPlayerDefending);

        if (playerAttack > computerDefense)
        {
            computer['Fatigue'] -= playerAttack - computerDefense;
        }
        else if (computerAttack > playerDefense)
        {
            player['Fatigue'] -= computerAttack - playerDefense;
        }
        if (computerMove == 1 && playerMove == 1)
        {
            computer["Fatigue"] += getRandomInteger(1, 6);
            if (computer["Fatigue"] > computerOrgFatigue)
            {
                computer["Fatigue"] = computerOrgFatigue;
            }
            player["Fatigue"] += getRandomInteger(1, 6);
            if (player["Fatigue"] > playerOrgFatigue)
            {
                player["Fatigue"] = playerOrgFatigue;
            }
        }
        
        // console.log("player move is " + playerMove);
        // console.log("computer move is " + computerMove);
        // console.log("player attack is " + playerAttack);
        // console.log("player defense is " + playerDefense);
        // console.log("computer attack is " + computerAttack);
        // console.log("computer defense is " + computerDefense);
        console.log(computer);
        console.log("Player");
        console.log(player);

        updateStats(player, 0);
        updateStats(computer, 1);
        canDoFinisher();
        display();
    }
    function updateStats(fighter, index)
    {
        document.getElementsByClassName('Strength')[index].innerHTML = fighter['Strength'];
        document.getElementsByClassName('Cunning')[index].innerHTML = fighter['Cunning'];
        document.getElementsByClassName('Speed')[index].innerHTML = fighter['Speed'];
        document.getElementsByClassName('Fatigue')[index].innerHTML = fighter['Fatigue'];
    }
    function display()
    {
        
    }
    function win(winner)
    {
        alert('winner is ' + winner);;
        document.getElementById('finisher').classList.remove('appear');

    }
    
    // Call functions
    initialize();
});
