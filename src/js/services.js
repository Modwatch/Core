(function() { "use strict";

    angular.module("modwatchApp")

    .factory("Main", ["$http", function($http) {

      var api = "http://modwatchapi-ansballard.rhcloud.com";
      //api = "http://127.0.0.1:3001";

        return {

            getFile: function(username, filename, success, error) {
              $http.get(api + "/api/user/" + username + "/file/" + filename)
                .success(success)
                .error(error)
              ;
            },
            getProfile: function(username, success, error) {
              $http.get(api + "/api/user/" + username + "/profile")
                .success(success)
                .error(error)
              ;
            },
            getFileNames: function(username, success, error) {
              $http.get(api + "/api/user/" + username + "/files")
                .success(success)
                .error(error)
              ;
            },
            setTag: function(username, tag, success, error) {
              $http.post(api + "/api/newTag/" + username, {"tag": tag})
                .success(success)
                .error(error)
              ;
            },
            setENB: function(username, enb, success, error) {
              $http.post(api + "/api/newENB/" + username, {"enb": enb})
                .success(success)
                .error(error)
              ;
            },
            getUsers: function(success, error) {
              $http.get(api + "/api/users/list")
                .success(success)
                .error(error)
              ;
            },
            searchModlists: function(query, success, error) {
              $http.get(api + "/api/search/file/modlist/" + query)
                .success(success)
                .error(error)
              ;
            },
            searchPlugins: function(query, success, error) {
              $http.get(api + "/api/search/file/plugins/" + query)
                .success(success)
                .error(error)
              ;
            },
            signIn: function(username, password, success, error) {
              $http.post(api + "/auth/signin", {"username": username, "password": password})
                .success(success)
                .error(error)
              ;
            },
            checkToken: function(token, success, error) {
              $http.post(api + "/auth/checkToken", {"token": token})
                .success(success)
                .error(error)
              ;
            },
            upvote: function upvote(votee, token, success, error) {
              $http.post(api + "/auth/upvote/" + votee, {"token": token})
                .success(success)
                .error(error)
              ;
            },
            downvote: function downvote(votee, token, success, error) {
              $http.post(api + "/auth/downvote/" + votee, {"token": token})
                .success(success)
                .error(error)
              ;
            }
        };
    }]);
}());