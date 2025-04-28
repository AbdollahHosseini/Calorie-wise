 // Age dropdown
 const ageDropdown = document.getElementById("age");
 for (let age = 18; age <= 100; age++) {
   const option = document.createElement("option");
   option.value = age;
   option.textContent = age;
   ageDropdown.appendChild(option);
 }

 // Weight dropdown
 const weightUnit = document.getElementById("weightUnit");
 const weightValue = document.getElementById("weightValue");

 function populateWeightOptions(unit) {
   weightValue.innerHTML = '<option value="">--Choose weight--</option>';
   let min = unit === "kg" ? 30 : 66;
   let max = unit === "kg" ? 200 : 440;
   for (let i = min; i <= max; i++) {
     const option = document.createElement("option");
     option.value = i;
     option.textContent = `${i} ${unit}`;
     weightValue.appendChild(option);
   }
 }

 populateWeightOptions(weightUnit.value);
 weightUnit.addEventListener("change", () => {
   populateWeightOptions(weightUnit.value);
 });

 // Height dropdown
 const heightUnit = document.getElementById("heightUnit");
 const heightValue = document.getElementById("heightValue");

 function populateHeightOptions(unit) {
   heightValue.innerHTML = '<option value="">--Choose height--</option>';
   if (unit === "cm") {
     for (let cm = 140; cm <= 220; cm++) {
       const option = document.createElement("option");
       option.value = cm;
       option.textContent = `${cm} cm`;
       heightValue.appendChild(option);
     }
   } else if (unit === "ft") {
     for (let feet = 4; feet <= 7; feet++) {
       for (let inches = 0; inches < 12; inches++) {
         const totalInches = feet * 12 + inches;
         const label = `${feet}'${inches}"`;
         const option = document.createElement("option");
         option.value = totalInches;
         option.textContent = label;
         heightValue.appendChild(option);
       }
     }
   }
 }

 populateHeightOptions(heightUnit.value);
 heightUnit.addEventListener("change", () => {
   populateHeightOptions(heightUnit.value);
 });

 // Submit handler
 const form = document.getElementById("questionnaireForm");
 form.addEventListener("submit", function (e) {
   e.preventDefault();

   const goal = document.querySelector('input[name="goal"]:checked')?.value;
   const age = document.getElementById("age").value;
   const weight = document.getElementById("weightValue").value;
   const weightUnitVal = document.getElementById("weightUnit").value;
   const height = document.getElementById("heightValue").value;
   const heightUnitVal = document.getElementById("heightUnit").value;
   const sex = document.querySelector('input[name="sex"]:checked')?.value;
   const diets = Array.from(document.querySelectorAll('input[name="diet"]:checked')).map(cb => cb.value);

   console.log({
     goal,
     age,
     weight,
     weightUnit: weightUnitVal,
     height,
     heightUnit: heightUnitVal,
     sex,
     diets,
   });
 });