function afficherDate(dateSQLite) {

    // Vérifier que la date existe
    if (!dateSQLite) {
        return "—";
    }

    const date = new Date(
        dateSQLite.replace(" ", "T") + "Z"
    );

    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
        return "—";
    }

    const maintenant = new Date();

    const difference =
        maintenant.getTime() - date.getTime();

    const minutes = Math.floor(
        difference / (1000 * 60)
    );

    if (minutes < 1) {
        return "À l'instant";
    }

    if (minutes < 60) {
        return minutes + " min";
    }

    if (
        date.getFullYear() === maintenant.getFullYear() &&
        date.getMonth() === maintenant.getMonth() &&
        date.getDate() === maintenant.getDate()
    ) {

        return date.toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    const hier = new Date(maintenant);

    hier.setDate(
        maintenant.getDate() - 1
    );

    if (
        date.getFullYear() === hier.getFullYear() &&
        date.getMonth() === hier.getMonth() &&
        date.getDate() === hier.getDate()
    ) {

        return "Hier";
    }

    return date.toLocaleDateString(
        "fr-FR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


document.addEventListener("databaseReady", function () {

    db.transaction(function (tx) {
        tx.executeSql(`SELECT COUNT(*) AS nombre_depots
             FROM operations WHERE type_operation ='depot' 
             AND date(operations.date_operation, 'localtime') = 
             date('now','localtime')`, [],
            function (tx, result) {
                const place = document.getElementById("depotJour");
                const nombreDepots = result.rows.item(0).nombre_depots;
                place.textContent = nombreDepots;
            })
    })

    db.transaction(function (tx) {
        tx.executeSql(`SELECT COUNT(*) AS nombre_retraits FROM operations WHERE type_operation ='retrait' AND date(operations.date_operation, 'localtime') = date('now','localtime')`, [],
            function (tx, result) {
                const place = document.getElementById("retraitJour");
                const nombreRetraits = result.rows.item(0).nombre_retraits;
                place.textContent = nombreRetraits;
            })
    })

    db.transaction(function (tx) {
        tx.executeSql(`SELECT operations.type_operation, operations.montant, operations.date_operation, membres.nom, membres.prenom FROM operations INNER JOIN membres ON operations.id_membre = membres.id_membre WHERE date(operations.date_operation, 'localtime') = date('now','localtime') ORDER BY operations.date_operation DESC`, [],

            function (tx, result) {
                const tableau = document.getElementById("historiqueActivites");

                tableau.innerHTML = "";

                if (result.rows.length === 0) {
                    const ligne = document.createElement("tr");
                    const colonne = document.createElement("td");
                    colonne.colSpan = 4;

                    colonne.textContent = "Aucune activité récente.";
                    ligne.appendChild(colonne);

                    tableau.appendChild(ligne);

                    return;
                }

                for (let i = 0; i < result.rows.length;
                    i++) {

                    const activite = result.rows.item(i);
                    const ligne = document.createElement("tr");
                    const colonneActivite = document.createElement("td");

                    if (
                        activite.type_operation === "depot") {

                        colonneActivite.textContent = "Dépôt";
                    }

                    else if (
                        activite.type_operation === "retrait") {

                        colonneActivite.textContent = "Retrait";

                    }

                    else {
                        colonneActivite.textContent = activite.type_operation;
                    }

                    const colonneMembre = document.createElement("td");

                    colonneMembre.textContent = activite.nom + " " + activite.prenom;

                    const colonneMontant = document.createElement("td");

                    colonneMontant.textContent = Number(
                        activite.montant).toLocaleString(
                            "fr-FR") + " FBU";

                    const colonneDate = document.createElement("td");

                    colonneDate.textContent = afficherDate(
                        activite.date_operation);

                    ligne.appendChild(colonneActivite);

                    ligne.appendChild(colonneMembre);

                    ligne.appendChild(colonneMontant);

                    ligne.appendChild(colonneDate);

                    tableau.appendChild(ligne);

                }
            }
        )
    })
})



document.getElementById("menu-btn").addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        document.getElementById("menu-content").style.display =
            "block";

    }
);


document.getElementById("close-menu").addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        document.getElementById("menu-content").style.display =
            "none";

    }
);

document.addEventListener("click", function () {

    document.getElementById("menu-content").style.display =
        "none";

});
