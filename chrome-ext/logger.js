var config = {
    apiKey: "AIzaSyDMgxaqKKFMnfXqoxkHV15oIPv36yLcL0c",
    authDomain: "greylock-167d7.firebaseapp.com",
    databaseURL: "https://greylock-167d7.firebaseio.com",
    storageBucket: "",
};

firebase.initializeApp(config);

$("button, a, input").each(function(index, object) {
    $(object).on("focus click dblclick select submit keypress", function(e) {
        console.log("performed", e.type, "on", object);
        var action = {
            action: e.type,
            element: $(object).get(0).outerHTML,
            timestamp: Date.now(),
            
        };

        // Get a key for a new Post.
        return firebase.database().ref().child('actions').push().set(action);
    });
});

