document.addEventListener("deviceready", function () {

    console.log("Profil : Cordova est prêt");

    // ==========================================
    // AFFICHER LES INFORMATIONS DE L'ADMIN
    // ==========================================

    db.transaction(function (tx) {

        tx.executeSql(
            "SELECT * FROM utilisateur LIMIT 1",
            [],
            function (tx, result) {

                if (result.rows.length === 0) {

                    console.log("Aucun utilisateur trouvé.");

                    return;
                }

                const utilisateur = result.rows.item(0);

                document.getElementById("nomAdmin").textContent =
                    utilisateur.nom;

                document.getElementById("prenomAdmin").textContent =
                    utilisateur.prenom;

                document.getElementById("photoAdmin").src =
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

    //FAIRE APPARAITRE LE FORMULAIRE POUR AJOUTER NOTE
  const boutonAjouter = document.getElementById("ajouterNote");
  boutonAjouter.addEventListener("click",

    function(event){
        event.stopPropagation();

          document.getElementById("carteAjouter").style.display = "block";
          document.getElementById("ajouterNote").style.display = "none";
    });


    // ==========================================
    // FORMULAIRE AJOUTER UNE NOTE
    // ==========================================

    const formulaire =
        document.getElementById("formulaire");


    if (formulaire) {

        formulaire.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const title =
                    document.getElementById("title").value.trim();

                const contenu =
                    document.getElementById("contenu").value.trim();

                const photoInput =
                    document.getElementById("photo");


                if (title === "" || contenu === "") {

                    alert(
                        "Veuillez remplir le titre et le contenu."
                    );

                    return;
                }


                const fichier = photoInput.files[0];


                // ==================================
                // SANS PHOTO
                // ==================================

                if (!fichier) {

                    enregistrerNote(
                        title,
                        contenu,
                        ""
                    );

                    return;
                }


                // ==================================
                // AVEC PHOTO
                // ==================================

                const lecteur = new FileReader();


                lecteur.onload = function () {

                    const photo = lecteur.result;

                    enregistrerNote(
                        title,
                        contenu,
                        photo
                    );

                };


                lecteur.readAsDataURL(fichier);

            }
        );

    }


    // ==========================================
    // AFFICHER LES NOTES
    // ==========================================

    afficherNotes();

});


// =====================================================
// ENREGISTRER UNE NOTE
// =====================================================

function enregistrerNote(title, contenu, photo) {

    db.transaction(function (tx) {

        tx.executeSql(
            "INSERT INTO notes (title, contenu, photo) VALUES (?, ?, ?)",
            [title, contenu, photo],

            function () {

                console.log("Note enregistrée");

                afficherNotes();

            },

            function (tx, error) {

                console.error(
                    "Erreur enregistrement note :",
                    error.message
                );

            }
        );

    });

}


// =====================================================
// AFFICHER LES NOTES
// =====================================================

function afficherNotes() {

    db.transaction(function (tx) {

        tx.executeSql(
            "SELECT * FROM notes ORDER BY date_note DESC",
            [],

            function (tx, result) {

                const listeNotes =
                    document.getElementById("listeNotes");


                if (!listeNotes) {

                    console.error(
                        "L'élément listeNotes n'existe pas dans HTML."
                    );

                    return;
                }


                listeNotes.innerHTML = "";


                if (result.rows.length === 0) {

                    listeNotes.innerHTML =
                        "<p>Aucune note enregistrée.</p>";

                    return;
                }


                for (
                    let i = 0;
                    i < result.rows.length;
                    i++
                ) {

                    const note =
                        result.rows.item(i);


                    const article =
                        document.createElement("article");


                    article.classList.add("note");


                    article.innerHTML = `
                        <h3>${note.title}</h3>
                        <p>${note.contenu}</p>
                    `;


                    if (note.photo) {

                        const image =
                            document.createElement("img");

                        image.src = note.photo;

                        image.alt = note.title;

                        article.appendChild(image);
                    }


                    const date =
                        document.createElement("small");

                    date.textContent =
                        note.date_note;


                    article.appendChild(date);


                    listeNotes.appendChild(article);

                }

            },

           
        );

    });

}

