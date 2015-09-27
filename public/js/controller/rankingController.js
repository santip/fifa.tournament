controllers.controller("rankingController", ["$scope", "$location", "$http", "Data", "players", "allPlayerStats", function($scope, $location, $http, Data, players, allPlayerStats) {
    Data.setCurrentTournament(undefined);
    
    $scope.updateRanking = function() {
        if(confirm("Estas seguro?")) {
            $http.post("/api/player/ranking").success(function() {
                $location.path("/");
            });
        }
    };

    $scope.goTo = function(player) {
        $location.path('/profile/' + player.alias);
    };
    
    $scope.players = players;
    
    var calculateDelta = function(player) {
        var lastRanking = player.ranking;
        var delta = 0, sumDelta = 0;
        var trend;
        _.find(player.rankingHistory.reverse().slice(1), function(history) {
            delta = lastRanking - history.ranking;
            if (trend !== undefined && trend !== delta > 0) {
                return true;
            }
            trend = delta > 0;
            lastRanking = history.ranking;
            sumDelta += delta;
        });
        return sumDelta;
    };
    
    $.each(players, function(index, player) {
        var allPlayerStat = allPlayerStats[player.alias];
        player.matchesPlayed = allPlayerStat ? allPlayerStat.matches.played : 0;
        player.wonAvg = allPlayerStat ? (100 * (allPlayerStat.matches.won / allPlayerStat.matches.played)).toFixed(2) : 0;
        player.tiedAvg = allPlayerStat ? (100 * (allPlayerStat.matches.tied / allPlayerStat.matches.played)).toFixed(2) : 0;
        player.lostAvg = allPlayerStat ? (100 * (allPlayerStat.matches.lost / allPlayerStat.matches.played)).toFixed(2) : 0;

        player.delta = calculateDelta(player);
    })
    
}]);
