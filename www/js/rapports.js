//OUVRIR ET FERMER LE CONTENU MENU
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

//FONCTION QUI FERME TOUS LES LES TABLEAUX
function fermerTousLesTableaux(){
    document.getElementById("depotTable").style.display = "none";
    document.getElementById("retraitTable").style.display = "none"
    document.getElementById("membreTable").style.display = "none";
    document.getElementById("tableGeneral").style.display = "none";
}

//FONCTION QUI OUVRE SEULEMENT LE TABLEAU HISTORIQUE GENERAL
function ouvrirHistoriqueGeneral(){
    document.getElementById("tableGeneral").style.display = "block";
}

//FAIRE APPARAITRE LE TABLEAU HISTORIQUE DE DEPOTS
document.getElementById("showDepot").addEventListener("click",
    function (event) {

        event.stopPropagation();

        fermerTousLesTableaux();

        document.getElementById("depotTable").style.display = "block";

    }
);


//FAIRE APPARAITRE LE TABLEAU HISTORIQUE DE RETRAITS
document.getElementById("showRetrait").addEventListener("click",
    function (event) {
        event.stopPropagation();

        fermerTousLesTableaux();

        document.getElementById("retraitTable").style.display = "block";

    }
);


//FAIRE APPARAITRE LE TABLEAU HISTORIQUE DE MEMBRES AJOUTEES PAR JOUR
document.getElementById("showMembres").addEventListener("click",
    function (event) {

        event.stopPropagation();

        fermerTousLesTableaux();

        document.getElementById("membreTable").style.display = "block";

    }
);

//ECOUTEUR SI ON CLIQUE AILLEUR
document.addEventListener("click", function(){

    fermerTousLesTableaux();
    ouvrirHistoriqueGeneral();
});

//DECRARATION DE VARIABLES POUR AFFICHAGE ET SELECTION DE LA DATE A AFFICHER

const dateSelect = document.getElementById("date-select");
const ouvrirCalendrier = document.getElementById("ouvrir-calendrier");
const dateJour = document.getElementById("date-jour");
let dateRapport;

function formaterDateSQLite(date) {
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, "0");
    const jour = String(date.getDate()).padStart(2, "0");
    return `${annee}-${mois}-${jour}`;

}

// DATE DU JOUR
const aujourdHui = new Date();
dateRapport = aujourdHui;

const options = {
    day: "numeric",
    month: "long",
    year: "numeric"
};
dateJour.textContent = aujourdHui.toLocaleDateString("fr-FR", options);

//AFFICHER LA CALENDRIER
ouvrirCalendrier.addEventListener("click",
    function () {
        dateSelect.showPicker();
    }
)

//QUAND UNE DATE EST CHOISIE PAR L'UTILISATEUR
dateSelect.addEventListener("change", function () {

    const dateChoisie = new Date(this.value);

    dateRapport = dateChoisie; //DONNE LE NOUVEAU VALEUR AU VARIABLE

    dateJour.textContent = dateChoisie.toLocaleDateString("fr-FR",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    chargerDepots();
    chargerRetraits();
    chargerMembres();
    chargerHistoriqueDepot();
    chargerHistoriqueRetrait();
    chargerHistoriqueMembre();
    chargerHistoriqueGeneral();
});


//CHERCHER ET COMPTER LE NOMBRE DE DEPOT PAR JOUR
function chargerDepots() {

    db.transaction(function (tx) {

        tx.executeSql(`SELECT COUNT(*) AS nombre_depots FROM operations
        WHERE type_operation = 'depot' AND date(operations.date_operation, 'localtime') = ? `,
            [formaterDateSQLite(dateRapport)],

            function (tx, result) {
                const place = document.getElementById("depotJour");
                const nombreDepots = result.rows.item(0).nombre_depots;
                place.textContent = nombreDepots;
            });
    });
}

//CHERCHER ET COMPTER LE NOMBRE DE RETRAIT PAR JOUR
function chargerRetraits() {

    db.transaction(function (tx) {

        tx.executeSql(`SELECT COUNT(*) AS nombre_retraits FROM operations
        WHERE type_operation = 'retrait' AND date(operations.date_operation, 'localtime') = ? `,
            [formaterDateSQLite(dateRapport)],

            function (tx, result) {
                const place = document.getElementById("retraitJour");
                const nombreRetraits = result.rows.item(0).nombre_retraits;
                place.textContent = nombreRetraits;
            });
    });
}

//CHERCHER ET COMPTER LE NOMBRE DE MEMBRES
function chargerMembres() {
    db.transaction(function (tx) {

        tx.executeSql(`SELECT COUNT(*) AS nombres_membres FROM MEMBRES
             WHERE date(membres.date_ajout, "localtime") = ?`,
            [formaterDateSQLite(dateRapport)],
            function (tx, result) {
                const place = document.getElementById("nombreMembres");
                const totalMembres = result.rows.item(0).nombres_membres;
                place.textContent = totalMembres;

            });

    });
}

//CHERCHER ET COMPTER LE SOLDE TOTAL AU COMPTE
function chargerSolde() {
    db.transaction(function (tx) {

        tx.executeSql(`SELECT SUM(solde) AS solde_total FROM membres`, [],
            function (tx, result) {
                const place = document.getElementById("soldeTotal");
                const resultatSolde = result.rows.item(0).solde_total;
                place.textContent = Number( resultatSolde).toLocaleString("fr-FR") + " FBU";
            }
        )

    });
}

// CHARGER L'HISTORIQUE DU DEPOT JOUR SELECTIONNE
function chargerHistoriqueDepot() {
    db.transaction(function (tx) {
        tx.executeSql(`SELECT 
            operations.type_operation,
            operations.montant,
            operations.date_operation,
            membres.nom,
            membres.prenom
            FROM operations
            INNER JOIN membres ON operations.id_membre =  membres.id_membre
            WHERE operations.type_operation = "depot" AND 
            date(operations.date_operation, 'localtime') = ?
            ORDER BY operations.date_operation DESC
            `, [formaterDateSQLite(dateRapport)],

            function (tx, result) {

                const tableau = document.getElementById("historiqueDepots");
                tableau.innerHTML = "";

                if (result.rows.length === 0) {
                    const ligne = document.createElement("tr");
                    const colonne = document.createElement("td");
                    colonne.colSpan = 4;
                    colonne.textContent = "Aucune depot aujourd'hui";
                    ligne.appendChild(colonne);
                    tableau.appendChild(ligne);
                    return;
                }

                for (let i = 0; i < result.rows.length; i++) {

                    const activite = result.rows.item(i);
                    const ligne = document.createElement("tr");
                    const colonneActivite = document.createElement("td");

                    if (activite.type_operation === "depot") {
                        colonneActivite.textContent = "Depot";
                    } else {
                        colonneActivite.textContent = "Inconnue";
                    }

                    const colonneMembre = document.createElement("td");
                    colonneMembre.textContent = activite.nom + " " + activite.prenom;

                    const colonneMontant = document.createElement("td");
                    colonneMontant.textContent = Number(activite.montant).toLocaleString("fr-FR") + " FBU";

                    const colonneDate = document.createElement("td");
                    const heure = activite.date_operation.substring(11, 16);
                    colonneDate.textContent = heure;

                    ligne.appendChild(colonneActivite);
                    ligne.appendChild(colonneMembre);
                    ligne.appendChild(colonneMontant);
                    ligne.appendChild(colonneDate);
                    tableau.appendChild(ligne);

                }
            });
    });
}

//CHARGER L'HISTORIQUE DU RETRAIT AU JOUR SELECTIONNE
function chargerHistoriqueRetrait() {
    db.transaction(function (tx) {

        tx.executeSql(`SELECT 
            operations.type_operation,
            operations.montant,
            operations.date_operation,
            membres.nom,
            membres.prenom
            FROM operations
            INNER JOIN membres ON operations.id_membre = membres.id_membre
            WHERE operations.type_operation = "retrait" AND date(operations.date_operation, 'localtime') = ? 
            ORDER BY date_operation DESC`, 
            [formaterDateSQLite(dateRapport)],
        function(tx, result){

            const tableau = document.getElementById("historiqueRetraits");
            tableau.innerHTML = "";
            
            if(result.rows.length === 0){
                const ligne = document.createElement("tr");
                const colonne = document.createElement("td");

                colonne.colSpan = 4;
                colonne.textContent = "Aucune depots enregistre";

                ligne.appendChild(colonne);
                tableau.appendChild(ligne);
                return;
            }
            for(let i = 0; i < result.rows.length; i++){
                const activite = result.rows.item(i);
                const ligne = document.createElement("tr");
                const colonneOperation = document.createElement("td");

                if(activite.type_operation === "retrait"){
                    colonneOperation.textContent = "Retrait";
                }else{
                    colonneOperation.textContent = "Autres";
                }

                const colonneMembre = document.createElement("td");
                colonneMembre.textContent = activite.nom + " " + activite.prenom;

                const colonneMontant = document.createElement("td");
                colonneMontant.textContent = Number(activite.montant).toLocaleString("fr-FR") + " FBU";

                const colonneDate = document.createElement("td");
                const heure = activite.date_operation.substring(11, 16);
                colonneDate.textContent = heure;

                ligne.appendChild(colonneOperation);
                ligne.appendChild(colonneMembre);
                ligne.appendChild(colonneMontant);
                ligne.appendChild(colonneDate);
                tableau.appendChild(ligne);

            }           
        })
    })
}

//CHARGER LES MEMBRES AJOUTE PAR JOUR SELECTIONNE
function chargerHistoriqueMembre(){
    db.transaction(function(tx){
        tx.executeSql(`SELECT nom, prenom, date_ajout FROM membres
            WHERE date(date_ajout, 'localtime') = ? ORDER BY date_ajout DESC`,
        [formaterDateSQLite(dateRapport)], 
    function(tx, result){

        const tableau = document.getElementById("historiqueMembres");
        tableau.innerHTML = "";

        if(result.rows.length === 0){
            const ligne = document.createElement("tr");
            const colonne = document.createElement("td");

            colonne.colSpan = 2 ;
            colonne.textContent = "Aucun membre!";

            ligne.appendChild(colonne);
            tableau.appendChild(ligne);

            return;

        }

        for(let i = 0; i < result.rows.length; i++){
            const activite = result.rows.item(i);
            const ligne = document.createElement("tr");

            const colonneMembre = document.createElement("td");
            colonneMembre.textContent = activite.nom + " " + activite.prenom ;
            
            const colonneDate = document.createElement("td");
            colonneDate.textContent = activite.date_ajout.substring(11, 16);

            ligne.appendChild(colonneMembre);
            ligne.appendChild(colonneDate);
            tableau.appendChild(ligne);
            
        }
    });
  });
}

//CHARGER L'HISTORIQUE GENERAL
function chargerHistoriqueGeneral(){
    db.transaction(function(tx){
        tx.executeSql(`SELECT * FROM (SELECT 'ajout_membre' AS type_activite, NULL AS montant,
            membres.nom, membres.prenom, membres.date_ajout AS date_activite FROM membres 
            
            UNION ALL
            
            SELECT operations.type_operation AS type_activite, operations.montant, membres.nom,
            membres.prenom, operations.date_operation AS date_activite FROM operations INNER JOIN
            membres ON operations.id_membre = membres.id_membre) WHERE date(date_activite, 'localtime') = ?
            ORDER BY date_activite DESC`, [formaterDateSQLite(dateRapport)],
            
            function(tx, result){
                const tableau = document.getElementById("historiqueActivites");
                tableau.innerHTML = "";

                if(result.rows.length === 0){
                    const ligne = document.createElement("tr")
                    const colonne = document.createElement("td");

                    colonne.colSpan = 4;
                    colonne.textContent = "Pas d'operations!."

                    ligne.appendChild(colonne);
                    tableau.appendChild(ligne);
                    return;
                }

                for(let i = 0; i < result.rows.length; i++){
                    const activite = result.rows.item(i);

                    const ligne = document.createElement("tr");

                    const colonneOperation = document.createElement("td")
                    if(activite.type_activite === "ajout_membre"){
                        colonneOperation.textContent = "Ajout membre";
                    }else if(activite.type_activite === "depot"){
                        colonneOperation.textContent = "Depot";
                    }else if(activite.type_activite === "retrait"){
                        colonneOperation.textContent = "Retrait";
                    }else{
                        colonneOperation.textContent = activite.type_activite;
                    }

                    const colonneMembre = document.createElement("td");
                    colonneMembre.textContent = activite.nom + " " + activite.prenom;

                    const colonneMontant = document.createElement("td");
                    if(activite.montant === null){
                        colonneMontant.textContent = "—";
                    }else{
                        colonneMontant.textContent =  Number(activite.montant).toLocaleString("fr-FR") + " FBU";
                    }

                    const colonneDate = document.createElement("td");
                    colonneDate.textContent = activite.date_activite.substring(11, 16);

                    ligne.appendChild(colonneOperation);
                    ligne.appendChild(colonneMembre);
                    ligne.appendChild(colonneMontant);
                    ligne.appendChild(colonneDate);
                    tableau.appendChild(ligne);
                }
            }
        )
    })
}

//OUVRIR LA BASE DE DONNEES POUR COMMENCER A EXPLORER LES DONNES
document.addEventListener("databaseReady", function () {
    chargerDepots(); //APPELER LA FONCTION DE DEPOTS
    chargerRetraits();  //APPELER LA FONCTION DE RETRAITS
    chargerMembres();  //APPELER LA FONCTION DE MEMBRES
    chargerSolde(); //APPELER LA FONCTION DE SOLDE TOTAL
    chargerHistoriqueDepot();
    chargerHistoriqueRetrait();
    chargerHistoriqueMembre();
    chargerHistoriqueGeneral();

});



