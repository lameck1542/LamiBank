document.addEventListener("deviceready", function () {

    const formulaire = document.getElementById("register");

    formulaire.addEventListener("submit", function (event) {

        event.preventDefault();

        const nom = document.getElementById("nom").value.trim();
        const prenom = document.getElementById("prenom").value.trim();
        const photoInput = document.getElementById("photo");

        if (nom === "" || prenom === "") {
            alert("Veuillez remplir tous les champs.");
            return;
        }

       let photo = "../assets/images/profil.jpg";

       if(photoInput.files.length > 0){
        const fichier = photoInput.files[0];
        const lecteur = new FileReader();

        lecteur.onload = function () {

            const photo = lecteur.result;

            db.transaction(function (tx) {

                tx.executeSql(
                    "DELETE FROM utilisateur",
                    [],
                    function () {

                        tx.executeSql(
                            `INSERT INTO utilisateur 
                            (nom, prenom, photo) 
                            VALUES (?, ?, ?)`,
                            [nom, prenom, photo],
                        
                        function(){
                            alert("Bienvenue sur la gestion de LamiBank!.");
                            window.location.href = "accueil.html";
                        });
                    });
            });
        }
    lecteur.readAsDataURL(fichier);

 }else{

    db.transaction(function (tx) {

     tx.executeSql("DELETE FROM utilisateur",[],
        function () {
           tx.executeSql(`INSERT INTO utilisateur (nom, prenom, photo) VALUES (?, ?, ?)`, [nom, prenom, photo],
        function(){
            alert("Bienvenue sur la gestion de LamiBank!.");
            window.location.href = "accueil.html";

        });
    });
});
}






});

});