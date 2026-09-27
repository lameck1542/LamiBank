let membreActuel = null;

document.addEventListener("databaseReady",
function(){
	
const parametres = new URLSearchParams(window.location.search);
  
const id = parametres.get("id");
  
  db.transaction(function(tx){
	tx.executeSql(`SELECT * FROM membres WHERE id_membre=?`,[id],
	
	function(tx, result){

		const membre = result.rows.item(0);

		membreActuel = membre;

		//Remplir les champs avant de changer
		document.getElementById("nom").value = membre.nom;
		document.getElementById("prenom").value = membre.prenom;
		document.getElementById("sexe").value = membre.sexe;
		document.getElementById("cni").value = membre.cni;
		document.getElementById("adresse").value = membre.adresse;
		document.getElementById("telephone").value = membre.telephone;
	}
	)
  })

  const ModifierForm = document.getElementById("form-modifier");
  
  ModifierForm.addEventListener("submit", 
	function(event){
		event.preventDefault();
	
	//Recuperer les valeurs saisie par le gestionnaire
	const nom = document.getElementById("nom").value.trim();
	const prenom = document.getElementById("prenom").value.trim();
	const sexe = document.getElementById("sexe").value.trim();
	const cni = document.getElementById("cni").value.trim();
	const adresse = document.getElementById("adresse").value.trim();
	const telephone = document.getElementById("telephone").value.trim();
	const photoInput = document.getElementById("photo");

	 if (nom === "" || prenom === "" || sexe ===""  || cni ===""  || adresse ===""   || telephone ==="") {
            alert("Veuillez remplir tous les champs.");
            return;
        }
	
		 
       let photo = membreActuel.photo;

	   if(photoInput.files.length > 0){
		const fichier = photoInput.files[0];

		const lecteur = new FileReader();

		lecteur.onload = function(){
			photo = lecteur.result;
			db.transaction(function(tx){
				tx.executeSql(`UPDATE membres SET nom=?, 
					prenom=?, sexe=?, cni=?, adresse=?, telephone=?, photo=? WHERE id_membre=?`, [nom, prenom, sexe, cni, adresse, telephone, photo, id],
				function(){
					alert("Modification reussi!.");
					window.location.href = "profil.html?id=" +id;
				})
			})
	   }

	   lecteur.readAsDataURL(fichier);

       }else{
		db.transaction(function(tx){
				tx.executeSql(`UPDATE membres SET nom=?, 
					prenom=?, sexe=?, cni=?, adresse=?, telephone=?, photo=? WHERE id_membre=?`, 
					[nom, prenom, sexe, cni, adresse, telephone, photo, id],
				function(){
					alert("Modification reussi!.");
					window.location.href = "profil.html?id=" +id;

	//vider les champs apres la modification
	   document.getElementById("nom").value ="";
	   document.getElementById("prenom").value ="";
	   document.getElementById("sexe").value ="";
	   document.getElementById("cni").value ="";
	   document.getElementById("adresse").value = "";
	   document.getElementById("telephone").value ="";
	   
				})
			})
	   }
})
})