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


document.addEventListener("databaseReady",        function(){                                               const parametres = new URLSearchParams(                   window.location.search);
                                                          const id = parametres.get("id");
                                                          db.transaction(function(tx){
                tx.executeSql(                                            "SELECT * FROM membres WHERE id_membre =?",[id],                                            function(tx,result){                               const membre = result.rows.item(0);
                     document.getElementById("photoMembre").src = membre.photo;                                                                                            document.getElementById("nomMembre").textContent = membre.nom+" "+membre.prenom ;
                     document.getElementById("cniMembre").textContent = membre.cni ;                                                                                       document.getElementById("telMembre").textContent = membre.telephone ;          
                     document.getElementById("membreAdresse").textContent = membre.adresse ;
                     
                     document.getElementById("membreSolde").textContent = membre.solde;
                })                                        })
  
    db.transaction(function(tx){
	tx.executeSql(
		'SELECT	* FROM operations WHERE id_membre=? ORDER BY date_operation DESC',[id],
		
		function(tx,result){
		
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

 const colonneMotif = document.createElement("td");

 colonneMotif.textContent = activite.motif;

 const colonneMontant = document.createElement("td");
 
 colonneMontant.textContent = Number(
 activite.montant).toLocaleString(
	"fr-FR") + " FBU";

  const colonneDate = document.createElement("td");

 colonneDate.textContent = afficherDate(
 activite.date_operation);

 ligne.appendChild(colonneActivite);

 ligne.appendChild(colonneMotif);

 ligne.appendChild(colonneMontant);

 ligne.appendChild(colonneDate);

 tableau.appendChild(ligne);
	
 }
		})
}) 
})
