// =====================================================
// AFFICHER LA DATE DES ACTIVITÉS
// =====================================================

function afficherDate(dateSQLite) {

    // Vérifier que la date existe
    if (!dateSQLite) {
        return "—";
    }

    // SQLite donne une date UTC :
    // 2026-09-04 14:00:00
    //
    // On la transforme en :
    // 2026-09-04T14:00:00Z
    //
    // Le Z signifie UTC.
    const date = new Date(
        dateSQLite.replace(" ", "T") + "Z"
    );

    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
        return "—";
    }

    const maintenant = new Date();


    // =================================================
    // DIFFÉRENCE ENTRE MAINTENANT ET L'ACTIVITÉ
    // =================================================

    const difference =
        maintenant.getTime() - date.getTime();

    const minutes = Math.floor(
        difference / (1000 * 60)
    );


    // =================================================
    // MOINS D'UNE MINUTE
    // =================================================

    if (minutes < 1) {
        return "À l'instant";
    }


    // =================================================
    // MOINS D'UNE HEURE
    // =================================================

    if (minutes < 60) {
        return minutes + " min";
    }


    // =================================================
    // AUJOURD'HUI
    // =================================================

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


    // =================================================
    // HIER
    // =================================================

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


    // =================================================
    // DATE PLUS ANCIENNE
    // =================================================

    return date.toLocaleDateString(
        "fr-FR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


// =====================================================
// CORDOVA — ACCUEIL
// =====================================================

document.addEventListener(
    "deviceready",
    function () {

        console.log(
            "Accueil : Cordova est prêt"
        );


        // =================================================
        // INFORMATIONS DE L'UTILISATEUR
        // =================================================

        db.transaction(function (tx) {

            tx.executeSql(
                "SELECT * FROM utilisateur LIMIT 1",

                [],

                function (tx, result) {

                    // Aucun utilisateur
                    if (result.rows.length === 0) {

                        console.log(
                            "Aucun utilisateur trouvé."
                        );

                        return;
                    }


                    // Récupérer l'utilisateur
                    const utilisateur =
                        result.rows.item(0);


                    // Nom
                    document.getElementById(
                        "nomUtilisateur"
                    ).textContent =
                        utilisateur.nom;


                    // Prénom
                    document.getElementById(
                        "prenomUtilisateur"
                    ).textContent =
                        utilisateur.prenom;


                    // Photo
                    document.getElementById(
                        "photoUtilisateur"
                    ).src =
                        utilisateur.photo;
                },


                function (tx, error) {

                    console.error(
                        "Erreur lecture utilisateur :",
                        error.message
                    );
                }
            );

        });



        // =================================================
        // ACTIVITÉS RÉCENTES
        // =================================================

        db.transaction(function (tx) {
            tx.executeSql(`SELECT * FROM ( SELECT 'ajout_membre' AS type_activite, NULL AS montant,
               membres.nom, membres.prenom, membres.date_ajout AS date_activite FROM membres 
               
               UNION ALL

               SELECT operations.type_operation AS type_activite, operations.montant, membres.nom,
               membres.prenom, operations.date_operation AS date_activite FROM operations
               INNER JOIN membres ON operations.id_membre = membres.id_membre )

               ORDER BY date_activite DESC LIMIT 10`, [],

               function (tx, result) {
                
                // Récupérer le tableau
                    const tableau = document.getElementById("historiqueActivites");

                    // Vider le tableau
                    tableau.innerHTML = "";

                    // SI AUCUNE ACTIVITE
                    if (result.rows.length === 0) {
                     const ligne = document.createElement("tr");
                     const colonne = document.createElement("td");

                     colonne.colSpan = 4;
                     colonne.textContent = "Aucune activité récente.";

                     ligne.appendChild(colonne);

                     tableau.appendChild(ligne);
                    return;
                    }



                    // =================================================
                    // PARCOURIR LES ACTIVITÉS
                    // =================================================

                    for ( let i = 0; i < result.rows.length; i++ ) {
                    // Récupérer l'activité
                    const activite = result.rows.item(i);

                    // Créer une ligne
                    const ligne = document.createElement("tr");

                   // ACTIVITÉ
                    const colonneActivite = document.createElement("td");

                    if ( activite.type_activite === "ajout_membre") {
                     colonneActivite.textContent = "Ajout membre";
                    }
                    else if ( activite.type_activite === "depot") {
                     colonneActivite.textContent = "Dépôt";
                    }
                    else if ( activite.type_activite === "retrait") {
                     colonneActivite.textContent = "Retrait";
                     }
                     else {
                       colonneActivite.textContent = activite.type_activite;
                        }

                    // MEMBRE
                    const colonneMembre = document.createElement("td");

                    colonneMembre.textContent = activite.nom + " " + activite.prenom;

                    // MONTANT
                    const colonneMontant = document.createElement("td");

                        if ( activite.montant === null ) {

                    // Pour ajout membre
                    colonneMontant.textContent = "—";
                     }
                      else {
                         colonneMontant.textContent = Number( activite.montant).toLocaleString("fr-FR") + " FBU";
                        }

                    // DATE
                    const colonneDate = document.createElement("td");

                    // Utiliser notre fonction
                    colonneDate.textContent = afficherDate( activite.date_activite );

                   // AJOUTER LES COLONNES

                   ligne.appendChild(colonneActivite);

                   ligne.appendChild( colonneMembre );

                   ligne.appendChild( colonneMontant );

                   ligne.appendChild( colonneDate );

                 // Ajouter la ligne au tableau
                tableau.appendChild(ligne);
                    }
                },


                // =================================================
                // ERREUR SQL
                // =================================================

                function (tx, error) {

                    console.error(
                        "Erreur récupération activités :",
                        error.message
                    );
                }
            );

        });

    }
);



// =====================================================
// MENU
// =====================================================

document.getElementById(
    "menu-btn"
).addEventListener(
    "click",
    function (event) {

        // Empêcher le clic de se propager
        event.stopPropagation();


        document.getElementById(
            "menu-content"
        ).style.display = "block";
    }
);



// =====================================================
// FERMER LE MENU
// =====================================================

document.getElementById("close-menu").addEventListener("click",
    function () {
   document.getElementById(
            "menu-content"
        ).style.display = "none";
    }
);



// =====================================================
// FERMER LE MENU EN CLIQUANT AILLEURS
// =====================================================

document.addEventListener(
    "click",
    function () {

        document.getElementById(
            "menu-content"
        ).style.display = "none";
    }
);



// =====================================================
// DATE DU JOUR
// =====================================================

const aujourdHui =
    new Date();


const options = {

    weekday: "long",

    day: "numeric",

    month: "long",

    year: "numeric"
};


document.getElementById(
    "dateJour"
).textContent =
    aujourdHui.toLocaleDateString(
        "fr-FR",
        options
    );



// Détecter l'ouverture et la fermeture du clavier
const hauteurInitiale = window.innerHeight;

window.addEventListener("resize", function () {

    const hauteurActuelle = window.innerHeight;

    if (hauteurInitiale - hauteurActuelle > 150) {

        document.body.classList.add("clavier-ouvert");

    } else {

        document.body.classList.remove("clavier-ouvert");

    }

});
