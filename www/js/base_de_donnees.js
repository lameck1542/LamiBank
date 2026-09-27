// =====================================================
// BASE DE DONNÉES LAMIBANK
// =====================================================

// Variable globale
let db;


// =====================================================
// CORDOVA PRÊT
// =====================================================

document.addEventListener("deviceready", function () {

    console.log("Cordova est prêt");


    // -------------------------------------------------
    // OUVRIR SQLITE
    // -------------------------------------------------

    db = window.sqlitePlugin.openDatabase({

        name: "lamibank.db",

        location: "default"

    });


    console.log("SQLite ouverte");


    // -------------------------------------------------
    // CRÉER LES TABLES
    // -------------------------------------------------

    db.transaction(

        function (tx) {


            // =============================================
            // TABLE UTILISATEUR
            // =============================================

            tx.executeSql(`

                CREATE TABLE IF NOT EXISTS utilisateur (

                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                    nom TEXT NOT NULL,

                    prenom TEXT NOT NULL,

                    photo TEXT

                )

            `);


            // =============================================
            // TABLE MEMBRES
            // =============================================

            tx.executeSql(`

                CREATE TABLE IF NOT EXISTS membres (

                    id_membre INTEGER PRIMARY KEY AUTOINCREMENT,

                    photo TEXT,

                    nom TEXT NOT NULL,

                    prenom TEXT NOT NULL,

                    sexe TEXT NOT NULL,

                    date_naissance TEXT NOT NULL,

                    lieu_naissance TEXT NOT NULL,

                    telephone TEXT NOT NULL,

                    adresse TEXT NOT NULL,

                    cni TEXT NOT NULL,
                    solde REAL  DEFAULT 0.00,
                    compte TEXT,
                    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP

                )

            `);
       
       tx.executeSql(' CREATE TABLE IF NOT EXISTS operations(id_operation INTEGER PRIMARY KEY AUTOINCREMENT, type_operation TEXT NOT NULL,id_membre INTEGER NOT NULL, montant REAL NOT NULL, nouveau_solde REAL NOT NULL, motif,date_operation TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');


            // =============================================
            // TABLE NOTES
            // =============================================

            tx.executeSql(`

                CREATE TABLE IF NOT EXISTS notes (

                    id_note INTEGER PRIMARY KEY AUTOINCREMENT,

                    title TEXT NOT NULL,

                    contenu TEXT NOT NULL,

                    photo TEXT,

                    date_note TIMESTAMP DEFAULT CURRENT_TIMESTAMP

                )

            `);

        },


        // -------------------------------------------------
        // ERREUR
        // -------------------------------------------------

        function (error) {

            console.error(
                "Erreur création des tables :",
                error.message
            );

        },


        // -------------------------------------------------
        // BASE PRÊTE
        // -------------------------------------------------

        function () {

            console.log(
                "Toutes les tables SQLite sont prêtes."
            );


            // Signaler aux autres fichiers que SQLite est prête

            document.dispatchEvent(
                new Event("databaseReady")
            );

        }

    );

});
