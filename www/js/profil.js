let membreActuel = null;


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


document.addEventListener("databaseReady",
    function(){ 
        const parametres = new URLSearchParams(window.location.search);
        const id = parametres.get("id");
                                                          db.transaction(function(tx){
                tx.executeSql(                                            "SELECT * FROM membres WHERE id_membre =?",[id],
  
  function(tx,result){
	const membre = result.rows.item(0);
	
	membreActuel = membre;

//faire apparaitre la page modifier
const iconeModifier = document.getElementById("icone-modifier");
iconeModifier.href = "modifier.html?id=" + membreActuel.id_membre;
	
 document.getElementById("photoMembre").src = membre.photo;                                                                                            document.getElementById("nomMembre").textContent = membre.nom+" "+membre.prenom ;

document.getElementById("cniMembre").textContent = membre.cni ;

document.getElementById("telMembre").textContent = membre.telephone ;          
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

//faire apparaitre la carte de dépot
const depotCard = document.getElementById("depot");
depotCard.addEventListener("click",
function(){
	document.getElementById("carte-depot").style.display = "block";
	document.getElementById("operations-profil").style.display = "none";
}
)

//faire apparaitre la carte de retrait
const retraitCard = document.getElementById("retrait");
retraitCard.addEventListener("click",
function(){
	document.getElementById("carte-retrait").style.display = "block";
	document.getElementById("operations-profil").style.display = "none";
}
)

//faire disparaitre la carte depot
const fermerCarte = document.getElementById("fermer-carte");
fermerCarte.addEventListener("click",
function(){
	document.getElementById("carte-depot").style.display = "none";
	document.getElementById("operations-profil").style.display = "block";
}
)


//faire disparaitre la carte retrait
const fermerRetrait = document.getElementById("fermer-retrait");
fermerRetrait.addEventListener("click",
function(){
	document.getElementById("carte-retrait").style.display = "none";
	document.getElementById("operations-profil").style.display = "block";
}
)

//gerer le formulaire de dépot
const formDepot = document.getElementById("form-depot");

formDepot.addEventListener("submit",
function(event){
	event.preventDefault();
	
const montantDepot = Number(document.getElementById("montant-depot").value.trim());

if (montantDepot <= 0 || isNaN(montantDepot)) {
 alert( "Veuillez entrer un montant valide.");
 return;
 }

const soldeActuel = Number(membreActuel.solde);

const soldeNouveau = soldeActuel + montantDepot;

const id = membreActuel.id_membre;

const motifDepot = document.getElementById("motif-depot").value.trim();

db.transaction(function(tx){
	
	tx.executeSql(`INSERT INTO operations(type_operation, id_membre, montant, motif, nouveau_solde) VALUES(?,?,?,?,?)`, ["depot", id, montantDepot, motifDepot, soldeNouveau],
	
	function(){
		
		tx.executeSql(`UPDATE membres SET solde=? WHERE id_membre=?`,[soldeNouveau, id],
		
		function(){
	
    membreActuel.solde = soldeNouveau;
    
    document.getElementById("membreSolde").textContent = soldeNouveau + " FBU";
    
    document.getElementById("carte-depot").style.display = "none";
    document.getElementById("operations-profil").style.display="block";
    
    alert(
				"Dépôt effectué avec succès !\n\n" + "Montant : " + montantDepot + " FBU\n" +
      "Nouveau solde : " + soldeNouveau + " FBU" );
      
    location.reload();
		}
		)
	}
	
	)
})


}
)

//gerer le formulaire de retrait
const formRetrait = document.getElementById("form-retrait");

formRetrait.addEventListener("submit",
function(event){
	event.preventDefault();
	
const montantRetrait = Number(document.getElementById("montant-retrait").value.trim());

if (montantRetrait <= 0 || isNaN(montantRetrait)) {
 alert( "Veuillez entrer un montant valide.");
 return;
 }

const soldeExiste = Number(membreActuel.solde);

const nouveauSolde = soldeExiste - montantRetrait;

const id = membreActuel.id_membre;

const motifRetrait = document.getElementById("motif-retrait").value.trim();

if(montantRetrait > soldeExiste){
	alert("Solde insuffisant!.")
	return;
}

db.transaction(function(tx){
	
	tx.executeSql(`INSERT INTO operations(type_operation, id_membre, montant, motif, nouveau_solde) VALUES(?,?,?,?,?)`, ["retrait", id, montantRetrait, motifRetrait, nouveauSolde],
	
	function(){
		
		tx.executeSql(`UPDATE membres SET solde=? WHERE id_membre=?`,[nouveauSolde, id],
		
		function(){
	
    membreActuel.solde = nouveauSolde;
    
    document.getElementById("membreSolde").textContent = nouveauSolde + " FBU";
    
    document.getElementById("carte-retrait").style.display = "none";
    document.getElementById("operations-profil").style.display="block";
    
    alert(
				"Rétrait effectué avec succès !\n\n" + "Montant : " + montantRetrait + " FBU\n" +
      "Nouveau solde : " + nouveauSolde + " FBU" );
      
    location.reload();
		})
	})
})
})

 
});