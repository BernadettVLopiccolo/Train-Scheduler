$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyCPw1sNdgaRhkNuV7f57yv_vgTvletlT5c",
        authDomain: "trainscheduler-77baa.firebaseapp.com",
        databaseURL: "https://trainscheduler-77baa.firebaseio.com",
        projectId: "trainscheduler-77baa",
        storageBucket: "trainscheduler-77baa.appspot.com",
        messagingSenderId: "158164866507"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    $("#subTrain").on("click", function(event) {
        event.preventDefault();

        var trainName = $("#name").val().trim();
        var destination = $("#dest").val().trim();
        var firstTrainTime = $("#firstTTime").val().trim();
        var frequency = $("#freq").val().trim();


        var firstTimeConverted = moment(firstTrainTime, "hh:mm A").subtract(1, "years");
        console.log(firstTimeConverted);

        var currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("hh:mm A"));

        var diffTime = moment(). diff(moment(firstTimeConverted), "minutes");
        console.log("Difference in Time:" +  diffTime);

        var timeRemainder = diffTime % frequency;
        console.log(timeRemainder);

        var minutesTillTrain = frequency - timeRemainder;
        console.log("Minutes Till Train: " + minutesTillTrain);

        var nextTrain = moment().add(minutesTillTrain, "minutes");
        var nextTrainFormatted = moment(nextTrain).format("hh:mm A");

        var newTrain = {
            name: trainName,
            station: destination,
            fTrain: firstTrainTime,
            frequ: frequency,
            nextTrainFormatted: nextTrainFormatted,
            minutesTillTrain: minutesTillTrain

        };

        database.ref().push(newTrain);
        console.log(newTrain.name);
        console.log(newTrain.station);
        console.log(newTrain.fTrain);
        console.log(newTrain.frequ);

        $("#name").val("");
        $("#dest").val("");
        $("#firstTTime").val("");
        $("#freq").val("");

        // after clicking ok on alert, value still prepends on page 
        if (trainName == "" || destination == "" || firstTrainTime == "" || frequency == "") {
            $("#subTrain").prop("disabled", true);
            alert("Please Fill All Required Field");
            return false;
        }

    });

    database.ref().on("child_added", function(childSnapshot, prevChildKey) {
        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().station;
        var firstTrainTime = childSnapshot.val().fTrain;
        var frequency = childSnapshot.val().frequ;
        var minutesTillTrain = childSnapshot.val().minutesTillTrain;

        console.log(trainName);
        console.log(destination);
        console.log(firstTrainTime);
        console.log(frequency);

        
        $(".table > tbody").prepend("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + firstTrainTime + "</td><td>" + minutesTillTrain + "</td><td>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" +  "</td></tr>");

    });
    $("body").on("click", ".remove-train", function() {
        $(this).closest("tr").remove();
        getKey = $(this).parent().parent().attr("id");
        database.ref().child(getKey).remove();
    });
    //when I refresh, removed train row comes back, also error from firebase
    //remove data value from firebase?



});