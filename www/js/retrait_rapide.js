// =====================================================
// RECHERCHER UN MEMBRE ET AJOUTER UN DÉPÔT
// =====================================================

let membreSelectionne = null;


document.addEventListener("databaseReady", function () {

    // =================================================
    // RECHERCHE DU MEMBRE
    // =================================================

    const recherche =
        document.getElementById("numero-compte");

    recherche.addEventListener("submit", function (event) {

        event.preventDefault();

        const numeroCompte =
            document.getElementById("acount").value.trim();


        db.transaction(function (tx) {

            tx.executeSql(

                "SELECT * FROM membres WHERE compte = ?",

                [numeroCompte],

                function (tx, result) {

                    // Aucun membre trouvé
                    if (result.rows.length === 0) {

                        document.getElementById("error").textContent =
                            "Membre avec ce numéro de compte n'existe pas !";

                        return;
                    }


                    // Récupérer le membre
                    const membre =
                        result.rows.item(0);


                    // Garder le membre sélectionné
                    membreSelectionne =
                        membre;


                    // Afficher la partie dépôt
                    document.getElementById("tout-action").style.display =
                        "block";


                    // Afficher les informations
                    document.getElementById("membrePhoto").src =
                        membre.photo;

                    document.getElementById("membreNom").textContent =
                        membre.nom + " " + membre.prenom;

                    document.getElementById("membreCompte").textContent =
                        membre.compte;

                    document.getElementById("membreCni").textContent =
                        membre.cni;

                    document.getElementById("membreSolde").textContent =
                        membre.solde + " FBU";

                },

                function (tx, error) {

                    console.error(
                        "Erreur recherche membre :",
                        error.message
                    );

                }

            );

        });

    });


    // =================================================
    // AJOUTER LE DÉPÔT
    // =================================================

    const retirerMontant =
        document.getElementById("retirer-montant");


    retirerMontant.addEventListener("submit", function (event) {

        event.preventDefault();


        // Vérifier qu'un membre a été recherché
        if (membreSelectionne === null) {

            alert(
                "Veuillez d'abord rechercher un membre."
            );

            return;
        }


        // Récupérer l'ID et le solde
        const id =
            membreSelectionne.id_membre;

        const solde =
            Number(membreSelectionne.solde);


        // Récupérer le montant
        const montant =
            Number(
                document.getElementById("montant").value
            );


        // Vérifier le montant
        if (montant <= 0 || isNaN(montant)) {

            alert(
                "Veuillez entrer un montant valide."
            );

            return;
        }
        if (montant > solde) {

    alert(
        "Solde insuffisant."
    );

    return;
}


        // Calculer le nouveau solde
        const nouveauSolde =
            solde - montant;


        // Récupérer le motif
        const motif =
            document.getElementById("motif").value.trim();


        // =================================================
        // ENREGISTRER L'OPÉRATION
        // =================================================

        db.transaction(function (tx) {

            tx.executeSql(

                `INSERT INTO operations
                (
                    id_membre,
                    type_operation,
                    montant,
                    nouveau_solde,
                    motif
                )
                VALUES (?, ?, ?, ?, ?)`,

                [
                    id,
                    "retrait",
                    montant,
                    nouveauSolde,
                    motif
                ],

                function () {

                    // =====================================
                    // METTRE À JOUR LE SOLDE
                    // =====================================

                    tx.executeSql(

                        "UPDATE membres SET solde = ? WHERE id_membre = ?",

                        [
                            nouveauSolde,
                            id
                        ],

                        function () {

                            console.log(
                                "Montant retiré avec succès !"
                            );

                            alert(
                                "Retrait effectué avec succès !\n\n" +
                                "Montant : " + montant + " FBU\n" +
                                "Nouveau solde : " +
                                nouveauSolde + " FBU"
                            );


                            // Mettre à jour l'objet
                            membreSelectionne.solde =
                                nouveauSolde;


                            // Mettre à jour l'affichage
                            document.getElementById(
                                "membreSolde"
                            ).textContent =
                                nouveauSolde + " FBU";


                            // Vider le montant
                            document.getElementById(
                                "montant"
                            ).value = "";

                        },

                        function (tx, error) {

                            console.error(
                                "Erreur mise à jour solde :",
                                error.message
                            );

                        }

                    );

                },

                function (tx, error) {

                    console.error(
                        "Erreur enregistrement opération :",
                        error.message
                    );

                    alert(
                        "Erreur lors de l'enregistrement du retrait."
                    );

                }

            );

        });

    });

});

document.getElementById("retour").addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        history.back();
    }
);
