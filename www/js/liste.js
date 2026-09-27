// =====================================================
// MENU                                           // =====================================================

document.getElementById("menu-btn").addEventListener(
    "click",                                          function (event) {
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


// =====================================================
// ATTENDRE SQLITE
// =====================================================

document.addEventListener("databaseReady", function () {

    console.log(
        "Base de données prête pour la liste."
    );

    afficherMembres();

});


// =====================================================
// AFFICHER LES MEMBRES
// =====================================================

function afficherMembres() {

    const conteneur =
        document.getElementById("liste-membres");


    conteneur.innerHTML = "";


    db.transaction(function (tx) {

        tx.executeSql(

            `SELECT
                id_membre,
                photo,
                nom,
                prenom,
                sexe,
                date_naissance,
                lieu_naissance,
                telephone,
                adresse,
                cni
             FROM membres
             ORDER BY id_membre DESC`,

            [],


            function (tx, resultat) {

                console.log(
                    "Nombre de membres :",
                    resultat.rows.length
                );


                // =================================================
                // AUCUN MEMBRE
                // =================================================

                if (resultat.rows.length === 0) {

                    conteneur.innerHTML = `

                        <div class="aucun-membre">

                            <i class="fa-solid fa-user-group"></i>

                            <h3>Aucun membre</h3>

                            <p>
                                Aucun membre enregistré.
                            </p>

                        </div>

                    `;

                    return;
                }


                // =================================================
                // AFFICHER LES MEMBRES
                // =================================================

                for (
                    let i = 0;
                    i < resultat.rows.length;
                    i++
                ) {

                    const membre =
                        resultat.rows.item(i);


                    const carte =
                        document.createElement("div");


                    carte.className =
                        "carte-membre";


                    carte.innerHTML = `

                        <div class="photo-membre">

                            <img
                                src="${membre.photo}"
                                alt="Photo de ${membre.nom}"
                            >

                        </div>


                        <div class="infos-membre">

                            <h3>
                                ${membre.nom}
                                ${membre.prenom}
                            </h3>


                            <p>

                                <i class="fa-solid fa-phone"></i>

                                ${membre.telephone}

                            </p>


                            <p>

                                <i class="fa-solid fa-id-card"></i>

                                ${membre.cni}

                            </p>

                        </div>


                        <div class="action-membre">

                            <button
                                class="profil-btn"
                                data-id="${membre.id_membre}"
                            >

                                <i class="fa-solid fa-eye"></i>

                            </button>

                        </div>

                    `;


                    conteneur.appendChild(carte);

                }

document.getElementById("chargement").style.display = "none";

  const boutons = document.querySelectorAll(".profil-btn");
  
  boutons.forEach(function(bouton){
	bouton.addEventListener("click",
	function(){
		const id = bouton.dataset.id;
		
		window.location.href = "profil.html?id=" + id;
	});
  });

            },


            function (tx, erreur) {

                console.error(
                    "Erreur récupération membres :",
                    erreur.message
                );


                conteneur.innerHTML = `

                    <div class="aucun-membre">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                        <p>
                            Impossible de charger les membres.
                        </p>

                    </div>

                `;

            }

        );

    });

}
