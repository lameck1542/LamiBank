// =====================================================
// AJOUTER UN MEMBRE
// =====================================================

document.addEventListener("databaseReady", function () {

    console.log("Base de données prête pour ajouter un membre.");

    const formulaire = document.getElementById("form-membre");

    formulaire.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("Formulaire envoyé");


        // =================================================
        // RÉCUPÉRER LES CHAMPS
        // =================================================

        const photoInput =
            document.getElementById("photo");

        const nom =
            document.getElementById("nom").value.trim();

        const prenom =
            document.getElementById("prenom").value.trim();

        const sexe =
            document.getElementById("sexe").value;

        const dateNaissance =
            document.getElementById("date_naissance").value.trim();

        const lieuNaissance =
            document.getElementById("lieu-naissance").value.trim();

        const telephone =
            document.getElementById("telephone").value.trim();

        const adresse =
            document.getElementById("adresse").value.trim();

        const cni =
            document.getElementById("cni").value.trim();


        // =================================================
        // VÉRIFICATION
        // =================================================

        if (
            nom === "" ||
            prenom === "" ||
            sexe === "" ||
            dateNaissance === "" ||
            lieuNaissance === "" ||
            telephone === "" ||
            adresse === "" ||
            cni === ""
        ) {

            alert("Veuillez remplir tous les champs.");

            return;
        }


        let photo = "../assets/images/profil.jpg";

    // ========VÉRIFIER QUE LA PHOTO EST SELECTIONNE AVANT DUTULISER LA FOTO EXISTE
    if (photoInput.files.length > 0){
     const fichier = photoInput.files[0];

    const lecteur = new FileReader();


    // =======LECTURE DE LA PHOTO

    lecteur.onload = function () {

    const photo = lecteur.result;

   // ==== INSERTION SQLITE

    db.transaction(function (tx) {

     tx.executeSql(`INSERT INTO membres(photo, nom, prenom, sexe, date_naissance, lieu_naissance, telephone, adresse, cni)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [photo, nom, prenom, sexe, dateNaissance, lieuNaissance, telephone, adresse, cni],

        function (tx, result) {

         console.log("Membre enregistré avec succès.");

         const id = result.insertId;

        // ===CRÉER LE NUMÉRO DE COMPTE

         const numero = String(id).padStart(4, "0");

         const compte = "LB026-" + numero;

         console.log("Compte :",compte );

        // ===ENREGISTRER LE COMPTE

        tx.executeSql("UPDATE membres SET compte = ? WHERE id_membre = ?", [compte, id],

        function () {

         console.log("Compte enregistré :", compte);

         alert("Membre ajouté avec succès.\n" + "Compte : " + compte );

         formulaire.reset();

         window.location.href = "liste.html";

        });

       });
     });
    };

  // ===CONVERTIR IMAGE EN BASE64
     lecteur.readAsDataURL(fichier);

 }else{

    alert('aucune photo selectionne!!');
    
    db.transaction(function (tx) {

     tx.executeSql(`INSERT INTO membres(photo, nom, prenom, sexe, date_naissance, lieu_naissance, telephone, adresse, cni)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [photo, nom, prenom, sexe, dateNaissance, lieuNaissance, telephone, adresse, cni],

        function (tx, result) {

         console.log("Membre enregistré avec succès.");

         const id = result.insertId;

        // ===CRÉER LE NUMÉRO DE COMPTE

         const numero = String(id).padStart(4, "0");

         const compte = "LB026-" + numero;

         console.log("Compte :",compte );

        // ===ENREGISTRER LE COMPTE

        tx.executeSql("UPDATE membres SET compte = ? WHERE id_membre = ?", [compte, id],

        function () {

         console.log("Compte enregistré :", compte);

         alert("Membre ajouté avec succès.\n" + "Compte : " + compte );

         formulaire.reset();

         window.location.href = "liste.html";

        });

       });
     });
 }






 });
});
