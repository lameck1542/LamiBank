// =====================================================
// DÉMARRAGE DE LAMIBANK
// =====================================================

document.addEventListener("databaseReady", function () {

    console.log(
        "Base de données prête."
    );


    // =================================================
    // RECHERCHER LE GESTIONNAIRE
    // =================================================

    db.transaction(function (tx) {

        tx.executeSql(

            "SELECT * FROM utilisateur LIMIT 1",

            [],


            function (tx, result) {


                // =====================================
                // AUCUN GESTIONNAIRE
                // =====================================

                if (result.rows.length === 0) {

                    console.log(
                        "Aucun gestionnaire enregistré."
                    );


                    window.location.href =
                        "register.html";


                    return;
                }


                // =====================================
                // GESTIONNAIRE TROUVÉ
                // =====================================

                const utilisateur =
                    result.rows.item(0);


                console.log(
                    "Gestionnaire trouvé :",
                    utilisateur.nom,
                    utilisateur.prenom
                );


                // Aller directement à l'accueil

                window.location.href =
                    "accueil.html";

            },


            function (tx, error) {

                console.error(
                    "Erreur lecture utilisateur :",
                    error.message
                );

            }

        );

    });

});
